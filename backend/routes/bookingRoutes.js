import express from 'express';
import { checkAvailabilityAPI, createBooking, getHotelBookings, getUserBookings, markBookingAsPaid } from '../controllers/bookingController.js';
import { protect } from '../middleware/authMiddleware.js';


/* creates express router to group all booking related routes */
const bookingRouter = express.Router();

/* API endpoints */
bookingRouter.post('/checkAvailability', checkAvailabilityAPI);
bookingRouter.post('/book', protect, createBooking);
bookingRouter.post('/pay', protect, markBookingAsPaid);
bookingRouter.get('/user', protect, getUserBookings);
bookingRouter.get('/hotel', protect, getHotelBookings);

export default bookingRouter;