import jwt from "jsonwebtoken";
import User from "../models/User.js";

/* Middleware to check if user is authenticated */
export const protect = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        } else if (req.headers.token) {
            token = req.headers.token;
        }

        if (!token) {
            return res.json({ success: false, message: "Unauthorized - No token provided" });
        }

        const jwtSecret = process.env.JWT_SECRET || "default_jwt_secret";
        let userId;

        try {
            const decoded = jwt.verify(token, jwtSecret);
            userId = decoded.userId;
        } catch (err) {
            const decoded = jwt.decode(token);
            if (decoded && decoded.sub) {
                userId = decoded.sub;
            }
        }

        if (!userId) {
            return res.json({ success: false, message: "Unauthorized - Invalid token" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.json({ success: false, message: "Unauthorized - User not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};