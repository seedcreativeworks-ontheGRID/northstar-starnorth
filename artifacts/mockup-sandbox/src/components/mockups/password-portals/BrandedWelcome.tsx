import { useEffect, useId, useState } from "react";
import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  LockKeyhole,
  Sparkles,
  Star,
} from "lucide-react";

export function BrandedWelcome() {
  const usernameId = useId();
  const passwordId = useId();
  const errorId = useId();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    return () => {
      // The submission timer is intentionally local to this mock interaction.
    };
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isLoading) return;

    setError("");
    setIsLoading(true);
    window.setTimeout(() => {
      setIsLoading(false);
      setError("Those demonstration credentials could not be verified. Please try again.");
    }, 950);
  };

  return (
    <main
      className="min-h-[100dvh] overflow-hidden bg-[#f4f6f8] text-[#11233e]"
      style={{ fontFamily: "'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif" }}
    >
      <div className="grid min-h-[100dvh] lg:grid-cols-[minmax(0,1.16fr)_minmax(410px,0.84fr)]">
        <section className="relative flex overflow-hidden bg-[#123b72] px-6 py-8 text-[#f4f6f8] sm:px-10 sm:py-10 lg:px-[clamp(3rem,7vw,8.5rem)] lg:py-[clamp(3.25rem,8vh,6rem)]">
          <div
            className="pointer-events-none absolute inset-0 opacity-70"
            style={{
              background:
                "radial-gradient(circle at 15% 89%, rgba(100,174,203,.32), transparent 27%), radial-gradient(circle at 92% 12%, rgba(248,213,147,.22), transparent 25%), linear-gradient(125deg, rgba(18,59,114,0) 45%, rgba(7,31,68,.32))",
            }}
          />
          <div className="pointer-events-none absolute -right-24 bottom-[-8rem] h-80 w-80 rounded-full border border-[#8fcae0]/30" />
          <div className="pointer-events-none absolute -right-5 bottom-[-4rem] h-56 w-56 rounded-full border border-[#8fcae0]/25" />

          <div className="relative z-10 flex w-full max-w-xl flex-col">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-[14px] bg-[#f7cb71] text-[#123b72] shadow-[0_8px_20px_rgba(4,23,53,.25)]">
                <Star className="h-5 w-5 fill-current" aria-hidden="true" />
              </div>
              <span className="text-[15px] font-bold tracking-[-0.02em]">Northstar Business</span>
            </div>

            <div className="my-auto py-14 lg:py-0">
              <p className="mb-5 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#9ed4e8]">
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                A guided product tour
              </p>
              <h1 className="max-w-lg text-[clamp(2.65rem,5vw,5.25rem)] font-semibold leading-[0.98] tracking-[-0.065em]">
                A clearer view of what moves your business.
              </h1>
              <p className="mt-7 max-w-md text-[15px] leading-7 text-[#d7e6f0] sm:text-base">
                Welcome to the Northstar Business product demonstration. Explore
                a workspace made for the people keeping every moving part in view.
              </p>

              <div className="mt-10 grid max-w-lg gap-3 sm:grid-cols-2">
                <div className="border-l border-[#86c6dd]/65 pl-4">
                  <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#9ed4e8]">Built for</p>
                  <p className="mt-1.5 text-sm font-medium">Directors &amp; operators</p>
                </div>
                <div className="border-l border-[#86c6dd]/65 pl-4">
                  <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#9ed4e8]">Inside the demo</p>
                  <p className="mt-1.5 text-sm font-medium">Cash, teams &amp; approvals</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-[#c5dcea]">
              <span className="h-px w-7 bg-[#8fcae0]/70" />
              Northstar is a fictional product experience
            </div>
          </div>
        </section>

        <section className="relative flex items-center justify-center bg-[#f4f6f8] px-5 py-9 sm:px-10">
          <div className="w-full max-w-[390px]">
            <div className="mb-8 lg:mb-10">
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#dceafa] text-[#155da8]">
                <LockKeyhole className="h-5 w-5" aria-hidden="true" />
              </div>
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#3976ae]">Protected product demonstration</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.055em] text-[#102743]">Welcome in.</h2>
              <p className="mt-2 max-w-sm text-sm leading-6 text-[#53667c]">
                Use your demo access details to enter the Northstar workspace.
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate aria-describedby={error ? errorId : undefined}>
              <div className="space-y-5">
                <div>
                  <label htmlFor={usernameId} className="mb-2 block text-sm font-bold text-[#253b56]">
                    Username
                  </label>
                  <input
                    id={usernameId}
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    autoComplete="username"
                    placeholder="Enter your demo username"
                    className="h-12 w-full rounded-xl border border-[#c8d3df] bg-[#fbfcfd] px-4 text-sm text-[#11233e] outline-none transition placeholder:text-[#8795a5] focus:border-[#1769b0] focus:ring-4 focus:ring-[#cce4f7]"
                  />
                </div>
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label htmlFor={passwordId} className="block text-sm font-bold text-[#253b56]">
                      Password
                    </label>
                    <span className="text-xs text-[#718297]">Demo access only</span>
                  </div>
                  <div className="relative">
                    <input
                      id={passwordId}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      className="h-12 w-full rounded-xl border border-[#c8d3df] bg-[#fbfcfd] px-4 pr-12 text-sm text-[#11233e] outline-none transition placeholder:text-[#8795a5] focus:border-[#1769b0] focus:ring-4 focus:ring-[#cce4f7]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((visible) => !visible)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      aria-pressed={showPassword}
                      className="absolute inset-y-0 right-0 grid w-12 place-items-center rounded-r-xl text-[#54718f] outline-none transition hover:text-[#155da8] focus-visible:ring-4 focus-visible:ring-[#cce4f7]"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              </div>

              <div aria-live="polite" id={errorId} className="min-h-10 pt-3">
                {error && (
                  <div role="alert" className="flex items-start gap-2 rounded-lg border border-[#e7b8b4] bg-[#fff3f1] px-3 py-2.5 text-xs leading-5 text-[#9c332b]">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#c64a41]" />
                    {error}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#155da8] px-5 text-sm font-bold text-white shadow-[0_10px_20px_rgba(21,93,168,.2)] outline-none transition hover:bg-[#104f90] focus-visible:ring-4 focus-visible:ring-[#9ac6ea] disabled:cursor-wait disabled:opacity-75"
              >
                {isLoading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden="true" />
                    Checking demo access
                  </>
                ) : (
                  <>
                    Sign in to the demo
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-7 border-t border-[#d7e0e8] pt-5">
              <p className="flex items-start gap-2 text-xs leading-5 text-[#65778b]">
                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#3976ae]" aria-hidden="true" />
                This is a restricted preview, not a real banking login. No account or financial information is used.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}