import express from "express";
import cors from "cors";
import userRouter from "./routes/userRoutes.js";
import hotelRouter from "./routes/hotelRoutes.js";
import roomRouter from "./routes/roomRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";

export const createApp = () => {
    const app = express();
    app.use(express.json());

    // Security & CSP / Standard Headers
    app.use((req, res, next) => {
        res.setHeader("Content-Security-Policy", "default-src 'self'");
        res.setHeader("X-Content-Type-Options", "nosniff");
        res.setHeader("X-Frame-Options", "DENY");
        next();
    });

    const allowedOrigins = process.env.FRONTEND_URL?.split(',') || ['http://localhost:5173'];
    app.use(cors({
        origin: allowedOrigins,
        credentials: true
    }));

    // Routes
    app.get('/', (req, res) => res.send("API is working correctly"));
    app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));
    app.get('/api/v1/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));
    
    app.use('/api/user', userRouter);
    app.use('/api/hotels', hotelRouter);
    app.use('/api/rooms', roomRouter);
    app.use('/api/bookings', bookingRouter);

    // 404 handler for unknown routes returning clean JSON
    app.use((req, res) => {
        res.status(404).json({ success: false, message: "Resource not found" });
    });

    // Global error handler
    app.use((err, req, res, next) => {
        res.status(err.status || 500).json({ success: false, message: err.message || "Internal Server Error" });
    });

    return app;
};

