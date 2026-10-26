import Booking from "../models/Booking.js"
import Room from "../models/Room.js"
import Hotel from "../models/Hotel.js"
import transporter from "../config/nodemailer.js"

/* helper function to check availability of room */
const checkAvailability = async ({ checkInDate, checkOutDate, room }) => {
    try {
        const bookings = await Booking.find({
            room,
            checkInDate: { $lte: checkOutDate },    // $lte -> less than or equal to checkoutdate
            checkOutDate: { $gte: checkInDate },    // $gte -> greater than or equal to checkindate
        })
        const isAvailable = bookings.length === 0;  // checks there are zero conflicting bookings for that same date
        return isAvailable;
    } catch (error) {
        console.error(error.message);
        return false;
    }
}

/* API to check availability of room */
/* POST /api/bookings/check-availability */
export const checkAvailabilityAPI = async (req, res) => {
    try {
        const { room, roomId, checkInDate, checkOutDate } = req.body;
        const targetRoom = room || roomId;

        {/* calls checkAvailability helper function for checking room is available or not */ }
        const isAvailable = await checkAvailability({ checkInDate, checkOutDate, room: targetRoom });
        res.json({ success: true, isAvailable });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

/* APi to create a new booking */
/* POST /api/bookings/book */
export const createBooking = async (req, res) => {
    try {
        const { room, checkInDate, checkOutDate, guests } = req.body;
        const userId = req.user._id;

        {/* calls checkAvailability helper function for checking room is available or not */ }
        const isAvailable = await checkAvailability({ checkInDate, checkOutDate, room });
        if (!isAvailable) {
            return res.json({ success: false, message: "Room is not available for these dates" });
        }

        /* get totalPrice from room */
        const roomData = await Room.findById(room).populate("hotel");
        if (!roomData) {
            return res.json({ success: false, message: "Room not found" });
        }

        let totalPrice = roomData.pricePerNight;

        {/* calculate totalPrice based on the nights */ }
        const checkIn = new Date(checkInDate);  //converts date string to date object
        const checkOut = new Date(checkOutDate);
        const timeDiff = checkOut.getTime() - checkIn.getTime(); // gets time difference in milliseconds
        const nights = Math.ceil(timeDiff / (1000 * 3600 * 24)) || 1;

        totalPrice *= nights;

        {/* creates a new record in db with below details */ }
        const booking = await Booking.create({
            user: userId,
            room,
            hotel: roomData.hotel._id,
            guest: +guests || 1,
            checkInDate,
            checkOutDate,
            totalPrice,
        });

        res.json({ success: true, message: "Booking created successfully", booking });

    } catch (error) {
        console.error("Create booking error:", error);
        res.json({ success: false, message: "Failed to create Booking: " + error.message });
    }
}

/* API to get all booking for a user */
/* GET /api/bookings/user */
export const getUserBookings = async (req, res) => {
    try {
        const userId = req.user._id;

        {/* .populate("room hotel") -> tells Mongoose to the ID in room and hotel collections and attach them to the bookings and sorts by newest first */ }
        const bookings = await Booking.find({ user: userId }).populate("room hotel").sort({ createdAt: -1 });
        res.json({ success: true, bookings });
    } catch (error) {
        res.json({ success: false, message: "Failed to fetch bookings: " + error.message });
    }
}

export const getHotelBookings = async (req, res) => {
    try {
        const hotel = await Hotel.findOne({ owner: req.user._id });
        if (!hotel) {
            return res.json({ success: false, message: "No Hotel found for this owner" });
        }

        const bookings = await Booking.find({ hotel: hotel._id }).populate("room hotel user").sort({ createdAt: -1 });
        /* Total Bookings */
        const totalBookings = bookings.length;

        /* Total Revenue */
        // acc -> accumulator (keeps track of running total sum)
        const totalRevenue = bookings.reduce((acc, booking) => acc + booking.totalPrice, 0);

        res.json({ success: true, dashboardData: { totalBookings, totalRevenue, recentBookings: bookings } });
    } catch (error) {
        res.json({ success: false, message: "Failed to fetch hotel bookings: " + error.message });
    }
}

export const markBookingAsPaid = async (req, res) => {
    try {
        const { bookingId } = req.body;
        const booking = await Booking.findById(bookingId).populate('user hotel');
        if (!booking) {
            return res.json({ success: false, message: "Booking not found" });
        }

        booking.isPaid = true;
        booking.status = "confirmed";
        await booking.save();

        res.json({ success: true, message: "Payment successful!" });
        try {
            await transporter.sendMail({
                from: process.env.SENDER_EMAIL,
                to: booking.user.email,
                subject: "Booking Confirmation",
                html: `<h2>Booking Confirmed</h2>
                <p>Dear ${booking.user.username}</p>
                <p>Thank you for booking! Here are your booking details:</p>
                <ul>
                    <li><strong>Booking ID: </strong> ${booking._id}</li>
                    <li><strong>Hotel Name: </strong> ${booking.hotel.name}</li>
                    <li><strong>Location: </strong> ${booking.hotel.address}</li>
                    <li><strong>Check-In Date: </strong> ${booking.checkInDate}</li>
                    <li><strong>Check-Out Date: </strong> ${booking.checkOutDate}</li>
                    <li><strong>Total Amount: </strong> $${booking.totalPrice}</li>
                </ul>
                <br/>
                <p>This is a system generated email. Please do not reply to this email.</p>
                <p>Best regards,<br/>CheckInPass Team</p>`
            });
        } catch (error) {
            console.error("Nodemailer email sending failed:", error.message);
        }
    } catch (error) {
        res.json({ success: false, message: "Failed to mark as paid: " + error.message });
    }
};