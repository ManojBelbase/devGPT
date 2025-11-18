"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const db_1 = require("./config/db");
const user_route_1 = __importDefault(require("./routes/user.route"));
const chat_route_1 = __importDefault(require("./routes/chat.route"));
const message_route_1 = __importDefault(require("./routes/message.route"));
const plan_route_1 = __importDefault(require("./routes/plan.route"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// CORS
const allowedOrigins = [
    process.env.FRONTEND_URL || "https://devgptai.vercel.app",
    process.env.DEV_FRONTEND_URL || "http://localhost:5173",
];
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
// Connect to DB
(0, db_1.connectDB)();
// Routes
app.use('/api/user', user_route_1.default);
app.use('/api/chat', chat_route_1.default);
app.use('/api/message', message_route_1.default);
app.use('/api/payment', plan_route_1.default);
// Test root route
app.get("/", (req, res) => {
    res.send("Server is running successfully 🚀");
});
// Listen on Render dynamic port
const PORT = process.env.PORT || 8001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
