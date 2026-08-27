import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  type Approval,
  type ApprovalUpdateStatus,
  type Transaction,
} from "@workspace/api-client-react";
import { authenticatedFetch, broadcastAuthInvalidation } from "./auth-events";

export type { Approval, Transaction };

export type DashboardUser = "ben" | "james";

export const DASHBOARD_USERS: Record<
  DashboardUser,
  { id: DashboardUser; name: string }
> = {
  ben: { id: "ben", name: "Ben" },
  james: { id: "james", name: "James" },
};

const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: "tx-1",
    account: "Northstar Chequing Business **5274",
    type: "AMC Invoice Payment",
    credit: null,
    debit: null,
    posted: "2 min ago",
    date: "Jul 22, 2026",
  },
  {
    id: "tx-2",
    account: "Northstar Chequing Business **3891",
    type: "Expenses Billable Monthly",
    credit: null,
    debit: null,
    posted: "5 min ago",
    date: "Jul 21, 2026",
  },
  {
    id: "tx-3",
    account: "Accounts Receivables Account **6402",
    type: "Credit Settlement Monthly Payment",
    credit: null,
    debit: null,
    posted: "8 min ago",
    date: "Jul 20, 2026",
  },
  {
    id: "tx-4",
    account: "Investment account **8157",
    type: "Short term Investment Maturity",
    credit: 843948939493.0,
    debit: 321432343.0,
    posted: "10 min ago",
    date: "Jul 19, 2026",
  },
  {
    id: "tx-5",
    account: "Business Deposit Account **2063",
    type: "Contract Milestone Payment",
    credit: 612384201750.0,
    debit: 52640.8,
    posted: "15 min ago",
    date: "Jul 18, 2026",
  },
  {
    id: "tx-6",
    account: "Operating Account **4518",
    type: "Client Invoice Settlement",
    credit: 298471583620.0,
    debit: 12500.0,
    posted: "20 min ago",
    date: "Jul 17, 2026",
  },
  {
    id: "tx-7",
    account: "Payroll Account **7832",
    type: "Revenue Wire Receipt",
    credit: 457892104385.0,
    debit: 321432343.0,
    posted: "25 min ago",
    date: "Jul 16, 2026",
  },
  {
    id: "tx-8",
    account: "Treasury Reserve **2091",
    type: "ACH Vendor Payment",
    credit: null,
    debit: null,
    posted: "30 min ago",
    date: "Jul 15, 2026",
  },
  {
    id: "tx-9",
    account: "Capital Expenditure **6745",
    type: "Invoice Settlement",
    credit: null,
    debit: 12450320.0,
    posted: "35 min ago",
    date: "Jul 14, 2026",
  },
  {
    id: "tx-10",
    account: "Escrow Trust **3310",
    type: "Investment Allocation",
    credit: null,
    debit: 87234100.0,
    posted: "40 min ago",
    date: "Jul 13, 2026",
  },
  {
    id: "tx-11",
    account: "Revenue Deposits **8856",
    type: "Intercompany Transfer",
    credit: null,
    debit: 45678910.0,
    posted: "45 min ago",
    date: "Jul 12, 2026",
  },
];

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

