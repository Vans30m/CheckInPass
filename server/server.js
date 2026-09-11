import express from "express"
import "dotenv/config";
import cors from "cors";
import connectDB from "./config/db.js";
import userRouter from "./routes/userRoutes.js";

connectDB();

const app = express()
app.use(express.json());

app.use(cors());

app.get('/', (req, res) => res.send("API is working correctly"));
app.use('/api/user', userRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on PORT: ${PORT}`)
});