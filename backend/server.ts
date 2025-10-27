import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { connectDB } from './config/db';
import userRouter from './routes/user.route';
import chatRouter from './routes/chat.route'

dotenv.config();
const app = express();

app.use(cors({
    origin: "*",
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

await connectDB();

app.get('/', (req, res) => res.send("Server is live"));
app.use('/api/user', userRouter);
app.use('/api/chat', chatRouter)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
