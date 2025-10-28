import { authMiddleware } from '../middlewares/auth';
import express from 'express';
import { getPlans, purchasePlan, verifyPayment } from '../controllers/plan.controller';
// routes/planRoutes.ts
const planRouter = express.Router();
planRouter.get('/plans', getPlans);
planRouter.post('/purchase-plan', authMiddleware, purchasePlan);
planRouter.get('/verify-payment', verifyPayment);
export default planRouter;
