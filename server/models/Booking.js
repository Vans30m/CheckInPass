import mongoose from "mongoose";

/* initializes a new moongose schema with object named BookingSchema */
const BookingSchema = new mongoose.Schema({
    user: { type: String, ref: "User", required: true },   /* ref -> establishes relationship */
    room: { type: String, ref: "Room", required: true },
    hotel: { type: String, ref: "Hotel", required: true },
    checkInDate: { type: Date, required: true },
    checkOutDate: { type: Date, required: true },
    totalPrice: { type: Number, required: true },
    guest: { type: Number, required: true },
    status: { type: String, enum: ["pending", "confirmed", "cancelled"], default: "pending" },     /* enum -> one of the data must be from the given list only */
    paymentMethod: { type: String, enum: ["Pay at Hotel", "UPI", "Card"], default: "Pay at Hotel" },
    isPaid: { type: Boolean, default: false },
}, { timestamps: true })   /* timestamps -> automatically adds createdAt and updatedAt fields */

const Booking = mongoose.model("Booking", BookingSchema); /* creates and compiles a mongoose model named Booking. This model provides an interface to use .find(), .create(), etc. */

export default Booking;