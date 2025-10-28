import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import serverless from 'serverless-http';
import { connectDB } from './config/db';
import userRouter from './routes/user.route';
import chatRouter from './routes/chat.route';
import messageRouter from './routes/message.route';
import planRouter from './routes/plan.route';

dotenv.config();

const app = express();

app.use(
    cors({
        origin: '*',
        credentials: true,
    })
);
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/user', userRouter);
app.use('/api/chat', chatRouter);
app.use('/api/message', messageRouter);
app.use('/api/payment', planRouter);

// Cache for DB connection
let isConnected = false;

const connectToDB = async () => {
    if (!isConnected) {
        await connectDB();
        isConnected = true;
    }
};

// ✅ Export handler for Vercel with DB connection
export const handler = serverless(async (req: any, res: any) => {
    try {
        await connectToDB();
        return app(req, res);
    } catch (error) {
        console.error('Database connection error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
