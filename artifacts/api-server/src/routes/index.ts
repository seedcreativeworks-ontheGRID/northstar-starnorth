import { Router, type IRouter } from "express";
import dashboardRouter from "./dashboard";
import healthRouter from "./health";
import insightsRouter from "./insights";
import authRouter from "./auth";
import { requireSameOrigin, requireSession } from "../lib/auth";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(requireSameOrigin, requireSession, dashboardRouter);
router.use(requireSameOrigin, requireSession, insightsRouter);

export default router;
