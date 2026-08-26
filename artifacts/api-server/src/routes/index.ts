import { Router, type IRouter } from "express";
import dashboardRouter from "./dashboard";
import healthRouter from "./health";
import insightsRouter from "./insights";

const router: IRouter = Router();

router.use(healthRouter);
router.use(dashboardRouter);
router.use(insightsRouter);

export default router;
