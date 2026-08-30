import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowRight, Building2, Eye, EyeOff, KeyRound, LoaderCircle, LogOut, ShieldCheck, Sparkles, UserRound } from "lucide-react";
import { WovenBackground } from "./WovenBackground";
import { GuidedQuestionnaire } from "./GuidedQuestionnaire";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

type Props = {
  initialStage?: "login" | "questionnaire";
  onAuthenticated: () => void;
};

export function ImmersivePortal({ initialStage = "login", onAuthenticated }: Props) {
  const [stage, setStage] = useState<"login" | "questionnaire">(initialStage);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [exitError, setExitError] = useState("");
  const [error, setError] = useState("");
  const reduceMotion = useReducedMotion();
  const usernameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (stage !== "login") return;
    const frame = window.requestAnimationFrame(() => usernameRef.current?.focus());
    return () => window.cancelAnimationFrame(frame);
  }, [stage]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;
    if (!username || !password || username.length > 128 || password.length > 128) {
      setError("Enter your demonstration username and password.");
      return;
    }
    setError("");
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!response.ok) {
        const body = await response.json().catch(() => null) as { error?: string } | null;
        setError(body?.error || "Unable to sign in with those details.");
        return;
      }
      const body = await response.json() as { questionnaireRequired?: boolean };
      if (body.questionnaireRequired) {
        setStage("questionnaire");
      } else {
        onAuthenticated();
      }
    } catch {
      setError("Unable to sign in right now. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const exitQuestionnaire = async () => {
    if (isExiting) return;
    setExitError("");
    setIsExiting(true);
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "same-origin",
      });
      if (!response.ok) {
        throw new Error("Unable to end the guided session");
      }
      setUsername("");
      setPassword("");
      setError("");
      setStage("login");
    } catch {
      setExitError("Unable to return to login right now. Please try again.");
    } finally {
      setIsExiting(false);
    }
  };

  return (
    <main className="relative isolate min-h-[100dvh] overflow-x-hidden bg-[#07182b] px-4 py-5 font-['Plus_Jakarta_Sans',sans-serif] text-[#e8f2fb] sm:px-8 sm:py-8" aria-labelledby="portal-title">
      <div className="pointer-events-none absolute inset-0 opacity-90" style={{ background: "radial-gradient(circle at 80% 16%, rgba(35,122,206,.37), transparent 25%), radial-gradient(circle at 5% 92%, rgba(63,160,156,.23), transparent 34%), linear-gradient(127deg, #07182b 0%, #0a2946 48%, #071a2d 100%)" }} />
      <WovenBackground />
      <div className="pointer-events-none absolute -right-28 top-12 h-80 w-80 rounded-full border border-sky-200/15 sm:h-[32rem] sm:w-[32rem]" />
      <div className="pointer-events-none absolute -left-24 bottom-[-10rem] h-80 w-80 rounded-full border border-teal-100/10 sm:h-[30rem] sm:w-[30rem]" />
      <header className="relative z-10 mx-auto flex w-full max-w-6xl items-start justify-between gap-4">
        <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#1684d5] shadow-[0_8px_24px_rgba(15,133,218,.28)]"><Sparkles className="h-5 w-5 text-white" /></span><div><p className="text-[15px] font-bold tracking-[-.03em] text-white">Northstar</p><p className="text-[10px] font-semibold uppercase tracking-[.19em] text-sky-200/70">Business</p></div></div>
        {stage === "questionnaire" ? (
          <div className="flex flex-col items-end gap-2">
            <button
              type="button"
              data-testid="button-exit-questionnaire"
              onClick={() => void exitQuestionnaire()}
              disabled={isExiting}
              className="flex h-10 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 text-xs font-bold text-white backdrop-blur-sm transition hover:border-white/35 hover:bg-white/15 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-300/30 disabled:cursor-wait disabled:opacity-70"
            >
              {isExiting ? <LoaderCircle className="h-4 w-4 animate-spin motion-reduce:animate-none" aria-hidden="true" /> : <LogOut className="h-4 w-4" aria-hidden="true" />}
              {isExiting ? "Returning to login" : "Exit to login"}
            </button>
            {exitError && <p className="max-w-64 text-right text-xs leading-5 text-red-200" role="alert">{exitError}</p>}
          </div>
        ) : (
          <div className="hidden items-center gap-2 text-xs font-medium text-sky-100/70 sm:flex"><span className="h-1.5 w-1.5 rounded-full bg-[#58c2b8]" />Demonstration environment</div>
        )}
      </header>
      <section className="relative z-10 mx-auto flex w-full max-w-6xl flex-col justify-center py-12 lg:min-h-[calc(100dvh-96px)] lg:py-8">
        <AnimatePresence mode="wait">
          {stage === "login" ? (
            <motion.div
              key="login"
              initial={reduceMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: reduceMotion ? 0 : 0.4, ease: "easeOut" }}
              className="grid items-center gap-10 lg:grid-cols-[1fr_minmax(370px,460px)] lg:gap-20"
            >
              <div className="max-w-xl lg:pb-4">
                <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-sky-100/15 bg-sky-100/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[.15em] text-sky-100/90 backdrop-blur-sm"><Building2 className="h-3.5 w-3.5 text-[#70d2ca]" />Director workspace preview</div>
                <h1 id="portal-title" className="max-w-lg text-4xl font-semibold leading-[1.04] tracking-[-.055em] text-white sm:text-5xl lg:text-6xl">A clearer view of what moves your business.</h1>
                <p className="mt-6 max-w-md text-[15px] leading-7 text-sky-100/70 sm:text-base">Step into a considered Northstar Business product demonstration, designed for the decisions behind every operating day.</p>
              </div>
              <div className="relative"><div className="pointer-events-none absolute -inset-5 rounded-[2.25rem] bg-[#3c9bd9]/15 blur-2xl" /><div className="relative overflow-hidden rounded-[1.75rem] border border-white/20 bg-[#eff7fb]/[.97] p-5 text-[#102a43] shadow-[0_28px_70px_rgba(1,13,26,.38)] sm:p-8 backdrop-blur-xl">
                <div className="absolute right-0 top-0 h-28 w-28 rounded-bl-[5rem] bg-[#d7eefb]" /><div className="relative">
                  <div className="flex items-start justify-between gap-4"><div><p className="text-[11px] font-bold uppercase tracking-[.16em] text-[#2374ae]">Private preview</p><h2 className="mt-2 text-2xl font-semibold tracking-[-.04em] text-[#102a43]">Enter the workspace</h2></div><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#dceef8] text-[#1676b6]"><KeyRound className="h-5 w-5" /></span></div>
                  <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-[#b8d8ea] bg-[#e8f4fa] px-3 py-2.5 text-xs leading-5 text-[#41647b]"><ShieldCheck className="mt-.5 h-4 w-4 shrink-0 text-[#217baa]" /><p><span className="font-bold text-[#245876]">Protected product demonstration.</span> Enter the credentials provided for this preview.</p></div>
                  <form className="mt-6 space-y-4" onSubmit={submit} noValidate>
                    <div><label htmlFor="immersive-username" className="mb-1.5 block text-xs font-bold text-[#244760]">Username</label><div className="group flex items-center rounded-xl border border-[#b6cfdf] bg-white px-3 focus-within:border-[#187fc2] focus-within:ring-4 focus-within:ring-[#258bd0]/15"><UserRound className="h-4 w-4 shrink-0 text-[#6a8ba2]" aria-hidden="true" /><input ref={usernameRef} id="immersive-username" data-testid="input-login-username" value={username} onChange={(event) => setUsername(event.target.value)} maxLength={128} autoComplete="username" autoFocus placeholder="Your demo username" required disabled={isSubmitting} className="h-12 w-full bg-transparent px-3 text-sm text-[#102a43] outline-none placeholder:text-[#829cb0] disabled:cursor-wait" /></div></div>
                    <div><label htmlFor="immersive-password" className="mb-1.5 block text-xs font-bold text-[#244760]">Password</label><div className="group flex items-center rounded-xl border border-[#b6cfdf] bg-white px-3 focus-within:border-[#187fc2] focus-within:ring-4 focus-within:ring-[#258bd0]/15"><KeyRound className="h-4 w-4 shrink-0 text-[#6a8ba2]" aria-hidden="true" /><input id="immersive-password" data-testid="input-login-password" value={password} onChange={(event) => setPassword(event.target.value)} maxLength={128} type={showPassword ? "text" : "password"} autoComplete="current-password" placeholder="Your demo password" required disabled={isSubmitting} aria-describedby={error ? "login-error" : undefined} className="h-12 w-full bg-transparent px-3 text-sm text-[#102a43] outline-none placeholder:text-[#829cb0] disabled:cursor-wait" /><button type="button" data-testid="button-toggle-password" onClick={() => setShowPassword((visible) => !visible)} className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-[#53748a] transition hover:bg-[#e8f4fa] hover:text-[#176fa9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#187fc2]" aria-label={showPassword ? "Hide password" : "Show password"} aria-pressed={showPassword} disabled={isSubmitting}>{showPassword ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}</button></div></div>
                    <div aria-live="polite" aria-atomic="true">{error && <p id="login-error" data-testid="text-login-error" className="rounded-lg border border-[#e7babc] bg-[#fff0f0] px-3 py-2.5 text-xs leading-5 text-[#9c333b]">{error}</p>}</div>
                    <button type="submit" data-testid="button-login-submit" disabled={isSubmitting} className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#1275b7] px-4 text-sm font-bold text-white shadow-[0_10px_20px_rgba(18,117,183,.24)] transition hover:bg-[#0d669f] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#187fc2]/35 disabled:cursor-wait disabled:opacity-80">{isSubmitting ? <><LoaderCircle className="h-4 w-4 animate-spin motion-reduce:animate-none" aria-hidden="true" />Checking demonstration access</> : <>Sign in to preview<ArrowRight className="h-4 w-4" aria-hidden="true" /></>}</button>
                  </form><p className="mt-5 text-center text-[11px] leading-5 text-[#6c879a]">Northstar Business is a fictional product experience. No account access or banking instruction is available here.</p>
                </div></div></div>
            </motion.div>
          ) : (
            <motion.div
              key="questionnaire"
              initial={reduceMotion ? false : { opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ duration: reduceMotion ? 0 : 0.4, ease: "easeOut" }}
              className="w-full"
            >
              <GuidedQuestionnaire onCompleted={() => onAuthenticated()} />
            </motion.div>
          )}
        </AnimatePresence>
      </section>
      <footer className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between gap-4 text-[10px] font-medium tracking-[.08em] text-sky-100/45"><span>Northstar Business / Product demonstration</span><span className="hidden sm:inline">A decision workspace, not a banking service</span></footer>
    </main>
  );
}