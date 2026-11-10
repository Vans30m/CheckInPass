import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { createBooking, markBookingAsPaid } from "../controllers/bookingController.js";
import { toggleRoomAvailability } from "../controllers/roomController.js";
import Booking from "../models/Booking.js";
import Room from "../models/Room.js";
import Hotel from "../models/Hotel.js";
import User from "../models/User.js";
import { inMemoryDb, createMockBookingModel, createMockRoomModel, createMockHotelModel, createMockUserModel } from "./helpers/mockModels.js";

const mockBooking = createMockBookingModel();
const mockRoom = createMockRoomModel();
const mockHotel = createMockHotelModel();
const mockUser = createMockUserModel();

Booking.find = mockBooking.find;
Booking.findById = mockBooking.findById;
Booking.create = mockBooking.create;

Room.findById = mockRoom.findById;
Hotel.findById = mockHotel.findById;
User.findById = mockUser.findById;

describe("3. Business Logic & Schema Boundary Conditions Tests (business_logic.test.js)", () => {
    beforeEach(() => {
        inMemoryDb.clear();
    });

    describe("Booking Price & Nights Calculation Boundary Conditions", () => {
        it("should accurately compute total price based on date delta (multi-night)", async () => {
            const hotel = await mockHotel.create({ _id: "hotel_calc_1", name: "Seaside Resort" });
            const room = await mockRoom.create({
                _id: "room_calc_1",
                hotel: hotel._id,
                roomType: "Ocean Suite",
                pricePerNight: 200,
            });

            const req = {
                user: { _id: "traveler_1" },
                body: {
                    room: room._id,
                    checkInDate: "2026-12-01",
                    checkOutDate: "2026-12-04", // 3 nights
                    guests: 2
                }
            };

            let responseData = null;
            await createBooking(req, { json: (d) => { responseData = d; } });

            assert.equal(responseData.success, true);
            assert.equal(responseData.booking.totalPrice, 600, "3 nights * 200 = 600");
            assert.equal(responseData.booking.guest, 2);
        });

        it("should default to 1 night minimum when checkIn and checkOut are identical or boundary zero", async () => {
            const hotel = await mockHotel.create({ _id: "hotel_calc_2", name: "Metro Hotel" });
            const room = await mockRoom.create({
                _id: "room_calc_2",
                hotel: hotel._id,
                roomType: "Standard Single",
                pricePerNight: 100,
            });

            const req = {
                user: { _id: "traveler_2" },
                body: {
                    room: room._id,
                    checkInDate: "2026-12-01",
                    checkOutDate: "2026-12-01", // Same day
                    guests: 1
                }
            };

            let responseData = null;
            await createBooking(req, { json: (d) => { responseData = d; } });

            assert.equal(responseData.success, true);
            assert.equal(responseData.booking.totalPrice, 100, "1 night minimum fallback");
        });
    });

    describe("Room Overbooking & Date Overlap Prevention", () => {
        it("should reject booking when conflicting reservation exists for requested dates", async () => {
            const hotel = await mockHotel.create({ _id: "hotel_overlap", name: "City Center Hotel" });
            const room = await mockRoom.create({
                _id: "room_overlap_1",
                hotel: hotel._id,
                pricePerNight: 120,
            });

            // Existing confirmed booking from Dec 5 to Dec 10
            await mockBooking.create({
                room: room._id,
                checkInDate: "2026-12-05",
                checkOutDate: "2026-12-10",
                totalPrice: 600,
            });

            // New booking attempt overlapping Dec 7 to Dec 12
            const req = {
                user: { _id: "traveler_conflict" },
                body: {
                    room: room._id,
                    checkInDate: "2026-12-07",
                    checkOutDate: "2026-12-12",
                    guests: 1
                }
            };

            let responseData = null;
            await createBooking(req, { json: (d) => { responseData = d; } });

            assert.equal(responseData.success, false);
            assert.match(responseData.message, /Room is not available for these dates/i);
        });
    });

    describe("State Machine & Lifecycle Transitions", () => {
        it("should transition booking status from pending to confirmed upon markBookingAsPaid", async () => {
            const user = await mockUser.create({
                _id: "guest_paid_1",
                username: "Bob",
                email: "bob@example.com"
            });
            const hotel = await mockHotel.create({
                _id: "hotel_paid_1",
                name: "Luxury Inn",
                address: "456 Avenue"
            });
            const booking = await mockBooking.create({
                _id: "b_status_test",
                user: user._id,
                hotel: hotel._id,
                status: "pending",
                isPaid: false,
                totalPrice: 350,
                checkInDate: "2026-11-20",
                checkOutDate: "2026-11-22",
            });

            let responseData = null;
            await markBookingAsPaid({ body: { bookingId: booking._id } }, { json: (d) => { responseData = d; } });

            assert.equal(responseData.success, true);
            
            const updated = inMemoryDb.bookings.get(booking._id);
            assert.equal(updated.isPaid, true);
            assert.equal(updated.status, "confirmed");
        });

        it("should toggle room availability between true and false deterministically", async () => {
            const room = await mockRoom.create({
                _id: "room_toggle_1",
                isAvailable: true,
            });

            let response1 = null;
            await toggleRoomAvailability({ body: { roomId: room._id } }, { json: (d) => { response1 = d; } });
            assert.equal(response1.success, true);
            assert.equal(inMemoryDb.rooms.get(room._id).isAvailable, false);

            let response2 = null;
            await toggleRoomAvailability({ body: { roomId: room._id } }, { json: (d) => { response2 = d; } });
            assert.equal(response2.success, true);
            assert.equal(inMemoryDb.rooms.get(room._id).isAvailable, true);
        });
    });
});
