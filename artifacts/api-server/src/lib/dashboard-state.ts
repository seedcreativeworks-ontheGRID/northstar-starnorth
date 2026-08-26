import { randomUUID } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  GetDashboardStateResponse,
  type Approval,
  type DashboardState,
  type Transaction,
} from "@workspace/api-zod";

const INITIAL_APPROVALS: Approval[] = [
  {
    id: "app-1",
    title: "Approve ACH Template",
    detail: "Credit reconciliation payment",
    status: "pending",
  },
  {
    id: "app-2",
    title: "Wire payment approval",
    detail: "Contract Supplier Corporation payment",
    status: "pending",
  },
  {
    id: "app-3",
    title: "EFT Payment Approval",
    detail: "ACME business vendor Payment",
    status: "pending",
  },
];

const moduleDirectory = path.dirname(fileURLToPath(import.meta.url));
const artifactDirectory =
  path.basename(moduleDirectory) === "dist"
    ? path.dirname(moduleDirectory)
    : path.resolve(moduleDirectory, "..", "..");
const stateFilePath =
  process.env["DASHBOARD_STATE_FILE"] ??
  path.join(artifactDirectory, "data", "dashboard-state.json");

let writeQueue: Promise<void> = Promise.resolve();

function createInitialState(): DashboardState {
  return {
    transfers: [],
    approvals: INITIAL_APPROVALS.map((approval) => ({ ...approval })),
  };
}

export async function readDashboardState(): Promise<DashboardState> {
  try {
    const contents = await readFile(stateFilePath, "utf8");
    return GetDashboardStateResponse.parse(JSON.parse(contents));
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      return createInitialState();
    }

    throw error;
  }
}

async function writeDashboardState(state: DashboardState): Promise<void> {
  await mkdir(path.dirname(stateFilePath), { recursive: true });
  const temporaryPath = `${stateFilePath}.${randomUUID()}.tmp`;
  await writeFile(temporaryPath, `${JSON.stringify(state, null, 2)}\n`, "utf8");
  await rename(temporaryPath, stateFilePath);
}

async function updateDashboardState<T>(
  update: (state: DashboardState) => { state: DashboardState; result: T },
): Promise<T> {
  let resolveResult: (value: T | PromiseLike<T>) => void;
  let rejectResult: (reason?: unknown) => void;
  const result = new Promise<T>((resolve, reject) => {
    resolveResult = resolve;
    rejectResult = reject;
  });

  writeQueue = writeQueue
    .catch(() => undefined)
    .then(async () => {
      try {
        const currentState = await readDashboardState();
        const updated = update(currentState);
        await writeDashboardState(updated.state);
        resolveResult(updated.result);
      } catch (error) {
        rejectResult(error);
      }
    });

  return result;
}

export async function saveTransfer(amount: number): Promise<Transaction> {
  const now = new Date();
  const transaction: Transaction = {
    id: `tx-${now.getTime()}-${randomUUID().slice(0, 8)}`,
    account: "Northstar Chequing Business #1",
    type: "Internal Transfer",
    credit: amount,
    debit: null,
    posted: "Just now",
    date: new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(now),
  };

  return updateDashboardState((state) => ({
    state: {
      ...state,
      transfers: [transaction, ...state.transfers],
    },
    result: transaction,
  }));
}

export async function saveApprovalDecision(
  approvalId: string,
  status: "approved" | "rejected",
): Promise<Approval | null> {
  return updateDashboardState((state) => {
    const approval = state.approvals.find((item) => item.id === approvalId);

    if (!approval) {
      return { state, result: null };
    }

    const updatedApproval: Approval = { ...approval, status };
    return {
      state: {
        ...state,
        approvals: state.approvals.map((item) =>
          item.id === approvalId ? updatedApproval : item,
        ),
      },
      result: updatedApproval,
    };
  });
}
