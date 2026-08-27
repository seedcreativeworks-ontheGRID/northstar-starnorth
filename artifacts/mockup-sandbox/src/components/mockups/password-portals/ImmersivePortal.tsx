import { useState } from "react";
import {
  ArrowRight,
  Building2,
  Eye,
  EyeOff,
  KeyRound,
  LoaderCircle,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";

export function ImmersivePortal() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    setHasError(false);
    setIsSubmitting(true);
    window.setTimeout(() => {
      setIsSubmitting(false);
      setHasError(true);
    }, 1150);
  };

  return (
    <main
      className="relative isolate min-h-[100dvh] overflow-hidden bg-[#07182b] px-4 py-5 font-['Plus_Jakarta_Sans',sans-serif] text-[#e8f2fb] sm:px-8 sm:py-8"
      aria-labelledby="portal-title"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-90"
        style={{
          background:
            "radial-gradient(circle at 80% 16%, rgba(35,122,206,.37), transparent 25%), radial-gradient(circle at 5% 92%, rgba(63,160,156,.23), transparent 34%), linear-gradient(127deg, #07182b 0%, #0a2946 48%, #071a2d 100%)",
        }}
      />
      <div className="pointer-events-none absolute -right-28 top-12 h-80 w-80 rounded-full border border-sky-200/15 sm:h-[32rem] sm:w-[32rem]" />
      <div className="pointer-events-none absolute -right-12 top-28 h-56 w-56 rounded-full border border-sky-100/10 sm:h-96 sm:w-96" />
      <div className="pointer-events-none absolute -left-24 bottom-[-10rem] h-80 w-80 rounded-full border border-teal-100/10 sm:h-[30rem] sm:w-[30rem]" />

      <header className="relative mx-auto flex w-full max-w-6xl items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#1684d5] shadow-[0_8px_24px_rgba(15,133,218,.28)]">
            <Sparkles className="h-5 w-5 text-white" aria-hidden="true" />
          </span>
          <div>
            <p className="text-[15px] font-bold tracking-[-0.03em] text-white">Northstar</p>
            <p className="text-[10px] font-semibold uppercase tracking-[0.19em] text-sky-200/70">Business</p>
          </div>
        </div>
        <div className="hidden items-center gap-2 text-xs font-medium text-sky-100/70 sm:flex">
          <span className="h-1.5 w-1.5 rounded-full bg-[#58c2b8]" />
          Demonstration environment
        </div>
      </header>

      <section className="relative mx-auto flex w-full max-w-6xl flex-col justify-center py-12 lg:min-h-[calc(100dvh-96px)] lg:py-8">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_minmax(370px,460px)] lg:gap-20">
          <div className="max-w-xl lg:pb-4">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-sky-100/15 bg-sky-100/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-sky-100/90 backdrop-blur-sm">
              <Building2 className="h-3.5 w-3.5 text-[#70d2ca]" aria-hidden="true" />
              Director workspace preview
            </div>
            <h1 id="portal-title" className="max-w-lg text-4xl font-semibold leading-[1.04] tracking-[-0.055em] text-white sm:text-5xl lg:text-6xl">
              A clearer view of what moves your business.
            </h1>
            <p className="mt-6 max-w-md text-[15px] leading-7 text-sky-100/70 sm:text-base">
              Step into a considered Northstar Business product demonstration,
              designed for the decisions behind every operating day.
            </p>
            <div className="mt-9 hidden grid-cols-2 gap-3 sm:grid lg:grid-cols-1 xl:grid-cols-2">
              <div className="rounded-2xl border border-sky-100/10 bg-[#0d3151]/55 p-4 backdrop-blur-sm">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-sky-200/60">Today’s focus</p>
                <p className="mt-2 text-sm font-semibold text-sky-50">Cash position, payroll & approvals</p>
              </div>
              <div className="rounded-2xl border border-sky-100/10 bg-[#0d3151]/55 p-4 backdrop-blur-sm">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-sky-200/60">Built for</p>
                <p className="mt-2 text-sm font-semibold text-sky-50">Directors and operators</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="pointer-events-none absolute -inset-5 rounded-[2.25rem] bg-[#3c9bd9]/15 blur-2xl" />
            <div className="relative overflow-hidden rounded-[1.75rem] border border-white/20 bg-[#eff7fb]/[0.97] p-5 text-[#102a43] shadow-[0_28px_70px_rgba(1,13,26,.38)] sm:p-8">
              <div className="absolute right-0 top-0 h-28 w-28 rounded-bl-[5rem] bg-[#d7eefb]" />
              <div className="relative">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#2374ae]">
                      Private preview
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[#102a43]">
                      Enter the workspace
                    </h2>
                  </div>
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#dceef8] text-[#1676b6]">
                    <KeyRound className="h-5 w-5" aria-hidden="true" />
                  </span>
                </div>

                <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-[#b8d8ea] bg-[#e8f4fa] px-3 py-2.5 text-xs leading-5 text-[#41647b]">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#217baa]" aria-hidden="true" />
                  <p><span className="font-bold text-[#245876]">Protected product demonstration.</span> Use any mock details to explore the interaction.</p>
                </div>

                <form className="mt-6 space-y-4" onSubmit={handleSubmit} noValidate>
                  <div>
                    <label htmlFor="immersive-username" className="mb-1.5 block text-xs font-bold text-[#244760]">
                      Username
                    </label>
                    <div className="group flex items-center rounded-xl border border-[#b6cfdf] bg-white px-3 transition focus-within:border-[#187fc2] focus-within:ring-4 focus-within:ring-[#258bd0]/15">
                      <UserRound className="h-4 w-4 shrink-0 text-[#6a8ba2] group-focus-within:text-[#187fc2]" aria-hidden="true" />
                      <input
                        id="immersive-username"
                        name="username"
                        autoComplete="username"
                        placeholder="Your demo username"
                        className="h-12 w-full bg-transparent px-3 text-sm text-[#102a43] outline-none placeholder:text-[#829cb0]"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="immersive-password" className="mb-1.5 block text-xs font-bold text-[#244760]">
                      Password
                    </label>
                    <div className="group flex items-center rounded-xl border border-[#b6cfdf] bg-white px-3 transition focus-within:border-[#187fc2] focus-within:ring-4 focus-within:ring-[#258bd0]/15">
                      <KeyRound className="h-4 w-4 shrink-0 text-[#6a8ba2] group-focus-within:text-[#187fc2]" aria-hidden="true" />
                      <input
                        id="immersive-password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        placeholder="Your demo password"
                        className="h-12 w-full bg-transparent px-3 text-sm text-[#102a43] outline-none placeholder:text-[#829cb0]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((visible) => !visible)}
                        className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-[#53748a] transition hover:bg-[#e8f4fa] hover:text-[#176fa9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#187fc2]"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div aria-live="polite" aria-atomic="true">
                    {hasError && (
                      <p className="rounded-lg border border-[#e7babc] bg-[#fff0f0] px-3 py-2.5 text-xs leading-5 text-[#9c333b]">
                        Those demo details weren’t recognised. This preview accepts no real credentials—please try any values again.
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#1275b7] px-4 text-sm font-bold text-white shadow-[0_10px_20px_rgba(18,117,183,.24)] transition hover:bg-[#0d669f] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#187fc2]/35 disabled:cursor-wait disabled:opacity-80"
                  >
                    {isSubmitting ? (
                      <>
                        <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
                        Checking demonstration access
                      </>
                    ) : (
                      <>
                        Sign in to preview
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </>
                    )}
                  </button>
                </form>
                <p className="mt-5 text-center text-[11px] leading-5 text-[#6c879a]">
                  Northstar Business is a fictional product experience. No account access or banking instruction is available here.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="relative mx-auto flex w-full max-w-6xl items-center justify-between gap-4 text-[10px] font-medium tracking-[0.08em] text-sky-100/45">
        <span>Northstar Business / Product demonstration</span>
        <span className="hidden sm:inline">A decision workspace, not a banking service</span>
      </footer>
    </main>
  );
}