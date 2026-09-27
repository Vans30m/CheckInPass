import Hotel from "../models/Hotel.js";
import User from "../models/User.js";


export const registerHotel = async (req, res) => {
    try {
        const { name, address, contact, city } = req.body;
        const owner = req.user._id;

        if (!name || !address || !contact || !city) {
            return res.json({ success: false, message: "Please fill in all fields" });
        }

        {/* check if user already exists or not */ }
        const hotel = await Hotel.findOne({ owner });
        if (hotel) {
            await User.findByIdAndUpdate(owner, { role: 'hotelOwner' });
            return res.json({ success: true, message: "Hotel already registered" });
        }

        {/* else creates a hotel and updates the user role to hotelOwner */ }
        await Hotel.create({ name, address, contact, city, owner });
        await User.findByIdAndUpdate(owner, { role: 'hotelOwner' });
        res.json({ success: true, message: "Hotel registered successfully" });
    }
    catch (error) {
        res.json({ success: false, message: error.message });
    }
}