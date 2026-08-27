import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  KeyRound,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export function ProgressiveAccess() {
  const [step, setStep] = useState<"identity" | "password">("identity");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const target = step === "identity" ? usernameRef.current : passwordRef.current;
    const timer = window.setTimeout(() => target?.focus(), 60);
    return () => window.clearTimeout(timer);
  }, [step]);

  const continueToPassword = () => {
    if (!username.trim()) {
      setError("Enter a username to continue.");
      usernameRef.current?.focus();
      return;
    }
    setError("");
    setStep("password");
  };

  const returnToIdentity = () => {
    setError("");
    setPassword("");
    setStep("identity");
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (step === "identity") {
      continueToPassword();
      return;
    }
    if (!password) {
      setError("Enter a password to continue.");
      passwordRef.current?.focus();
      return;
    }
    setError("");
    setIsLoading(true);
    window.setTimeout(() => {
      setIsLoading(false);
      setError("Those details aren’t recognised in this demonstration. Try any values to test again.");
      passwordRef.current?.focus();
    }, 1050);
  };

  return (
    <main
      className="relative isolate min-h-[100dvh] overflow-hidden bg-[#edf2f7] font-['Plus_Jakarta_Sans',system-ui,sans-serif] text-[#14243a]"
      style={{
        backgroundImage:
          "radial-gradient(circle at 84% 16%, rgba(166,202,239,.55), transparent 27%), radial-gradient(circle at 12% 91%, rgba(207,223,235,.72), transparent 26%)",
      }}
    >
      <div className="pointer-events-none absolute -right-32 top-14 h-80 w-80 rounded-full border border-[#bad2e8]/70" />
      <div className="pointer-events-none absolute -right-10 top-36 h-80 w-80 rounded-full border border-[#bed7ec]/60" />
      <div className="pointer-events-none absolute bottom-[-180px] left-[19%] h-96 w-96 rounded-full border border-[#c9d8e5]/70" />

      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6 sm:px-10 sm:py-8">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#0959a5] shadow-[0_8px_18px_rgba(9,89,165,.19)]">
            <Sparkles className="h-[18px] w-[18px] text-[#eaf5ff]" strokeWidth={2.4} />
          </div>
          <div>
            <p className="text-[15px] font-bold leading-none tracking-[-0.03em]">Northstar</p>
            <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.19em] text-[#57708a]">Business</p>
          </div>
        </div>
        <div className="hidden items-center gap-2 text-xs font-semibold text-[#57708a] sm:flex">
          <ShieldCheck className="h-4 w-4 text-[#16705d]" />
          Product demonstration
        </div>
      </header>

      <section className="relative z-10 mx-auto flex w-full max-w-7xl items-center px-5 pb-10 pt-4 sm:px-10 sm:pb-16 lg:min-h-[calc(100dvh-101px)] lg:pt-0">
        <div className="grid w-full overflow-hidden rounded-[28px] border border-white/80 bg-white/75 shadow-[0_28px_80px_rgba(29,57,82,.16)] backdrop-blur-sm lg:grid-cols-[1.08fr_.92fr]">
          <aside className="relative hidden min-h-[550px] overflow-hidden bg-[#0b315d] p-12 text-[#eff7ff] lg:block">
            <div className="absolute inset-0 opacity-90" style={{ backgroundImage: "linear-gradient(135deg, #0c427d 0%, #08284d 77%)" }} />
            <div className="absolute -left-20 top-24 h-72 w-72 rounded-full border border-[#6fa8dc]/30" />
            <div className="absolute -left-5 top-8 h-72 w-72 rounded-full border border-[#83b6e4]/20" />
            <div className="absolute bottom-0 right-0 h-64 w-64 bg-[radial-gradient(circle_at_bottom_right,rgba(77,159,235,.38),transparent_65%)]" />
            <div className="relative flex h-full flex-col">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#9fc8eb]">Private product tour</p>
              <h1 className="mt-6 max-w-sm text-[42px] font-semibold leading-[1.06] tracking-[-0.055em]">
                A clearer view of your business, one decision at a time.
              </h1>
              <p className="mt-6 max-w-sm text-[15px] leading-7 text-[#c7dcef]">
                This guided environment previews the Northstar Business workspace for directors and operators.
              </p>
              <div className="mt-auto space-y-4 pt-10">
                {[
                  "Cash position, presented with context",
                  "Approvals that keep work moving",
                  "No live accounts or banking actions",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-sm text-[#dcecf9]">
                    <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#2b75b9]">
                      <Check className="h-3 w-3" strokeWidth={3} />
                    </span>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </aside>

          <div className="flex min-h-[580px] flex-col px-6 py-9 sm:px-12 sm:py-12 lg:px-14">
            <div className="mb-auto">
              <div className="flex items-center gap-2 lg:hidden">
                <ShieldCheck className="h-4 w-4 text-[#16705d]" />
                <span className="text-xs font-semibold text-[#57708a]">Protected product demonstration</span>
              </div>
              <div className="mt-7 flex items-center gap-2" aria-label={`Step ${step === "identity" ? "one" : "two"} of two`}>
                <span className={`h-1.5 w-10 rounded-full ${step === "identity" ? "bg-[#0b63b6]" : "bg-[#93c0e9]"}`} />
                <span className={`h-1.5 w-10 rounded-full ${step === "password" ? "bg-[#0b63b6]" : "bg-[#d6e4f0]"}`} />
                <span className="ml-1 text-[10px] font-bold uppercase tracking-[0.15em] text-[#71869a]">
                  {step === "identity" ? "Step 1 of 2" : "Step 2 of 2"}
                </span>
              </div>

              <div className="mt-9">
                <div className="mb-4 grid h-11 w-11 place-items-center rounded-2xl bg-[#e9f3fc] text-[#0b63b6]">
                  {step === "identity" ? <KeyRound className="h-5 w-5" /> : <LockKeyhole className="h-5 w-5" />}
                </div>
                <h2 className="text-[29px] font-bold tracking-[-0.045em] text-[#14243a]">
                  {step === "identity" ? "Start with your username" : "Welcome back"}
                </h2>
                <p className="mt-3 max-w-sm text-sm leading-6 text-[#60778d]">
                  {step === "identity"
                    ? "We’ll use this to tailor your Northstar Business demonstration."
                    : `Continue as ${username}. This is a simulated access check.`}
                </p>
              </div>

              <form className="mt-8" onSubmit={handleSubmit} noValidate>
                {step === "identity" ? (
                  <div>
                    <label htmlFor="northstar-username" className="text-sm font-bold text-[#243b53]">
                      Username
                    </label>
                    <input
                      ref={usernameRef}
                      id="northstar-username"
                      name="username"
                      autoComplete="username"
                      value={username}
                      onChange={(event) => {
                        setUsername(event.target.value);
                        if (error) setError("");
                      }}
                      placeholder="Enter a mock username"
                      className="mt-2 h-12 w-full rounded-xl border border-[#c6d6e4] bg-[#fbfdff] px-4 text-sm text-[#14243a] outline-none transition placeholder:text-[#91a4b4] focus:border-[#0b63b6] focus:ring-4 focus:ring-[#0b63b6]/15"
                      aria-describedby={error ? "access-message" : "username-note"}
                    />
                    <p id="username-note" className="mt-3 text-xs leading-5 text-[#71869a]">
                      Use any mock identifier. Nothing is stored or transmitted.
                    </p>
                  </div>
                ) : (
                  <div>
                    <label htmlFor="northstar-password" className="text-sm font-bold text-[#243b53]">
                      Password
                    </label>
                    <div className="relative mt-2">
                      <input
                        ref={passwordRef}
                        id="northstar-password"
                        name="password"
                        autoComplete="current-password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(event) => {
                          setPassword(event.target.value);
                          if (error) setError("");
                        }}
                        placeholder="Enter any mock password"
                        className="h-12 w-full rounded-xl border border-[#c6d6e4] bg-[#fbfdff] px-4 pr-12 text-sm text-[#14243a] outline-none transition placeholder:text-[#91a4b4] focus:border-[#0b63b6] focus:ring-4 focus:ring-[#0b63b6]/15"
                        aria-describedby={error ? "access-message" : "password-note"}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((visible) => !visible)}
                        className="absolute right-1.5 top-1.5 grid h-9 w-9 place-items-center rounded-lg text-[#5f7890] transition hover:bg-[#eaf3fa] hover:text-[#0b63b6] focus:outline-none focus:ring-2 focus:ring-[#0b63b6]"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
                      </button>
                    </div>
                    <p id="password-note" className="mt-3 text-xs leading-5 text-[#71869a]">
                      Sign-in always returns a test response — this portal is not connected to banking services.
                    </p>
                  </div>
                )}

                <div id="access-message" aria-live="polite" className="min-h-6 pt-3">
                  {error && (
                    <p className="rounded-lg border border-[#f0c8c4] bg-[#fff5f3] px-3 py-2 text-xs font-medium leading-5 text-[#a13b35]" role="alert">
                      {error}
                    </p>
                  )}
                </div>

                <div className={`mt-4 flex gap-3 ${step === "password" ? "justify-between" : "justify-end"}`}>
                  {step === "password" && (
                    <button
                      type="button"
                      onClick={returnToIdentity}
                      disabled={isLoading}
                      className="inline-flex h-12 items-center gap-2 rounded-xl px-3 text-sm font-bold text-[#46647d] transition hover:bg-[#edf4f9] focus:outline-none focus:ring-4 focus:ring-[#0b63b6]/15 disabled:opacity-60"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Back
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="inline-flex h-12 min-w-[154px] items-center justify-center gap-2 rounded-xl bg-[#0b63b6] px-5 text-sm font-bold text-white shadow-[0_8px_18px_rgba(11,99,182,.2)] transition hover:bg-[#084f94] focus:outline-none focus:ring-4 focus:ring-[#0b63b6]/25 disabled:cursor-wait disabled:bg-[#4d8fca]"
                  >
                    {isLoading ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/35 border-t-white" />
                        Checking access
                      </>
                    ) : step === "identity" ? (
                      <>
                        Continue
                        <ArrowRight className="h-4 w-4" />
                      </>
                    ) : (
                      "Sign in to demo"
                    )}
                  </button>
                </div>
              </form>
            </div>

            <footer className="mt-10 border-t border-[#d9e4ed] pt-5 text-[11px] leading-5 text-[#71869a]">
              Protected product demonstration. For preview use only; no customer account, transaction, or instruction can be accessed here.
            </footer>
          </div>
        </div>
      </section>
    </main>
  );
}