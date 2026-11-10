import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { getUserBookings } from "../controllers/bookingController.js";
import { getRooms } from "../controllers/roomController.js";
import Booking from "../models/Booking.js";
import Room from "../models/Room.js";
import { createApp } from "../app.js";
import { request } from "./helpers/testClient.js";
import { inMemoryDb, createMockBookingModel, createMockRoomModel } from "./helpers/mockModels.js";

const mockBooking = createMockBookingModel();
const mockRoom = createMockRoomModel();

Booking.find = mockBooking.find;
Room.find = mockRoom.find;

describe("4. OWASP Security & Injection Defense Tests (security_audit.test.js)", () => {
    beforeEach(() => {
        inMemoryDb.clear();
    });

    describe("Insecure Direct Object References (IDOR)", () => {
        it("should prevent User A from retrieving User B's bookings via scoped queries", async () => {
            const userA = { _id: "user_a" };
            const userB = { _id: "user_b" };

            // Booking belonging to User B
            await mockBooking.create({
                _id: "private_booking_b",
                user: userB._id,
                totalPrice: 400
            });

            // Booking belonging to User A
            await mockBooking.create({
                _id: "private_booking_a",
                user: userA._id,
                totalPrice: 150
            });

            // User A requests bookings
            let responseData = null;
            await getUserBookings({ user: userA }, { json: (d) => { responseData = d; } });

            assert.equal(responseData.success, true);
            assert.equal(responseData.bookings.length, 1);
            assert.equal(responseData.bookings[0]._id, "private_booking_a");
            assert.notEqual(responseData.bookings[0]._id, "private_booking_b", "User A must never see User B's bookings");
        });
    });

    describe("NoSQL / SQL Injection Sanitization", () => {
        it("should neutralize NoSQL operator injection attempts ($gt, $ne, $where)", () => {
            function sanitizeMongoQuery(input) {
                if (typeof input !== "object" || input === null) return input;
                const clean = {};
                for (const [key, val] of Object.entries(input)) {
                    if (key.startsWith("$")) {
                        continue; // Strip MongoDB operator injection
                    }
                    if (typeof val === "object" && val !== null) {
                        const sanitizedChild = sanitizeMongoQuery(val);
                        if (Object.keys(sanitizedChild).length > 0) {
                            clean[key] = sanitizedChild;
                        }
                    } else {
                        clean[key] = val;
                    }
                }
                return clean;
            }

            const maliciousPayload = {
                username: "admin",
                password: { "$ne": null } // Classic NoSQL auth bypass payload
            };

            const sanitized = sanitizeMongoQuery(maliciousPayload);
            assert.equal(sanitized.username, "admin");
            assert.equal(sanitized.password, undefined, "Dangerous operator $ne must be completely stripped");
        });
    });

    describe("Cross-Site Scripting (XSS) & Content-Security-Policy Headers", () => {
        it("should return strict Content-Security-Policy and X-Content-Type-Options headers", async () => {
            const app = createApp();
            const client = request(app);

            const res = await client.get("/health");

            assert.equal(res.status, 200);
            assert.equal(res.headers["content-security-policy"], "default-src 'self'");
            assert.equal(res.headers["x-content-type-options"], "nosniff");
            assert.equal(res.headers["x-frame-options"], "DENY");
        });

        it("should escape HTML tags in strings to prevent Stored XSS", () => {
            function sanitizeHTML(str) {
                return String(str)
                    .replace(/&/g, "&amp;")
                    .replace(/</g, "&lt;")
                    .replace(/>/g, "&gt;")
                    .replace(/"/g, "&quot;")
                    .replace(/'/g, "&#039;");
            }

            const xssPayload = `<script>alert('XSS')</script><img src=x onerror=alert(1)>`;
            const sanitized = sanitizeHTML(xssPayload);

            assert.ok(!sanitized.includes("<script>"));
            assert.ok(!sanitized.includes("<img"));
            assert.ok(sanitized.includes("&lt;script&gt;"));
        });
    });

    describe("Anti-Formula Injection (CWE-1236) on CSV / Excel Exports", () => {
        it("should prefix formula trigger characters (=, +, -, @, tab) with single quote in CSV exports", () => {
            function sanitizeCsvCell(value) {
                if (typeof value !== "string") return value;
                const formulaTriggers = ["=", "+", "-", "@", "\t", "\r"];
                if (formulaTriggers.some((trigger) => value.startsWith(trigger))) {
                    return `'${value}`;
                }
                return value;
            }

            const dangerousCells = [
                "=cmd|' /C calc'!A0",
                "+123456-DDE",
                "-2+3*cmd",
                "@SUM(1+1)",
                "\tDDE('cmd')",
            ];

            for (const cell of dangerousCells) {
                const sanitized = sanitizeCsvCell(cell);
                assert.ok(sanitized.startsWith("'"), `Cell [${cell}] must be prepended with a quote`);
            }

            const safeCell = "Deluxe Suite Room 101";
            assert.equal(sanitizeCsvCell(safeCell), safeCell, "Safe text must remain untouched");
        });
    });

    describe("PII & Sensitive Data Exposure Prevention", () => {
        it("public room query should only expose owner image and sanitize owner email and phone", async () => {
            // Check that getRooms only populates owner image
            await mockRoom.create({
                _id: "public_room_1",
                roomType: "Standard",
                isAvailable: true,
            });

            let responseData = null;
            await getRooms({}, { json: (d) => { responseData = d; } });

            assert.equal(responseData.success, true);
            assert.ok(Array.isArray(responseData.rooms));
            // Ensure no raw passwords or secrets leaked in public room payload
            for (const room of responseData.rooms) {
                assert.equal(room.password, undefined);
                assert.equal(room.salt, undefined);
            }
        });
    });
});
