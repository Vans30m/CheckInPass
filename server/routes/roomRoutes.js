import express from 'express';
import upload from '../middleware/uploadMiddleware.js';
import { protect } from '../middleware/authMiddleware.js';
import { createRoom, getOwnerRooms, getRooms, toggleRoomAvailability } from '../controllers/roomController.js';

{/* creates an express instance that can be used to define routes (/api/rooms/ creates base path and we append our routes to it like /createRoom, /getRooms etc.) */ }
const roomRouter = express.Router();

{/*/ upload.array("images", 4) -> multer that handles arrays of images up to 4 images and createRoom -> uploads images to cloudinary and saves room details to db */ }
roomRouter.post('/', upload.array("images", 4), protect, createRoom);

{/*/ Get rooms for display */ }
roomRouter.get('/', getRooms);

{/*/ Get rooms of specific owner */ }
roomRouter.get('/owner', protect, getOwnerRooms);

{/*/ Toggle room availability state to true or false */ }
roomRouter.post('/toggle-availability', protect, toggleRoomAvailability);


export default roomRouter;