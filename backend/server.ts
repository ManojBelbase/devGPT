import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { connectDB } from './config/db';
import userRouter from './routes/user.route';
import chatRouter from './routes/chat.route';
import messageRouter from './routes/message.route';
import planRouter from './routes/plan.route';

dotenv.config();

const app = express();

// CORS
app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://devgptai.vercel.app/",
        "https://dev-gpt-client-git-main-manojs-projects-391db5d0.vercel.app"
    ],
    credentials: true, // ✅ MUST be true for cookies
}));

app.use(express.json());
app.use(cookieParser());

// Connect to DB
connectDB();

// Routes
app.use('/api/user', userRouter);
app.use('/api/chat', chatRouter);
app.use('/api/message', messageRouter);
app.use('/api/payment', planRouter);

// Test root route
app.get("/", (req, res) => {
    res.send("Server is running successfully 🚀");
});

// Listen on Render dynamic port
const PORT = process.env.PORT || 8001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
