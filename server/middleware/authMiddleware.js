import jwt from "jsonwebtoken";
import User from "../models/User.js";

/* protect -> Middleware to check if user is authenticated or not */
{/* req, res, next -> express middleware arguments */ }
export const protect = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];    // .split(" ") -> splits the string by space and returns an array; [1] -> gets the second token like this : ["Bearer", "eyJhbGciOiJIUzI1Ni..."]
        }
        else if (req.headers.token) {
            token = req.headers.token;
        }

        {/* checks if token exists or not */ }
        if (!token) {
            return res.json({ success: false, message: "Unauthorized - No token provided" });
        }

        {/* get jwt secret key from .env file */ }
        const jwtSecret = process.env.JWT_SECRET || "default_jwt_secret";
        let userId;

        {/* verify jwt token */ }
        try {
            const decoded = jwt.verify(token, jwtSecret);   // checks if token is signed with our secret key(jwtSecret) and not expired
            userId = decoded.userId || decoded.sub;    // stores userId from token of google or backend
        }
        catch (err) {
            {/* sub -> google token,  userId -> backend token */ }
            const decoded = jwt.decode(token);
            userId = decoded?.sub || decoded?.userId;   // ? -> it handles null or broken token without crashing and then checks if (!userId)
        }

        {/* checks if userId is extracted from jwt token */ }
        if (!userId) {
            return res.json({ success: false, message: "Unauthorized - Invalid token" });
        }

        {/* get user from db */ }
        const user = await User.findById(userId);
        if (!user) {
            return res.json({ success: false, message: "Unauthorized - User not found" });
        }

        req.user = user;    // attaches user record from db to req object
        next();     // tells express middleware to move to next functions as all checks are passed now
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};