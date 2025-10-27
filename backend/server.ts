import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { connectDB } from './config/db';

// 🔹 Load environment variables first
dotenv.config();

// 🔹 Initialize Express
const app = express()

// 🔹 Middlewares
app.use(cors())
app.use(express.json())

// 🔹 Connect to MongoDB
await connectDB()

// routes
app.get('/', (req, res) => res.send("Server is live"))

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});