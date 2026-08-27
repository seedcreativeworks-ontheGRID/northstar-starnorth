import { Router, type IRouter } from "express";
import { completeProfile, isSameOrigin, login, logout, sessionStatus } from "../lib/auth";

const router: IRouter = Router();

function rejectCrossOrigin(req: Parameters<typeof login>[0], res: Parameters<typeof login>[1]) {
  if (isSameOrigin(req)) return false;
  res.status(403).json({ error: "Request not allowed." });
  return true;
}

router.get("/auth/session", sessionStatus);
router.post("/auth/login", (req, res): void => {
  if (rejectCrossOrigin(req, res)) return;
  login(req, res);
});
router.post("/auth/logout", (req, res): void => {
  if (rejectCrossOrigin(req, res)) return;
  logout(req, res);
});
router.post("/auth/profile", (req, res): void => {
  if (rejectCrossOrigin(req, res)) return;
  completeProfile(req, res);
});

export default router;