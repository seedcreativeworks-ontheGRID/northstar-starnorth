const INITIAL_APPROVALS = [
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

function createInitialState() {
  return {
    transfers: [],
    approvals: INITIAL_APPROVALS.map((approval) => ({ ...approval })),
  };
}

function getState() {
  if (!globalThis.__northstarDashboardState) {
    globalThis.__northstarDashboardState = createInitialState();
  }
  return globalThis.__northstarDashboardState;
}

function createTransfer(amount) {
  const now = new Date();
  const transaction = {
    id: `tx-${now.getTime()}-${crypto.randomUUID().slice(0, 8)}`,
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

  const state = getState();
  state.transfers = [transaction, ...state.transfers];
  return transaction;
}

function updateApproval(approvalId, status) {
  const state = getState();
  const approvalIndex = state.approvals.findIndex(
    (approval) => approval.id === approvalId,
  );

  if (approvalIndex === -1) return null;

  const approval = { ...state.approvals[approvalIndex], status };
  state.approvals[approvalIndex] = approval;
  return approval;
}

module.exports = {
  createTransfer,
  getState,
  updateApproval,
};