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
        origin: 'http://localhost:5173',
        credentials: true,
    })
);
app.use(express.json());
app.use(cookieParser());

// Connect to DB (only once)
connectDB();

// Routes
app.use('/api/user', userRouter);
app.use('/api/chat', chatRouter);
app.use('/api/message', messageRouter);
app.use('/api/payment', planRouter);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
export const handler = serverless(app);
