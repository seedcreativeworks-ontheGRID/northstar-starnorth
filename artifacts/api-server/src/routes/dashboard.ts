import { Router, type IRouter } from "express";
import {
  CreateTransferBody,
  CreateTransferResponse,
  GetDashboardStateResponse,
  UpdateApprovalBody,
  UpdateApprovalParams,
  UpdateApprovalResponse,
} from "@workspace/api-zod";
import {
  readDashboardState,
  saveApprovalDecision,
  saveTransfer,
} from "../lib/dashboard-state";

const router: IRouter = Router();

router.get("/dashboard-state", async (_req, res): Promise<void> => {
  const state = await readDashboardState();
  res.json(GetDashboardStateResponse.parse(state));
});

router.post("/transfers", async (req, res): Promise<void> => {
  const body = CreateTransferBody.safeParse(req.body);

  if (!body.success) {
    req.log.warn(
      { validationErrors: body.error.flatten() },
      "Invalid transfer",
    );
    res.status(400).json({ error: "Enter a valid transfer amount." });
    return;
  }

  const transaction = await saveTransfer(body.data.amount);
  res.status(201).json(CreateTransferResponse.parse(transaction));
});

router.patch("/approvals/:approvalId", async (req, res): Promise<void> => {
  const params = UpdateApprovalParams.safeParse(req.params);
  const body = UpdateApprovalBody.safeParse(req.body);

  if (!params.success || !body.success) {
    req.log.warn("Invalid approval decision");
    res.status(400).json({ error: "Choose a valid approval decision." });
    return;
  }

  const approval = await saveApprovalDecision(
    params.data.approvalId,
    body.data.status,
  );

  if (!approval) {
    res.status(404).json({ error: "Approval not found." });
    return;
  }

  res.json(UpdateApprovalResponse.parse(approval));
});

export default router;
