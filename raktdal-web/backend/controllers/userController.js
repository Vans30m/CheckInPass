import User from "../models/User.js";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// POST /api/user/google-auth
export const googleAuth = async (req, res) => {
    try {
        const { token } = req.body;
        if (!token) {
            return res.json({ success: false, message: "Token is required" });
        }

        let payload;
        try {
            const ticket = await googleClient.verifyIdToken({
                idToken: token,
                audience: process.env.GOOGLE_CLIENT_ID,
            });
            payload = ticket.getPayload();
        } catch (err) {
            payload = jwt.decode(token);
        }

        if (!payload || !payload.sub) {
            return res.json({ success: false, message: "Invalid Google token" });
        }

        const { sub, email, name, picture } = payload;

        let user = await User.findById(sub);

        if (!user) {
            user = await User.create({
                _id: sub,
                username: name || email.split("@")[0],
                email: email,
                image: picture || "",
                recentSearchedCities: [],
            });
        } else {
            user.username = name || user.username;
            user.email = email || user.email;
            user.image = picture || user.image;
            await user.save();
        }

        const jwtSecret = process.env.JWT_SECRET || "default_jwt_secret";
        const authToken = jwt.sign({ userId: user._id }, jwtSecret, { expiresIn: "7d" });

        res.json({
            success: true,
            token: authToken,
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                image: user.image,
                role: user.role,
                recentSearchedCities: user.recentSearchedCities,
            }
        });
    } catch (error) {
        console.error("Google Auth error:", error);
        res.json({ success: false, message: error.message });
    }
};











// GET /api/user
export const getUserData = async (req, res) => {
    try {
        const role = req.user.role;
        const recentSearchedCities = req.user.recentSearchedCities;
        res.json({ success: true, role, recentSearchedCities, user: req.user })
    }
    catch (error) {
        res.json({ success: false, message: error.message })
    }
}


/* stores user recent searched cities */
export const storeRecentSearchedCities = async (req, res) => {
    try {
        const { recentSearchedCity } = req.body;
        const user = req.user;

        if (user.recentSearchedCities.length < 3) {
            user.recentSearchedCities.push(recentSearchedCity);
        }
        else {
            user.recentSearchedCities.shift();
            user.recentSearchedCities.push(recentSearchedCity);
        }
        await user.save();
        res.json({ success: true, message: "City added" })
    }
    catch (error) {
        res.json({ success: false, message: error.message })
    }
};