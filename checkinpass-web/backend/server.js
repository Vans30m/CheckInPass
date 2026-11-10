import "dotenv/config";
import rateLimit from "express-rate-limit";
import connectDB from "./config/db.js";
import connectCloudinary from "./config/cloudinary.js";
import { createApp } from "./app.js";

connectDB();
connectCloudinary();

const app = createApp();

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

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on PORT: ${PORT}`);
});

export default app;
