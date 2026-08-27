import { useState } from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export function CommandGate() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setHasError(false);
    setIsSubmitting(true);

    window.setTimeout(() => {
      setIsSubmitting(false);
      setHasError(true);
    }, 950);
  };

  return (
    <main
      className="relative isolate flex min-h-[100dvh] overflow-hidden bg-[#f4f7fb] px-4 py-4 font-['Plus_Jakarta_Sans',sans-serif] text-[#14243c] sm:p-7"
      aria-labelledby="command-gate-title"
    >
      <div className="pointer-events-none absolute inset-0 opacity-80 [background-image:linear-gradient(rgba(18,71,142,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(18,71,142,0.055)_1px,transparent_1px)] [background-size:34px_34px]" />
      <div className="pointer-events-none absolute -left-28 top-[-9rem] h-80 w-80 rounded-full bg-[#b9d7fc]/50 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 right-[-6rem] h-96 w-96 rounded-full bg-[#d5e5f8]/75 blur-3xl" />

      <section className="relative flex min-h-[calc(100dvh-2rem)] w-full flex-col overflow-hidden rounded-[1.6rem] border border-[#cbd9eb] bg-[#f9fbfe]/90 shadow-[0_24px_80px_rgba(32,67,114,0.13)] backdrop-blur-sm sm:min-h-[calc(100dvh-3.5rem)]">
        <header className="flex items-center justify-between border-b border-[#d8e2ef] px-5 py-4 sm:px-7">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#0d4e9b] text-white shadow-[0_6px_14px_rgba(13,78,155,0.24)]">
              <Sparkles className="h-4 w-4" strokeWidth={2.4} aria-hidden="true" />
            </div>
            <div>
              <p className="text-[13px] font-extrabold tracking-[-0.03em] text-[#122b4b]">
                NORTHSTAR
              </p>
              <p className="mt-[-1px] text-[9px] font-bold uppercase tracking-[0.19em] text-[#63809f]">
                Business
              </p>
            </div>
          </div>
          <div className="hidden items-center gap-2 text-[11px] font-semibold text-[#597593] sm:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-[#2774c8]" />
            Product preview
          </div>
        </header>

        <div className="flex flex-1 items-center justify-center px-5 py-10 sm:px-7">
          <div className="w-full max-w-[382px]">
            <div className="mb-7 flex items-center gap-3">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-[#cbdcf0] bg-[#eaf3ff] text-[#0d5aac]">
                <LockKeyhole className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.17em] text-[#2865a9]">
                  Command gate
                </p>
                <p className="mt-0.5 text-xs text-[#6a829e]">Restricted preview access</p>
              </div>
            </div>

            <h1 id="command-gate-title" className="text-[32px] font-bold leading-[1.05] tracking-[-0.055em] text-[#102844] sm:text-[36px]">
              Welcome back.
            </h1>
            <p className="mt-3 max-w-[330px] text-sm leading-6 text-[#627b97]">
              Enter any mock details to test this protected Northstar product demonstration.
            </p>

            <form className="mt-8 space-y-4" onSubmit={handleSubmit} noValidate>
              <div className="space-y-1.5">
                <label htmlFor="command-username" className="text-[12px] font-bold text-[#264563]">
                  Username
                </label>
                <input
                  id="command-username"
                  name="username"
                  autoComplete="username"
                  placeholder="name@company.com"
                  className="h-12 w-full rounded-xl border border-[#c9d8e9] bg-white px-3.5 text-sm text-[#193855] outline-none transition placeholder:text-[#91a4ba] focus:border-[#1970ca] focus:ring-4 focus:ring-[#c9e2fd]"
                  onChange={() => hasError && setHasError(false)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="command-password" className="text-[12px] font-bold text-[#264563]">
                    Password
                  </label>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#7590ac]">
                    Mock only
                  </span>
                </div>
                <div className="relative">
                  <input
                    id="command-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Enter password"
                    className="h-12 w-full rounded-xl border border-[#c9d8e9] bg-white px-3.5 pr-12 text-sm text-[#193855] outline-none transition placeholder:text-[#91a4ba] focus:border-[#1970ca] focus:ring-4 focus:ring-[#c9e2fd]"
                    onChange={() => hasError && setHasError(false)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((visible) => !visible)}
                    className="absolute inset-y-0 right-0 grid w-12 place-items-center rounded-r-xl text-[#6b86a2] outline-none transition hover:text-[#125eaf] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#176dc1]"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-[18px] w-[18px]" aria-hidden="true" /> : <Eye className="h-[18px] w-[18px]" aria-hidden="true" />}
                  </button>
                </div>
              </div>

              <div aria-live="polite" aria-atomic="true">
                {hasError && (
                  <div role="alert" className="flex items-start gap-2.5 rounded-xl border border-[#f3c2bd] bg-[#fff4f2] px-3 py-2.5 text-[12px] leading-5 text-[#a64035]">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#cc4f42]" />
                    <span>Those mock credentials didn’t match. Try any values again to replay the access check.</span>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#0d57a5] px-4 text-sm font-bold text-white shadow-[0_8px_18px_rgba(13,87,165,0.22)] outline-none transition hover:bg-[#0a4a8e] focus-visible:ring-4 focus-visible:ring-[#a6cef9] disabled:cursor-wait disabled:bg-[#477fb7]"
              >
                {isSubmitting ? (
                  <>
                    <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
                    Checking access
                  </>
                ) : (
                  <>
                    Sign in to preview
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-7 flex gap-2.5 border-t border-[#dce5f0] pt-5 text-[11px] leading-5 text-[#6d85a0]">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#2070bd]" aria-hidden="true" />
              <p>
                This is a protected product demonstration, not a live banking sign-in. No customer account access is available.
              </p>
            </div>
          </div>
        </div>

        <footer className="flex items-center justify-between border-t border-[#d8e2ef] px-5 py-3 text-[10px] font-medium text-[#7690aa] sm:px-7">
          <span>Northstar Business / Preview 02</span>
          <span className="hidden sm:inline">For directors &amp; operators</span>
        </footer>
      </section>
    </main>
  );
}