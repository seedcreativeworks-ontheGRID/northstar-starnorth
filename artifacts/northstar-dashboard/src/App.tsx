import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import Dashboard from '@/pages/Dashboard';
import { AppProvider } from '@/store';
import { useAppStore } from '@/store';
import { DemoDisclosureDialog } from '@/components/dashboard/DemoDisclosureDialog';
import { ImmersivePortal } from '@/components/auth/ImmersivePortal';
import {
  authenticatedFetch,
  broadcastAuthInvalidation,
  subscribeToAuthInvalidation,
} from '@/auth-events';
import {
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';

const queryClient = new QueryClient();

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function AuthGate() {
  const [status, setStatus] = useState<"checking" | "questionnaire" | "authenticated" | "unauthenticated">("checking");
  const { activeUser, applyAuthenticatedProfile } = useAppStore();
  const authGeneration = useRef(0);
  const activeUserRef = useRef(activeUser);

  useEffect(() => {
    activeUserRef.current = activeUser;
  }, [activeUser]);

  const refreshSession = useCallback(async (showChecking = false, resetDemo = false) => {
    const generation = ++authGeneration.current;
    if (showChecking) setStatus("checking");
    try {
      const response = await authenticatedFetch("/api/auth/session");
      const body = await response.json() as {
        authenticated?: boolean;
        profile?: "ben" | "james" | null;
        profileLocked?: boolean;
        questionnaireRequired?: boolean;
      };
      const authenticated = response.ok && body.authenticated === true;
      if (generation !== authGeneration.current) return false;
      if (!authenticated) {
        broadcastAuthInvalidation();
        return false;
      }
      if (body.questionnaireRequired) {
        setStatus("questionnaire");
        return true;
      }
      if (body.profile !== "ben" && body.profile !== "james") {
        setStatus("unauthenticated");
        return false;
      }
      const profileLocked = body.profileLocked !== false;
      applyAuthenticatedProfile(profileLocked ? body.profile : activeUserRef.current, resetDemo, profileLocked);
      setStatus("authenticated");
      return authenticated;
    } catch {
      if (generation !== authGeneration.current) return false;
      setStatus("unauthenticated");
      return false;
    }
  }, [applyAuthenticatedProfile]);

  useEffect(() => {
    void refreshSession(true);
    const signedOut = () => {
      authGeneration.current += 1;
      setStatus("unauthenticated");
    };
    const onFocus = () => void refreshSession();
    const timer = window.setInterval(() => void refreshSession(), 5 * 60 * 1000);
    const unsubscribe = subscribeToAuthInvalidation(signedOut);
    window.addEventListener("focus", onFocus);
    return () => {
      authGeneration.current += 1;
      window.clearInterval(timer);
      unsubscribe();
      window.removeEventListener("focus", onFocus);
    };
  }, [refreshSession]);

  if (status === "checking") {
    return <main className="min-h-[100dvh] bg-[#07182b]" aria-busy="true" aria-label="Checking demonstration access" />;
  }
  if (status === "unauthenticated") {
    return <ImmersivePortal onAuthenticated={() => {
      void refreshSession(true, true);
    }} />;
  }
  if (status === "questionnaire") {
    return <ImmersivePortal initialStage="questionnaire" onAuthenticated={() => {
      void refreshSession(true, true);
    }} />;
  }
  return <Router />;
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
            <AuthGate />
          </WouterRouter>
          <DemoDisclosureDialog />
          <Toaster />
        </TooltipProvider>
      </AppProvider>
    </QueryClientProvider>
  );
}

export default App;
