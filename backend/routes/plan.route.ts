import { authMiddleware } from '../middlewares/auth';
import { getPlans, purchasePlan, verifyPayment } from './../controllers/credit.controller';
// routes/planRoutes.ts
import { Router } from 'express';

const planRouter = Router();

planRouter.get('/plans', getPlans);
planRouter.post('/purchase-plan', authMiddleware, purchasePlan);
planRouter.get('/verify-payment', verifyPayment);
export default planRouter;