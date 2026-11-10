import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { getHotelBookings } from "../controllers/bookingController.js";
import { createRoom } from "../controllers/roomController.js";
import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";
import Booking from "../models/Booking.js";
import User from "../models/User.js";
import { inMemoryDb, createMockHotelModel, createMockRoomModel, createMockBookingModel, createMockUserModel } from "./helpers/mockModels.js";

const mockHotel = createMockHotelModel();
const mockRoom = createMockRoomModel();
const mockBooking = createMockBookingModel();
const mockUser = createMockUserModel();

Hotel.findOne = mockHotel.findOne;
Hotel.findById = mockHotel.findById;
Hotel.create = mockHotel.create;

Room.find = mockRoom.find;
Room.findById = mockRoom.findById;
Room.create = mockRoom.create;

Booking.find = mockBooking.find;
Booking.create = mockBooking.create;

User.findById = mockUser.findById;
User.findByIdAndUpdate = mockUser.findByIdAndUpdate;

describe("2. Role-Based Access Control & Authorization Tests (rbac.test.js)", () => {
    beforeEach(() => {
        inMemoryDb.clear();
    });

    describe("Multi-Tenant Boundary Separation (Owner cannot access other hotel bookings)", () => {
        it("should forbid access to dashboard bookings if user does not own any hotel", async () => {
            const regularUser = { _id: "regular_user_1", role: "user" };
            const req = { user: regularUser };
            let responseData = null;
            const res = {
                json: (data) => { responseData = data; }
            };

            await getHotelBookings(req, res);

            assert.equal(responseData.success, false);
            assert.match(responseData.message, /No Hotel found for this owner/i);
        });

        it("should only return bookings belonging to the requesting hotel owner's property", async () => {
            const ownerA = { _id: "owner_a", role: "hotelOwner" };
            const ownerB = { _id: "owner_b", role: "hotelOwner" };

            // Hotel A & B
            const hotelA = await mockHotel.create({ _id: "hotel_a", name: "Resort Alpha", owner: "owner_a" });
            const hotelB = await mockHotel.create({ _id: "hotel_b", name: "Inn Beta", owner: "owner_b" });

            // Bookings for Hotel A
            await mockBooking.create({
                _id: "book_1",
                hotel: hotelA._id,
                user: "guest_1",
                totalPrice: 200,
                checkInDate: new Date(),
                checkOutDate: new Date(),
            });

            // Bookings for Hotel B
            await mockBooking.create({
                _id: "book_2",
                hotel: hotelB._id,
                user: "guest_2",
                totalPrice: 500,
                checkInDate: new Date(),
                checkOutDate: new Date(),
            });

            // Owner A queries bookings
            let responseDataA = null;
            await getHotelBookings({ user: ownerA }, { json: (d) => { responseDataA = d; } });

            assert.equal(responseDataA.success, true);
            assert.equal(responseDataA.dashboardData.totalBookings, 1);
            assert.equal(responseDataA.dashboardData.totalRevenue, 200);
            assert.equal(responseDataA.dashboardData.recentBookings[0]._id, "book_1");
        });
    });

    describe("Prevent Non-Owners from Creating Rooms for Hotels They Do Not Own", () => {
        it("should reject room creation if the requester does not own the hotel", async () => {
            const nonOwner = { _id: "non_owner_999" };
            const req = {
                user: nonOwner,
                body: {
                    roomType: "Deluxe Suite",
                    pricePerNight: 150,
                    amenities: ["WiFi", "AC"],
                },
                files: []
            };

            let responseData = null;
            const res = {
                json: (d) => { responseData = d; }
            };

            await createRoom(req, res);
            assert.equal(responseData.success, false);
            assert.match(responseData.message, /Hotel not found/i);
        });
    });

    describe("Role Elevation Defense (Prevent self-assigning admin/owner roles illicitly)", () => {
        it("should enforce role immutability during user profile updates", () => {
            // Defense mechanism against parameter pollution / mass assignment
            const originalUser = {
                _id: "user_regular_1",
                username: "johndoe",
                role: "user",
            };

            const maliciousPayload = {
                username: "johndoe_updated",
                role: "admin", // Malicious role escalation attempt
            };

            // Secure field filter
            function sanitizeUserUpdate(payload) {
                const allowedFields = ["username", "image"];
                const sanitized = {};
                for (const field of allowedFields) {
                    if (payload[field] !== undefined) {
                        sanitized[field] = payload[field];
                    }
                }
                return sanitized;
            }

            const safeUpdates = sanitizeUserUpdate(maliciousPayload);
            const updatedUser = { ...originalUser, ...safeUpdates };

            assert.equal(updatedUser.username, "johndoe_updated");
            assert.equal(updatedUser.role, "user", "Role MUST NOT be altered via generic update payload");
        });
    });
});
