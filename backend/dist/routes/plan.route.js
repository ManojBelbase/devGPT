"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = require("../middlewares/auth");
const express_1 = __importDefault(require("express"));
const plan_controller_1 = require("../controllers/plan.controller");
// routes/planRoutes.ts
const planRouter = express_1.default.Router();
planRouter.get('/plans', plan_controller_1.getPlans);
planRouter.post('/purchase-plan', auth_1.authMiddleware, plan_controller_1.purchasePlan);
planRouter.get('/verify-payment', plan_controller_1.verifyPayment);
exports.default = planRouter;
