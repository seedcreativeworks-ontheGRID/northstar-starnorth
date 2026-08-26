import { useEffect, useRef, useState, ReactNode } from "react";
import { Link, useLocation } from "wouter";
import {
  Bell,
  ChevronDown,
  Globe,
  User,
  LogOut,
  Landmark,
  LifeBuoy,
  Menu,
  ChevronRight,
  CheckCheck,
  LayoutGrid,
  CreditCard,
  FileText,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { DASHBOARD_USERS, useAppStore } from "@/store";
import { useToast } from "@/hooks/use-toast";

// ---------------------------------------------------------------------------
// Notification data
// ---------------------------------------------------------------------------
const NOTIFICATIONS = [
  {
    id: "payroll",
    title: "Action Required: Payroll Funding",
    body: "Your upcoming payroll requires $129,493 CAD. Please ensure sufficient funds.",
    time: "2 hours ago",
    kind: "payroll" as const,
  },
  {
    id: "report",
    title: "New Document Available",
    body: "Your July 2026 Transfer Activity Report is ready for review.",
    time: "1 day ago",
    kind: "report" as const,
  },
];

// ---------------------------------------------------------------------------
// TopBar
// ---------------------------------------------------------------------------
export function TopBar() {
  const { activeUser, setActiveUser, signOut, showDemoDisclosure } =
    useAppStore();
  const { toast } = useToast();
  const [signOutOpen, setSignOutOpen] = useState(false);

  const handleUserSwitch = (user: "james" | "ben") => {
    if (user === activeUser) return; // no duplicate noise
    setActiveUser(user);
    toast({
      title: `Switched to ${DASHBOARD_USERS[user].name}`,
      description: `You are now viewing ${DASHBOARD_USERS[user].name}'s dashboard.`,
    });
  };

  const handleSignOut = () => {
    signOut();
    setSignOutOpen(false);
  };

  return (
    <>
      <div className="w-full bg-background border-b border-border/50">
        <div className="mx-auto flex w-full max-w-[1600px] items-center justify-end gap-3 px-3 py-1.5 text-[11px] text-muted-foreground sm:gap-6 sm:px-6 sm:text-[13px]">
          {/* Language control */}
          <button
            type="button"
            data-testid="button-language"
            className="flex items-center gap-1.5 hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
            onClick={() =>
              showDemoDisclosure({
                title: "Language Settings",
                description:
                  "This demo is only available in English. Additional language support is not available in this prototype.",
              })
            }
          >
            <Globe className="h-3.5 w-3.5" />
            English
            <ChevronDown className="h-3 w-3" />
          </button>

          {/* User switcher */}
          <div
            className="flex items-center gap-1.5"
            role="group"
            aria-label="Switch dashboard user"
          >
            <User className="h-3.5 w-3.5" />
            {(["james", "ben"] as const).map((user) => {
              const isActive = activeUser === user;
              return (
                <button
                  key={user}
                  type="button"
                  data-testid={`button-user-${user}`}
                  aria-pressed={isActive}
                  onClick={() => handleUserSwitch(user)}
                  className={`rounded px-1 py-0.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                    isActive
                      ? "font-semibold text-foreground underline underline-offset-4"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {DASHBOARD_USERS[user].name}
                </button>
              );
            })}
          </div>

          {/* Sign Out */}
          <button
            type="button"
            data-testid="button-sign-out"
            className="flex items-center gap-1.5 hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
            onClick={() => setSignOutOpen(true)}
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Sign-out confirmation dialog */}
      <AlertDialog open={signOutOpen} onOpenChange={setSignOutOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sign out of Northstar?</AlertDialogTitle>
            <AlertDialogDescription>
              You will be returned to the demo start screen. Any unsaved changes
              in this session will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-sign-out-cancel">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              data-testid="button-sign-out-confirm"
              onClick={handleSignOut}
            >
              Sign Out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

// ---------------------------------------------------------------------------
// Navbar
// ---------------------------------------------------------------------------
export function Navbar({
  isSupportOpen,
  onSupportOpenChange,
}: {
  isSupportOpen: boolean;
  onSupportOpenChange: (open: boolean) => void;
}) {
  const [location] = useLocation();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSupportCentreOpen, setIsSupportCentreOpen] = useState(false);
  const [isCompactNavigationOpen, setIsCompactNavigationOpen] = useState(false);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const supportCentreRef = useRef<HTMLDivElement>(null);
  const compactNavigationRef = useRef<HTMLDivElement>(null);

  const {
    setTransferModalOpen,
    showDemoDisclosure,
    readNotificationIds,
    markNotificationRead,
    markAllNotificationsRead,
  } = useAppStore();
  const { toast } = useToast();

  // Unread count derived from store state
  const unreadCount = NOTIFICATIONS.filter(
    (n) => !readNotificationIds.includes(n.id),
  ).length;

  // -----------------------------------------------------------------------
  // Outside-click / Escape close
  // -----------------------------------------------------------------------
  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!notificationsRef.current?.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
      if (!supportCentreRef.current?.contains(event.target as Node)) {
        setIsSupportCentreOpen(false);
      }
      if (!compactNavigationRef.current?.contains(event.target as Node)) {
        setIsCompactNavigationOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsNotificationsOpen(false);
        setIsSupportCentreOpen(false);
        setIsCompactNavigationOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // -----------------------------------------------------------------------
  // Helpers
  // -----------------------------------------------------------------------
  const closeAll = () => {
    setIsNotificationsOpen(false);
    setIsSupportCentreOpen(false);
    setIsCompactNavigationOpen(false);
  };

  /** Scroll to an anchor on the current page */
  const scrollToAnchor = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  /** Open the demo disclosure for unsupported features */
  const openUnavailable = (featureName: string) => {
    showDemoDisclosure({
      title: `${featureName} — Not Available in Demo`,
      description: `${featureName} is not available in this prototype. This feature would be fully functional in the live Northstar platform.`,
    });
  };

  /** Open support panel with a specific view */
  const openSupportPanel = (view: "home" | "chat") => {
    closeAll();
    onSupportOpenChange(true);
    setTimeout(() => {
      window.dispatchEvent(
        new CustomEvent("northstar:support-action", { detail: { view } }),
      );
    }, 0);
  };

  /** Handle notification click */
  const handleNotificationClick = (notif: (typeof NOTIFICATIONS)[number]) => {
    markNotificationRead(notif.id);
    if (notif.kind === "payroll") {
      setIsNotificationsOpen(false);
      setTransferModalOpen(true);
    } else if (notif.kind === "report") {
      setIsNotificationsOpen(false);
      window.dispatchEvent(
        new CustomEvent("northstar:open-report", { detail: { id: "r4" } }),
      );
    }
  };

  const handleMarkAllRead = () => {
    markAllNotificationsRead();
    toast({
      title: "All notifications marked as read",
    });
  };

  // -----------------------------------------------------------------------
  // Compact nav helpers
  // -----------------------------------------------------------------------
  const closeCompactNavigation = () => setIsCompactNavigationOpen(false);

  // Active group for the rail-style menu
  const [activeMenuGroup, setActiveMenuGroup] = useState<
    "quick-access" | "payments" | "cheques" | "reports"
  >("quick-access");

  // Report items — scroll to #reports
  const reportItems = [
    "Account transfer reports",
    "Wire Payment reports",
    "Electronic Report Delivery (ERD)",
    "File Transfer Facility (FTF) reports",
    "Recon Management reports",
    "ACH reports",
    "Stop payments reports",
    "Digital Cheque Services reports",
  ];

  // Items that should open unavailable disclosure
  const unavailablePaymentItems = [
    "ACH Payments",
    "Electronic Funds Transfer (EFT)",
    "EFT Client Returns",
    "File Transfer Facility (FTF)",
    "Interac e-Transfer",
    "Wire Payment",
    "Zelle",
  ];

  const unavailableChequeItems = [
    "Northstar DepositEdge",
    "Digital Cheque Service (DCS)",
    "Recon Management",
    "Stop Payments",
    "Cheque Imaging",
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="relative mx-auto flex h-16 w-full max-w-[1600px] items-center justify-between px-3 sm:px-6">
        {/* ---------------------------------------------------------------- */}
        {/* Left: Logo + navigation                                          */}
        {/* ---------------------------------------------------------------- */}
        <div className="relative flex min-w-0 items-center gap-4 min-[1440px]:static">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="text-primary flex items-center justify-center">
              <Landmark className="h-7 w-7" />
            </div>
            <span className="max-[420px]:hidden font-bold text-xl tracking-tight text-primary">
              Northstar
            </span>
          </Link>

          {/* -------------------------------------------------------------- */}
          {/* Compact navigation (< 1440px)                                  */}
          {/* -------------------------------------------------------------- */}
          <div ref={compactNavigationRef} className="min-[1440px]:hidden">
            <Button
              variant="ghost"
              data-testid="button-compact-nav-toggle"
              aria-label={
                isCompactNavigationOpen
                  ? "Close primary navigation"
                  : "Open primary navigation"
              }
              aria-expanded={isCompactNavigationOpen}
              aria-controls="compact-primary-navigation"
              onClick={() => {
                setIsNotificationsOpen(false);
                setIsSupportCentreOpen(false);
                setIsCompactNavigationOpen((open) => {
                  if (!open) setActiveMenuGroup("quick-access");
                  return !open;
                });
              }}
              className={`group h-10 gap-1 rounded-md border p-1 pr-2 text-primary shadow-sm transition-all ${
                isCompactNavigationOpen
                  ? "border-primary/30 bg-primary/[0.07]"
                  : "border-primary/20 bg-primary/[0.035] hover:bg-primary/[0.075]"
              }`}
            >
              <span
                className={`grid h-8 w-8 shrink-0 place-items-center rounded-[5px] transition-colors ${
                  isCompactNavigationOpen
                    ? "bg-primary text-primary-foreground"
                    : "bg-primary/10 text-primary"
                }`}
              >
                <Menu className="h-4 w-4" />
              </span>
              <span className="text-[11px] font-semibold">Menu</span>
              <ChevronRight
                className={`h-3.5 w-3.5 shrink-0 transition-transform ${
                  isCompactNavigationOpen
                    ? "rotate-90"
                    : "group-hover:translate-x-0.5"
                }`}
                strokeWidth={2}
              />
            </Button>

            {isCompactNavigationOpen && (
              <nav
                id="compact-primary-navigation"
                aria-label="Primary navigation"
                className="fixed left-3 right-3 top-[6.25rem] z-50 max-h-[calc(100vh-7rem)] w-auto overflow-y-auto overflow-x-hidden rounded-md border border-border bg-popover p-0 text-popover-foreground shadow-md animate-in fade-in slide-in-from-top-2 sm:absolute sm:left-0 sm:right-auto sm:top-full sm:mt-2 sm:w-[min(800px,calc(100vw-3rem))]"
              >
                <div className="flex w-full flex-col sm:min-h-[320px] sm:flex-row">
                  {/* Rail: group navigation */}
                  <div className="shrink-0 border-b border-border bg-muted/40 p-2 sm:w-56 sm:border-b-0 sm:border-r">
                    <p className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Navigation
                    </p>
                    <div
                      role="tablist"
                      aria-label="Navigation groups"
                      aria-orientation="vertical"
                      tabIndex={-1}
                      className="flex flex-row gap-1 overflow-x-auto sm:flex-col sm:overflow-visible"
                      onKeyDown={(event) => {
                        const order = [
                          "quick-access",
                          "payments",
                          "cheques",
                          "reports",
                        ] as const;
                        const index = order.indexOf(activeMenuGroup);
                        let next: (typeof order)[number] | undefined;
                        if (
                          event.key === "ArrowDown" ||
                          event.key === "ArrowRight"
                        ) {
                          next = order[(index + 1) % order.length];
                        } else if (
                          event.key === "ArrowUp" ||
                          event.key === "ArrowLeft"
                        ) {
                          next = order[(index - 1 + order.length) % order.length];
                        } else if (event.key === "Home") {
                          next = order[0];
                        } else if (event.key === "End") {
                          next = order[order.length - 1];
                        }
                        if (next) {
                          event.preventDefault();
                          setActiveMenuGroup(next);
                          const target = document.querySelector<HTMLButtonElement>(
                            `[data-testid="nav-compact-group-${next}"]`,
                          );
                          target?.focus();
                        }
                      }}
                    >
                      {(
                        [
                          {
                            id: "quick-access",
                            label: "Quick Access",
                            icon: LayoutGrid,
                            count: 4,
                          },
                          {
                            id: "payments",
                            label: "Payments & Transfers",
                            icon: Landmark,
                            count: 1 + unavailablePaymentItems.length,
                          },
                          {
                            id: "cheques",
                            label: "Cheques",
                            icon: CheckCheck,
                            count: unavailableChequeItems.length,
                          },
                          {
                            id: "reports",
                            label: "Reports",
                            icon: FileText,
                            count: reportItems.length,
                          },
                        ] as const
                      ).map((group) => {
                        const Icon = group.icon;
                        const isActive = activeMenuGroup === group.id;
                        return (
                          <button
                            key={group.id}
                            type="button"
                            role="tab"
                            id={`nav-compact-tab-${group.id}`}
                            data-testid={`nav-compact-group-${group.id}`}
                            aria-selected={isActive}
                            aria-controls={`nav-compact-panel-${group.id}`}
                            tabIndex={isActive ? 0 : -1}
                            onMouseEnter={() => setActiveMenuGroup(group.id)}
                            onClick={() => setActiveMenuGroup(group.id)}
                            className={`flex shrink-0 items-center justify-between gap-2 rounded-md px-3 py-2.5 text-left text-[12px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:w-full ${
                              isActive
                                ? "border border-border bg-popover text-primary shadow-sm"
                                : "border border-transparent text-muted-foreground hover:bg-muted hover:text-foreground"
                            }`}
                          >
                            <span className="flex items-center gap-2.5">
                              <Icon
                                className={`h-4 w-4 shrink-0 ${isActive ? "text-primary" : "text-muted-foreground"}`}
                              />
                              <span className="whitespace-nowrap">
                                {group.label}
                              </span>
                            </span>
                            <span className="flex items-center gap-1.5">
                              <span
                                className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                                  isActive
                                    ? "bg-primary/10 text-primary"
                                    : "bg-muted text-muted-foreground"
                                }`}
                              >
                                {group.count}
                              </span>
                              <ChevronRight
                                className={`hidden h-3.5 w-3.5 transition-all sm:block ${
                                  isActive
                                    ? "translate-x-0 opacity-100"
                                    : "-translate-x-1 opacity-0"
                                }`}
                              />
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Detail panel: items of the active group */}
                  <div className="flex-1 p-5">
                    {activeMenuGroup === "quick-access" && (
                      <div
                        role="tabpanel"
                        id="nav-compact-panel-quick-access"
                        aria-labelledby="nav-compact-tab-quick-access"
                      >
                        <h4 className="text-xs font-semibold mb-3 text-foreground flex items-center gap-1.5">
                          <LayoutGrid className="h-3.5 w-3.5" /> Quick Access
                        </h4>
                        <ul className="space-y-2 text-[12px] text-muted-foreground">
                          <li>
                            <Link
                              href="/"
                              onClick={closeCompactNavigation}
                              className="hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded text-left w-full block transition-colors"
                              data-testid="nav-compact-home"
                            >
                              Home
                            </Link>
                          </li>
                          <li>
                            <button
                              type="button"
                              data-testid="nav-compact-accounts"
                              onClick={() => {
                                closeCompactNavigation();
                                scrollToAnchor("accounts");
                              }}
                              className="hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded text-left w-full block transition-colors"
                            >
                              Accounts Information
                            </button>
                          </li>
                          <li>
                            <button
                              type="button"
                              data-testid="nav-compact-administration"
                              onClick={() => {
                                closeCompactNavigation();
                                openUnavailable("Administration");
                              }}
                              className="hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded text-left w-full block transition-colors"
                            >
                              Administration
                            </button>
                          </li>
                          <li>
                            <button
                              type="button"
                              data-testid="nav-compact-marketplace"
                              onClick={() => {
                                closeCompactNavigation();
                                openUnavailable("Marketplace");
                              }}
                              className="hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded text-left w-full block transition-colors"
                            >
                              Marketplace
                            </button>
                          </li>
                        </ul>
                      </div>
                    )}

                    {activeMenuGroup === "payments" && (
                      <div
                        role="tabpanel"
                        id="nav-compact-panel-payments"
                        aria-labelledby="nav-compact-tab-payments"
                      >
                        <h4 className="text-xs font-semibold mb-3 text-foreground flex items-center gap-1.5">
                          <Landmark className="h-3.5 w-3.5" /> Payments &
                          Transfers
                        </h4>
                        <ul className="space-y-2 text-[12px] text-muted-foreground sm:columns-2 sm:gap-8 [&>li]:break-inside-avoid">
                          <li>
                            <button
                              type="button"
                              data-testid="nav-compact-account-transfer"
                              onClick={() => {
                                closeCompactNavigation();
                                setTransferModalOpen(true);
                              }}
                              className="hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded text-left w-full block transition-colors"
                            >
                              Account Transfer
                            </button>
                          </li>
                          {unavailablePaymentItems.map((item) => (
                            <li key={item}>
                              <button
                                type="button"
                                data-testid={`nav-compact-${item.toLowerCase().replace(/\s+/g, "-").replace(/[()]/g, "")}`}
                                onClick={() => {
                                  closeCompactNavigation();
                                  openUnavailable(item);
                                }}
                                className="hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded flex items-center justify-between w-full text-left transition-colors"
                              >
                                <span>{item}</span>
                                {item === "Interac e-Transfer" && (
                                  <span className="text-[9px] border border-border/80 px-1 rounded text-muted-foreground ml-1 shrink-0">
                                    CA
                                  </span>
                                )}
                                {item === "Zelle" && (
                                  <span className="text-[9px] border border-border/80 px-1 rounded text-muted-foreground ml-1 shrink-0">
                                    US
                                  </span>
                                )}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {activeMenuGroup === "cheques" && (
                      <div
                        role="tabpanel"
                        id="nav-compact-panel-cheques"
                        aria-labelledby="nav-compact-tab-cheques"
                      >
                        <h4 className="text-xs font-semibold mb-3 text-foreground flex items-center gap-1.5">
                          <CheckCheck className="h-3.5 w-3.5" /> Cheques
                        </h4>
                        <ul className="space-y-2 text-[12px] text-muted-foreground">
                          {unavailableChequeItems.map((item) => (
                            <li key={item}>
                              <button
                                type="button"
                                data-testid={`nav-compact-${item.toLowerCase().replace(/\s+/g, "-").replace(/[()]/g, "")}`}
                                onClick={() => {
                                  closeCompactNavigation();
                                  openUnavailable(item);
                                }}
                                className="hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded flex items-center justify-between w-full text-left transition-colors"
                              >
                                <span>{item}</span>
                                {item === "Recon Management" && (
                                  <span className="text-[9px] border border-border/80 px-1 rounded text-muted-foreground ml-1 shrink-0">
                                    US
                                  </span>
                                )}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {activeMenuGroup === "reports" && (
                      <div
                        role="tabpanel"
                        id="nav-compact-panel-reports"
                        aria-labelledby="nav-compact-tab-reports"
                      >
                        <h4 className="text-xs font-semibold mb-3 text-foreground flex items-center gap-1.5">
                          <FileText className="h-3.5 w-3.5" /> Reports
                        </h4>
                        <ul className="space-y-2 text-[12px] text-muted-foreground sm:columns-2 sm:gap-8 [&>li]:break-inside-avoid">
                          {reportItems.map((item) => (
                            <li key={item}>
                              <button
                                type="button"
                                data-testid={`nav-compact-${item.toLowerCase().replace(/\s+/g, "-").replace(/[()]/g, "")}`}
                                onClick={() => {
                                  closeCompactNavigation();
                                  scrollToAnchor("reports");
                                }}
                                className="hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded text-left w-full block transition-colors"
                              >
                                {item}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </nav>
            )}
          </div>

          {/* -------------------------------------------------------------- */}
          {/* Full navigation menu (≥ 1440px)                                */}
          {/* -------------------------------------------------------------- */}
          <NavigationMenu className="hidden min-[1440px]:absolute min-[1440px]:left-1/2 min-[1440px]:flex min-[1440px]:-translate-x-1/2">
            <NavigationMenuList className="gap-2">
              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle()}
                  data-active={location === "/"}
                >
                  <Link href="/">Home</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              {/* Accounts Information — scrolls to #accounts */}
              <NavigationMenuItem>
                <button
                  type="button"
                  data-testid="nav-accounts"
                  onClick={() => scrollToAnchor("accounts")}
                  className={navigationMenuTriggerStyle()}
                >
                  Accounts Information
                </button>
              </NavigationMenuItem>

              {/* Payments and Receivables dropdown */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent">
                  Payments and Receivables
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid grid-cols-3 gap-6 p-6 w-[700px]">
                    {/* Payments and Transfers */}
                    <div>
                      <h4 className="flex items-center gap-2 text-sm font-semibold mb-3 text-foreground">
                        Payments and Transfers
                      </h4>
                      <ul className="space-y-2.5 text-[13px] text-muted-foreground">
                        <li>
                          <button
                            type="button"
                            data-testid="nav-account-transfer"
                            onClick={() => setTransferModalOpen(true)}
                            className="hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                          >
                            Account Transfer
                          </button>
                        </li>
                        {unavailablePaymentItems.map((item) => (
                          <li key={item}>
                            <button
                              type="button"
                              data-testid={`nav-${item.toLowerCase().replace(/\s+/g, "-").replace(/[()]/g, "")}`}
                              onClick={() => openUnavailable(item)}
                              className="hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded flex items-center justify-between w-full text-left"
                            >
                              {item}
                              {item === "Interac e-Transfer" && (
                                <span className="text-[9px] border border-border/80 px-1 rounded text-muted-foreground ml-1">
                                  CA
                                </span>
                              )}
                              {item === "Zelle" && (
                                <span className="text-[9px] border border-border/80 px-1 rounded text-muted-foreground ml-1">
                                  US
                                </span>
                              )}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Cheques */}
                    <div>
                      <h4 className="flex items-center gap-2 text-sm font-semibold mb-3 text-foreground">
                        Cheques
                      </h4>
                      <ul className="space-y-2.5 text-[13px] text-muted-foreground">
                        {unavailableChequeItems.map((item) => (
                          <li key={item}>
                            <button
                              type="button"
                              data-testid={`nav-${item.toLowerCase().replace(/\s+/g, "-").replace(/[()]/g, "")}`}
                              onClick={() => openUnavailable(item)}
                              className="hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded flex items-center justify-between w-full text-left"
                            >
                              {item}
                              {item === "Recon Management" && (
                                <span className="text-[9px] border border-border/80 px-1 rounded text-muted-foreground ml-1">
                                  US
                                </span>
                              )}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Reports */}
                    <div>
                      <h4 className="flex items-center gap-2 text-sm font-semibold mb-3 text-foreground">
                        Reports
                      </h4>
                      <ul className="space-y-2.5 text-[13px] text-muted-foreground">
                        {[
                          "Account transfer reports",
                          "Wire Payment reports",
                          "Electronic Report Delivery (ERD)",
                          "File Transfer Facility (FTF)",
                          "Recon Management",
                          "ACH reports",
                          "Stop payments",
                          "Digital Cheque Services",
                        ].map((item) => (
                          <li key={item}>
                            <button
                              type="button"
                              data-testid={`nav-report-${item.toLowerCase().replace(/\s+/g, "-").replace(/[()]/g, "")}`}
                              onClick={() => scrollToAnchor("reports")}
                              className="hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded text-left"
                            >
                              {item}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Administration — unavailable */}
              <NavigationMenuItem>
                <button
                  type="button"
                  data-testid="nav-administration"
                  onClick={() => openUnavailable("Administration")}
                  className={navigationMenuTriggerStyle()}
                >
                  Administration
                </button>
              </NavigationMenuItem>

              {/* Marketplace — unavailable */}
              <NavigationMenuItem>
                <button
                  type="button"
                  data-testid="nav-marketplace"
                  onClick={() => openUnavailable("Marketplace")}
                  className={navigationMenuTriggerStyle()}
                >
                  Marketplace
                </button>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Right: Notifications + Support tools                             */}
        {/* ---------------------------------------------------------------- */}
        <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
          {/* Notifications */}
          <div ref={notificationsRef} className="relative">
            <button
              type="button"
              data-testid="button-notifications"
              aria-label={`Notifications, ${unreadCount} unread`}
              aria-expanded={isNotificationsOpen}
              aria-haspopup="true"
              onClick={() => {
                setIsSupportCentreOpen(false);
                setIsCompactNavigationOpen(false);
                setIsNotificationsOpen((o) => !o);
              }}
              className="relative text-muted-foreground hover:text-foreground transition-colors p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span
                  aria-hidden="true"
                  className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-destructive border-[1.5px] border-background text-[9px] font-bold text-destructive-foreground"
                >
                  {unreadCount}
                </span>
              )}
            </button>

            {isNotificationsOpen && (
              <div
                role="dialog"
                aria-label="Notifications"
                className="absolute right-0 top-full mt-2 w-[min(320px,calc(100vw-1.5rem))] bg-popover border border-border shadow-md rounded-md z-50 animate-in fade-in slide-in-from-top-2"
              >
                <div className="flex items-center justify-between p-3 border-b border-border/50">
                  <h4 className="font-semibold text-sm text-foreground">
                    Notifications
                  </h4>
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      data-testid="button-mark-all-read"
                      onClick={handleMarkAllRead}
                      className="flex items-center gap-1 text-[11px] text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                    >
                      <CheckCheck className="h-3.5 w-3.5" />
                      Mark all as read
                    </button>
                  )}
                </div>
                <div className="flex flex-col divide-y divide-border/50 max-h-[300px] overflow-y-auto">
                  {NOTIFICATIONS.map((notif) => {
                    const isRead = readNotificationIds.includes(notif.id);
                    return (
                      <button
                        key={notif.id}
                        type="button"
                        data-testid={`notification-${notif.id}`}
                        aria-label={`${notif.title}${isRead ? "" : " (unread)"}`}
                        onClick={() => handleNotificationClick(notif)}
                        className={`w-full text-left p-3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                          isRead
                            ? "hover:bg-muted/40 opacity-70"
                            : "hover:bg-muted/60 bg-primary/[0.02]"
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          {!isRead && (
                            <span
                              aria-hidden="true"
                              className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
                            />
                          )}
                          <div className={isRead ? "pl-3.5" : ""}>
                            <p
                              className={`text-xs font-medium mb-1 ${isRead ? "text-muted-foreground" : "text-foreground"}`}
                            >
                              {notif.title}
                            </p>
                            <p className="text-[11px] text-muted-foreground mb-1 leading-relaxed">
                              {notif.body}
                            </p>
                            <p className="text-[10px] text-muted-foreground font-medium">
                              {notif.time}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Support tools group */}
          <div
            ref={supportCentreRef}
            role="group"
            aria-label="Support tools"
            className="relative flex h-10 shrink-0 items-center rounded-md border border-primary/20 bg-primary/[0.035] p-1 shadow-sm"
          >
            {/* Help & Support toggle */}
            <button
              type="button"
              data-testid="button-help-support"
              aria-label={
                isSupportOpen ? "Close Help and Support" : "Open Help and Support"
              }
              aria-expanded={isSupportOpen}
              aria-controls="support-panel"
              onClick={() => {
                setIsNotificationsOpen(false);
                setIsSupportCentreOpen(false);
                setIsCompactNavigationOpen(false);
                onSupportOpenChange(!isSupportOpen);
              }}
              className={`group flex h-8 items-center gap-1.5 rounded-[5px] px-1.5 text-primary transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:px-2 ${
                isSupportOpen
                  ? "bg-background shadow-sm"
                  : "hover:bg-primary/[0.075]"
              }`}
            >
              <span
                className={`grid h-5 w-5 shrink-0 place-items-center rounded-[5px] transition-colors ${
                  isSupportOpen
                    ? "bg-primary text-primary-foreground"
                    : "bg-primary/10 text-primary"
                }`}
              >
                <LifeBuoy className="h-3.5 w-3.5" strokeWidth={2.25} />
              </span>
              <span className="hidden whitespace-nowrap text-[10px] font-semibold sm:block">
                <span className="min-[1536px]:hidden">Help &amp; Support</span>
                <span className="hidden min-[1536px]:inline min-[1720px]:hidden">
                  Help
                </span>
                <span className="hidden min-[1720px]:inline">
                  Help &amp; Support
                </span>
              </span>
              <ChevronRight
                className={`hidden h-3.5 w-3.5 shrink-0 transition-transform sm:block ${
                  isSupportOpen ? "rotate-90" : "group-hover:translate-x-0.5"
                }`}
                strokeWidth={2}
              />
            </button>

            <span aria-hidden="true" className="mx-0.5 h-5 w-px bg-primary/20" />

            {/* Support Centre dropdown */}
            <div className="relative">
              <button
                type="button"
                data-testid="button-support-centre"
                aria-expanded={isSupportCentreOpen}
                aria-haspopup="true"
                aria-controls="support-centre-menu"
                onClick={() => {
                  setIsNotificationsOpen(false);
                  setIsCompactNavigationOpen(false);
                  setIsSupportCentreOpen((open) => !open);
                }}
                className={`flex h-8 items-center rounded-[5px] px-1.5 text-[11px] font-semibold text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:px-2 ${
                  isSupportCentreOpen
                    ? "bg-background shadow-sm"
                    : "hover:bg-primary/[0.075]"
                }`}
              >
                <span className="whitespace-nowrap">Support Centre</span>
                {/* Red dot: visible when there are unread notifications or items needing attention */}
                <span
                  aria-hidden="true"
                  className="ml-1.5 h-1.5 w-1.5 rounded-full bg-destructive"
                />
              </button>

              {isSupportCentreOpen && (
                <div
                  id="support-centre-menu"
                  role="dialog"
                  aria-label="Support Centre links"
                  className="absolute right-0 top-full z-50 mt-2 w-[min(420px,calc(100vw-1.5rem))] animate-in fade-in slide-in-from-top-2 rounded-md border border-border bg-popover p-0 text-popover-foreground shadow-md"
                >
                  <div className="grid w-full grid-cols-1 gap-x-8 gap-y-6 p-5 sm:grid-cols-2">
                    {/* Self Help */}
                    <div>
                      <h4 className="text-xs font-semibold mb-2 text-foreground flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5" /> Self Help
                      </h4>
                      <ul className="space-y-1.5 text-[12px] text-muted-foreground">
                        <li>
                          <button
                            type="button"
                            data-testid="support-help-resource-centre"
                            onClick={() => {
                              setIsSupportCentreOpen(false);
                              openSupportPanel("home");
                            }}
                            className="hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded text-left w-full"
                          >
                            Help Resource Centre
                          </button>
                        </li>
                        <li>
                          <button
                            type="button"
                            data-testid="support-getting-started"
                            onClick={() => {
                              setIsSupportCentreOpen(false);
                              openSupportPanel("home");
                            }}
                            className="hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded text-left w-full"
                          >
                            Getting Started
                          </button>
                        </li>
                        <li>
                          <button
                            type="button"
                            data-testid="support-personalized-training"
                            onClick={() =>
                              openUnavailable("Personalized Training")
                            }
                            className="hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded text-left w-full"
                          >
                            Personalized Training
                          </button>
                        </li>
                      </ul>
                    </div>

                    {/* Support Requests */}
                    <div>
                      <h4 className="text-xs font-semibold mb-2 text-foreground flex items-center gap-1.5">
                        <LogOut className="h-3.5 w-3.5 rotate-180" /> Support
                        Requests
                      </h4>
                      <ul className="space-y-1.5 text-[12px] text-muted-foreground">
                        <li>
                          <button
                            type="button"
                            data-testid="support-manage-support"
                            onClick={() =>
                              openUnavailable("Manage Support")
                            }
                            className="hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded text-left w-full"
                          >
                            Manage Support
                          </button>
                        </li>
                        <li>
                          <button
                            type="button"
                            data-testid="support-submit-ticket"
                            onClick={() =>
                              openUnavailable("Submit a Support Ticket")
                            }
                            className="hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded text-left w-full"
                          >
                            Submit a Support Ticket
                          </button>
                        </li>
                      </ul>
                    </div>

                    {/* Support Hubs */}
                    <div>
                      <h4 className="text-xs font-semibold mb-2 text-foreground flex items-center gap-1.5">
                        <Globe className="h-3.5 w-3.5" /> Support Hubs
                      </h4>
                      <ul className="space-y-1.5 text-[12px] text-muted-foreground">
                        <li>
                          <button
                            type="button"
                            data-testid="support-hubs-getting-started"
                            onClick={() => {
                              setIsSupportCentreOpen(false);
                              openSupportPanel("home");
                            }}
                            className="hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded text-left w-full"
                          >
                            Getting Started
                          </button>
                        </li>
                      </ul>
                    </div>

                    {/* Implementation Tracker */}
                    <div>
                      <h4 className="text-xs font-semibold mb-2 text-foreground flex items-center gap-1.5">
                        <Landmark className="h-3.5 w-3.5" /> Implementation
                        Tracker
                      </h4>
                      <ul className="space-y-1.5 text-[12px] text-muted-foreground">
                        <li>
                          <button
                            type="button"
                            data-testid="support-tracker-requests"
                            onClick={() =>
                              openUnavailable("Implementation Tracker")
                            }
                            className="hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded text-left w-full"
                          >
                            Track requests
                          </button>
                        </li>
                        <li>
                          <button
                            type="button"
                            data-testid="support-tracker-attention"
                            onClick={() =>
                              openUnavailable("Implementation Tracker")
                            }
                            className="hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded flex items-center gap-1.5 text-left w-full"
                          >
                            Attention needed{" "}
                            <span
                              aria-hidden="true"
                              className="h-1.5 w-1.5 rounded-full bg-destructive"
                            />
                          </button>
                        </li>
                      </ul>
                    </div>

                    {/* Contact Us */}
                    <div>
                      <h4 className="text-xs font-semibold mb-2 text-foreground flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5" /> Contact Us
                      </h4>
                      <ul className="space-y-1.5 text-[12px] text-muted-foreground">
                        <li>
                          <button
                            type="button"
                            data-testid="support-chat-with-us"
                            onClick={() => {
                              setIsSupportCentreOpen(false);
                              openSupportPanel("chat");
                            }}
                            className="hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded text-left w-full"
                          >
                            Chat with us
                          </button>
                        </li>
                        <li>
                          <button
                            type="button"
                            data-testid="support-general-contact"
                            onClick={() =>
                              openUnavailable("General Contact")
                            }
                            className="hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded text-left w-full"
                          >
                            General Contact
                          </button>
                        </li>
                      </ul>
                    </div>

                    {/* eTask Manager */}
                    <div>
                      <h4 className="text-xs font-semibold mb-2 text-foreground flex items-center gap-1.5">
                        <Bell className="h-3.5 w-3.5" /> eTask Manager
                      </h4>
                      <ul className="space-y-1.5 text-[12px] text-muted-foreground">
                        <li>
                          <button
                            type="button"
                            data-testid="support-etask-attention"
                            onClick={() => openUnavailable("eTask Manager")}
                            className="hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded flex items-center gap-1.5 text-left w-full"
                          >
                            Attention needed{" "}
                            <span
                              aria-hidden="true"
                              className="h-1.5 w-1.5 rounded-full bg-destructive"
                            />
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

// ---------------------------------------------------------------------------
// Shell
// ---------------------------------------------------------------------------
export function Shell({
  children,
  isSupportOpen,
  onSupportOpenChange,
}: {
  children: ReactNode;
  isSupportOpen: boolean;
  onSupportOpenChange: (open: boolean) => void;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary/10">
      <TopBar />
      <Navbar
        isSupportOpen={isSupportOpen}
        onSupportOpenChange={onSupportOpenChange}
      />
      <main className="flex-1 flex flex-col">{children}</main>
    </div>
  );
}