type AppState = {
  activeUser: DashboardUser;
  setActiveUser: (user: DashboardUser) => void;
  isProfileLocked: boolean;
  applyAuthenticatedProfile: (user: DashboardUser, resetDemo?: boolean, locked?: boolean) => void;
  transactions: Transaction[];
  approvals: Approval[];
  submitTransfer: (amount: number) => Promise<Transaction>;
  updateApprovalStatus: (
    id: string,
    status: ApprovalUpdateStatus,
  ) => Promise<Approval>;
  isPersistedDataLoading: boolean;
  persistedDataError: string | null;
  reloadPersistedData: () => Promise<void>;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedAccountFilter: string;
  setSelectedAccountFilter: (filter: string) => void;
  isTransferModalOpen: boolean;
  setTransferModalOpen: (open: boolean) => void;
  isPayrollAlertVisible: boolean;
  dismissPayrollAlert: () => void;
  isHomepageInsightsComplete: boolean;
  completeHomepageInsights: () => void;
  readNotificationIds: string[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  completedInsightActions: string[];
  completeInsightActions: (actions: string[]) => void;
  isSignedOut: boolean;
  signOut: () => Promise<void>;
  restartDemo: () => void;
  demoDisclosure: DemoDisclosure | null;
  showDemoDisclosure: (disclosure: DemoDisclosure) => void;
  closeDemoDisclosure: () => void;
};

export type DemoDisclosure = {
  title: string;
  description: string;
};

type UserSessionState = {
  transfers: Transaction[];
  approvals: Approval[];
  isPayrollAlertVisible: boolean;
  isHomepageInsightsComplete: boolean;
  readNotificationIds: string[];
  completedInsightActions: string[];
};

type DashboardSession = {
  version: 1;
  activeUser: DashboardUser;
  isSignedOut: boolean;
  users: Record<DashboardUser, UserSessionState>;
};

const SESSION_KEY = "northstar-dashboard-session-v1";

function createUserSession(): UserSessionState {
  return {
    transfers: [],
    approvals: INITIAL_APPROVALS.map((approval) => ({ ...approval })),
    isPayrollAlertVisible: true,
    isHomepageInsightsComplete: false,
    readNotificationIds: [],
    completedInsightActions: [],
  };
}

function createSession(): DashboardSession {
  return {
    version: 1,
    activeUser: "ben",
    isSignedOut: false,
    users: {
      ben: createUserSession(),
      james: createUserSession(),
    },
  };
}

function normalizeUserSession(value: unknown): UserSessionState {
  const defaults = createUserSession();
  if (!value || typeof value !== "object") return defaults;

  const candidate = value as Partial<UserSessionState>;
  return {
    transfers: Array.isArray(candidate.transfers)
      ? candidate.transfers
      : defaults.transfers,
    approvals: Array.isArray(candidate.approvals)
      ? candidate.approvals
      : defaults.approvals,
    isPayrollAlertVisible:
      typeof candidate.isPayrollAlertVisible === "boolean"
        ? candidate.isPayrollAlertVisible
        : defaults.isPayrollAlertVisible,
    isHomepageInsightsComplete:
      typeof candidate.isHomepageInsightsComplete === "boolean"
        ? candidate.isHomepageInsightsComplete
        : defaults.isHomepageInsightsComplete,
    readNotificationIds: Array.isArray(candidate.readNotificationIds)
      ? candidate.readNotificationIds.filter(
          (id): id is string => typeof id === "string",
        )
      : defaults.readNotificationIds,
    completedInsightActions: Array.isArray(candidate.completedInsightActions)
      ? candidate.completedInsightActions.filter(
          (action): action is string => typeof action === "string",
        )
      : defaults.completedInsightActions,
  };
}

function loadSession(): DashboardSession {
  if (typeof window === "undefined") return createSession();

  try {
    const saved = window.sessionStorage.getItem(SESSION_KEY);
    if (!saved) return createSession();
    const parsed = JSON.parse(saved) as DashboardSession;
    if (parsed.version !== 1 || !DASHBOARD_USERS[parsed.activeUser]) {
      return createSession();
    }
    return {
      version: 1,
      activeUser: parsed.activeUser,
      isSignedOut: parsed.isSignedOut === true,
      users: {
        ben: normalizeUserSession(parsed.users?.ben),
        james: normalizeUserSession(parsed.users?.james),
      },
    };
  } catch {
    return createSession();
  }
}

function saveSession(session: DashboardSession) {
  try {
    window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {
    // The in-memory journey remains functional when storage is unavailable.
  }
}

function wait(milliseconds: number) {
  return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
}

const AppContext = createContext<AppState | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<DashboardSession>(loadSession);
  const [isProfileLocked, setProfileLocked] = useState(false);
  const [isPersistedDataLoading, setIsPersistedDataLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAccountFilter, setSelectedAccountFilter] = useState(
    "Northstar Chequing Business #1",
  );
  const [isTransferModalOpen, setTransferModalOpen] = useState(false);
  const [demoDisclosure, setDemoDisclosure] = useState<DemoDisclosure | null>(
    null,
  );
  const activeUser = session.activeUser;
  const activeSession = session.users[activeUser];

  useEffect(() => {
    saveSession(session);
  }, [session]);

  const updateUserSession = useCallback(
    (
      user: DashboardUser,
      update: (current: UserSessionState) => UserSessionState,
    ) => {
      setSession((current) => ({
        ...current,
        users: {
          ...current.users,
          [user]: update(current.users[user]),
        },
      }));
    },
    [],
  );

  const setActiveUser = useCallback((user: DashboardUser) => {
    if (isProfileLocked) return;
    setSession((current) => ({ ...current, activeUser: user }));
    setSearchQuery("");
    setSelectedAccountFilter("Northstar Chequing Business #1");
    setTransferModalOpen(false);
  }, [isProfileLocked]);

  const applyAuthenticatedProfile = useCallback(
    (user: DashboardUser, resetDemo = false, locked = true) => {
      setSession((current) => resetDemo
        ? { ...createSession(), activeUser: user }
        : { ...current, activeUser: user, isSignedOut: false });
      setProfileLocked(locked);
      setSearchQuery("");
      setSelectedAccountFilter("Northstar Chequing Business #1");
      setTransferModalOpen(false);
      setDemoDisclosure(null);
    },
    [],
  );

  const loadPersistedData = useCallback(async () => {
    setIsPersistedDataLoading(true);
    await wait(450);
    setSession(loadSession());
    setIsPersistedDataLoading(false);
  }, []);

  const transactions = useMemo(
    () => [...activeSession.transfers, ...INITIAL_TRANSACTIONS],
    [activeSession.transfers],
  );
  const approvals = activeSession.approvals;

  const submitTransfer = async (amount: number) => {
    await wait(500);
    const transaction: Transaction = {
      id: `tx-session-${Date.now()}`,
      account: "Northstar Chequing Business **5274",
      type: "Internal account transfer",
      credit: amount,
      debit: null,
      posted: "Just now",
      date: new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(new Date()),
    };
    updateUserSession(activeUser, (current) => ({
      ...current,
      transfers: [
        transaction,
        ...current.transfers.filter((item) => item.id !== transaction.id),
      ],
      isPayrollAlertVisible: false,
      isHomepageInsightsComplete: true,
    }));
    return transaction;
  };

  const updateApprovalStatus = async (
    id: string,
    status: ApprovalUpdateStatus,
  ) => {
    await wait(350);
    const existingApproval = activeSession.approvals.find(
      (approval) => approval.id === id,
    );
    if (!existingApproval) {
      throw new Error("Approval not found");
    }
    const approval: Approval = { ...existingApproval, status };
    updateUserSession(activeUser, (current) => ({
      ...current,
      approvals: current.approvals.map((item) =>
        item.id === approval.id ? approval : item,
      ),
    }));
    return approval;
  };

  const dismissPayrollAlert = () =>
    updateUserSession(activeUser, (current) => ({
      ...current,
      isPayrollAlertVisible: false,
    }));

  const completeHomepageInsights = () =>
    updateUserSession(activeUser, (current) => ({
      ...current,
      isHomepageInsightsComplete: true,
      isPayrollAlertVisible: false,
    }));

  const markNotificationRead = (id: string) =>
    updateUserSession(activeUser, (current) => ({
      ...current,
      readNotificationIds: current.readNotificationIds.includes(id)
        ? current.readNotificationIds
        : [...current.readNotificationIds, id],
    }));

  const markAllNotificationsRead = () =>
    updateUserSession(activeUser, (current) => ({
      ...current,
      readNotificationIds: ["payroll", "report"],
    }));

  const completeInsightActions = (actions: string[]) =>
    updateUserSession(activeUser, (current) => ({
      ...current,
      completedInsightActions: Array.from(
        new Set([...current.completedInsightActions, ...actions]),
      ),
    }));

  const signOut = async () => {
    const response = await authenticatedFetch("/api/auth/logout", {
      method: "POST",
      credentials: "same-origin",
    });
    if (!response.ok) {
      throw new Error("Unable to sign out. Please try again.");
    }
    const signedOutSession = {
      ...createSession(),
      activeUser,
      isSignedOut: true,
    };
    setSession(signedOutSession);
    setSearchQuery("");
    setTransferModalOpen(false);
    setDemoDisclosure(null);
    setProfileLocked(false);
    broadcastAuthInvalidation();
  };

  const restartDemo = () => {
    setSession((current) => ({ ...createSession(), activeUser: current.activeUser }));
    setSearchQuery("");
    setSelectedAccountFilter("Northstar Chequing Business #1");
    setDemoDisclosure(null);
  };

  return (
    <AppContext.Provider
      value={{
        activeUser,
        setActiveUser,
        isProfileLocked,
        applyAuthenticatedProfile,
        transactions,
        approvals,
        submitTransfer,
        updateApprovalStatus,
        isPersistedDataLoading,
        persistedDataError: null,
        reloadPersistedData: loadPersistedData,
        searchQuery,
        setSearchQuery,
        selectedAccountFilter,
        setSelectedAccountFilter,
        isTransferModalOpen,
        setTransferModalOpen,
        isPayrollAlertVisible: activeSession.isPayrollAlertVisible,
        dismissPayrollAlert,
        isHomepageInsightsComplete: activeSession.isHomepageInsightsComplete,
        completeHomepageInsights,
        readNotificationIds: activeSession.readNotificationIds,
        markNotificationRead,
        markAllNotificationsRead,
        completedInsightActions: activeSession.completedInsightActions,
        completeInsightActions,
        isSignedOut: session.isSignedOut,
        signOut,
        restartDemo,
        demoDisclosure,
        showDemoDisclosure: setDemoDisclosure,
        closeDemoDisclosure: () => setDemoDisclosure(null),
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppStore() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppStore must be used within AppProvider");
  return context;
}
