import { v2 as cloudinary } from "cloudinary";
import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";


/* API to create a room for a hotel */
{/* export .. -> allows a logged in hotel owner to create a new room listing */ }
export const createRoom = async (req, res) => {
    try {
        {/* gets requested data like roomtype, ppnight, amenities, city from body */ }
        const { roomType, pricePerNight, amenities, city } = req.body;

        {/* finds hotel owned by logged in user */ }
        const hotel = await Hotel.findOne({ owner: req.user._id });

        {/* checks if hotel is found */ }
        if (!hotel) {
            return res.json({ success: false, message: "Hotel not found" });
        }

        {/* update hotel city/location if owner specifies a city */}
        if (city && city.trim()) {
            hotel.city = city.trim();
            await hotel.save();
        }

        {/* upload images to cloudinary - array of file objects */ }
        const uploadImages = (req.files || []).map(async (file) => {
            try {
                const response = await cloudinary.uploader.upload(file.path);
                return response.secure_url;
            } catch (err) {
                console.error(`Cloudinary upload failed for file ${file.originalname}:`, err.message);
            }
        });

        {/* wait for all uploads to complete */ }
        const images = await Promise.all(uploadImages);

        {/* create room in mongoDB */ }
        await Room.create({
            hotel: hotel._id,
            roomType,
            pricePerNight: +pricePerNight,
            amenities: typeof amenities === 'string' ? JSON.parse(amenities) : amenities,
            images,
        })
        res.json({ success: true, message: "Room created successfully" });
    }
    catch (error) {
        res.json({ success: false, message: error.message });
    }
}


/* API to get all rooms */
{/* export .. -> requests all the rooms */ }
export const getRooms = async (req, res) => {
    {/* const rooms = .. -> fetches all rooms that are available for booking */ }
    {/* .populate -> it includes hotel, hotel room and hotel owner */ }
    try {
        const rooms = await Room.find({ isAvailable: true }).populate({
            /* joins with hotel data */
            path: 'hotel',
            /* joins with hotel owner's data and profile image */
            populate: {
                path: 'owner',
                select: 'image',
            }
        }).sort({ createdAt: -1 });     // sorts by latest room created
        res.json({ success: true, rooms });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}


/* API to get all the rooms of a hotel owned by user */
export const getOwnerRooms = async (req, res) => {
    try {
        /* gets hotel owned by logged in user */
        const hotelData = await Hotel.findOne({ owner: req.user._id });
        /* if no hotel is found */
        if (!hotelData) {
            return res.json({ success: true, rooms: [] });
        }
        /* finds rooms that belongs to that hotel and populates it with hotel data */
        const rooms = await Room.find({ hotel: hotelData._id }).populate("hotel");
        res.json({ success: true, rooms });
    }
    catch (error) {
        res.json({ success: false, message: error.message })
    }
}


/* API to toggle availability of a room */
export const toggleRoomAvailability = async (req, res) => {
    try {
        const { roomId } = req.body;    // gets room id from req body
        const roomData = await Room.findById(roomId);    // finds room by id
        roomData.isAvailable = !roomData.isAvailable;    // toggles availability -> if true becomes false and vice-versa
        await roomData.save();    // saves changes
        res.json({ success: true, message: "Room availability toggled successfully" });

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}
