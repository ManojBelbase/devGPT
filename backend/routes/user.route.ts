import { authMiddleware } from './../middlewares/auth';
import express from 'express'
import { getUser, loginUser, logoutUser, registerUser } from '../controllers/user.controller';

const userRouter = express.Router();

userRouter.post("/register", registerUser)
userRouter.post("/login", loginUser)
userRouter.get('/data', authMiddleware, getUser)
userRouter.get("/logout", authMiddleware, logoutUser)

export default userRouter