import express from "express"
import "dotenv/config";
import cors from "cors";
import rateLimit from "express-rate-limit";
import connectDB from "./config/db.js";
import userRouter from "./routes/userRoutes.js";
import hotelRouter from "./routes/hotelRoutes.js";
import connectCloudinary from "./config/cloudinary.js";
import roomRouter from "./routes/roomRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";

connectDB();
connectCloudinary();

const app = express()
app.use(express.json());

const allowedOrigins = process.env.FRONTEND_URL?.split(',') || ['http://localhost:5173'];
app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { success: false, message: "Too many requests, please try again later" },
    standardHeaders: true,
    legacyHeaders: false,
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { success: false, message: "Too many auth attempts, please try again later" },
    standardHeaders: true,
    legacyHeaders: false,
});

app.use('/api/', apiLimiter);
app.use('/api/user/google-auth', authLimiter);

app.get('/', (req, res) => res.send("API is working correctly"));
app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));
app.use('/api/user', userRouter);
app.use('/api/hotels',hotelRouter);
app.use('/api/rooms', roomRouter);
app.use('/api/bookings', bookingRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on PORT: ${PORT}`)
});