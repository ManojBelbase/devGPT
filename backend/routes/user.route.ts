import { authMiddleware } from './../middlewares/auth';
import express from 'express'
import { getUser, googleAuth, loginUser, logoutUser, publishedImages, refreshTokenController, registerUser } from '../controllers/user.controller';

const userRouter = express.Router();

userRouter.post("/register", registerUser)
userRouter.post("/login", loginUser)
userRouter.post("/google", googleAuth);
userRouter.get("/refresh", refreshTokenController);
userRouter.get('/current', authMiddleware, getUser)
userRouter.get("/logout", authMiddleware, logoutUser)
userRouter.get('/published-images', publishedImages)

export default userRouter