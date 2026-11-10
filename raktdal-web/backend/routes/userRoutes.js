import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getUserData, googleAuth, storeRecentSearchedCities } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post('/google-auth', googleAuth);
userRouter.get('/', protect, getUserData);
userRouter.post('/store-recent-search', protect, storeRecentSearchedCities);

export default userRouter;