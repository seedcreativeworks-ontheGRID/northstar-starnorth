import { useState, type FormEvent } from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export function InstitutionalSecurity() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasInvalidCredentials, setHasInvalidCredentials] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    setHasInvalidCredentials(false);
    setIsSubmitting(true);

    window.setTimeout(() => {
      setIsSubmitting(false);
      setHasInvalidCredentials(true);
    }, 900);
  };

  return (
    <main
      className="relative flex min-h-[100dvh] overflow-hidden bg-[#e9edf2] font-sans text-[#10233c]"
      style={{
        backgroundImage:
          "radial-gradient(circle at 89% 10%, rgba(56, 108, 170, 0.14), transparent 26%), linear-gradient(120deg, #eff2f5 0%, #e5eaf0 100%)",
      }}
    >
      <div className="pointer-events-none absolute -left-24 top-14 h-72 w-72 rounded-full border border-[#2d6098]/10" />
      <div className="pointer-events-none absolute -left-9 top-28 h-44 w-44 rounded-full border border-[#2d6098]/10" />
      <div className="pointer-events-none absolute bottom-[-220px] right-[-160px] h-[540px] w-[540px] rounded-full border border-[#2d6098]/10" />

      <section className="relative flex w-full flex-col lg:flex-row">
        <aside className="flex min-h-[270px] flex-col justify-between bg-[#102b4c] px-7 py-7 text-[#eef5fd] sm:px-10 lg:min-h-[100dvh] lg:w-[43%] lg:px-14 lg:py-12 xl:px-20">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-[4px] bg-[#e7eef6] text-[#164b82] shadow-[0_6px_16px_rgba(0,0,0,0.18)]">
                <Sparkles aria-hidden="true" className="h-5 w-5 fill-current" />
              </div>
              <div className="leading-none">
                <p className="text-[18px] font-semibold tracking-[-0.04em]">northstar</p>
                <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.24em] text-[#a9c4e0]">
                  Business
                </p>
              </div>
            </div>
          </div>

          <div className="my-10 max-w-md lg:my-0">
            <div className="mb-5 flex w-fit items-center gap-2 rounded-full border border-[#9bc0e5]/25 bg-[#20466f]/70 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#bdd5ed]">
              <ShieldCheck aria-hidden="true" className="h-3.5 w-3.5" />
              Restricted access
            </div>
            <h1 className="max-w-sm text-[32px] font-medium leading-[1.08] tracking-[-0.05em] text-[#f5f9fd] sm:text-[42px] lg:text-[48px]">
              A considered place to run the business.
            </h1>
            <p className="mt-5 max-w-sm text-[14px] leading-6 text-[#b5cce3] sm:text-[15px]">
              Northstar Business is a private product demonstration for teams
              who manage the work behind every decision.
            </p>
          </div>

          <div className="hidden border-t border-[#a7c5e1]/20 pt-5 text-[11px] leading-5 text-[#a9c4df] lg:block">
            <p className="font-semibold text-[#d5e4f3]">Session privacy</p>
            <p className="mt-1 max-w-[290px]">
              This demonstration keeps activity in this browser only. No
              banking instruction or account access is available here.
            </p>
          </div>
        </aside>

        <section className="flex flex-1 items-center justify-center px-5 py-10 sm:px-10 lg:px-16">
          <div className="w-full max-w-[440px]">
            <div className="mb-5 flex items-center gap-3 text-[#4b627c] lg:hidden">
              <div className="flex h-9 w-9 items-center justify-center rounded-[4px] bg-[#164b82] text-[#f3f7fb]">
                <Sparkles aria-hidden="true" className="h-4 w-4 fill-current" />
              </div>
              <span className="text-[15px] font-semibold tracking-[-0.04em]">
                northstar <span className="font-normal">Business</span>
              </span>
            </div>

            <div className="border border-[#c8d1db] bg-[#f9fafb] p-6 shadow-[0_22px_48px_rgba(23,45,70,0.12)] sm:p-9">
              <div className="mb-8">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full border border-[#c7d4e1] bg-[#eaf1f7] text-[#1a548d]">
                  <LockKeyhole aria-hidden="true" className="h-5 w-5" />
                </div>
                <p className="text-[10px] font-bold uppercase tracking-[0.19em] text-[#426789]">
                  Protected product demonstration
                </p>
                <h2 className="mt-2 text-[27px] font-semibold tracking-[-0.045em] text-[#142b45]">
                  Sign in to continue
                </h2>
                <p className="mt-2 text-[13px] leading-5 text-[#5a6d80]">
                  Use any mock details to test the restricted access flow.
                </p>
              </div>

              <form noValidate onSubmit={handleSubmit}>
                <div className="space-y-5">
                  <div>
                    <label
                      htmlFor="institutional-username"
                      className="mb-2 block text-[12px] font-semibold text-[#243d58]"
                    >
                      Username
                    </label>
                    <input
                      id="institutional-username"
                      name="username"
                      autoComplete="username"
                      placeholder="Enter your username"
                      className="h-12 w-full rounded-[3px] border border-[#bfcbd6] bg-white px-3.5 text-[14px] text-[#132b45] outline-none transition placeholder:text-[#8291a0] focus:border-[#1d5c9e] focus:ring-4 focus:ring-[#1d5c9e]/15"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="institutional-password"
                      className="mb-2 block text-[12px] font-semibold text-[#243d58]"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <input
                        id="institutional-password"
                        name="password"
                        type={isPasswordVisible ? "text" : "password"}
                        autoComplete="current-password"
                        placeholder="Enter your password"
                        className="h-12 w-full rounded-[3px] border border-[#bfcbd6] bg-white py-0 pl-3.5 pr-12 text-[14px] text-[#132b45] outline-none transition placeholder:text-[#8291a0] focus:border-[#1d5c9e] focus:ring-4 focus:ring-[#1d5c9e]/15"
                      />
                      <button
                        type="button"
                        onClick={() => setIsPasswordVisible((visible) => !visible)}
                        className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-[#58718a] outline-none transition hover:text-[#164b82] focus-visible:ring-4 focus-visible:ring-[#1d5c9e]/20"
                        aria-label={
                          isPasswordVisible ? "Hide password" : "Show password"
                        }
                        aria-pressed={isPasswordVisible}
                      >
                        {isPasswordVisible ? (
                          <EyeOff aria-hidden="true" className="h-[18px] w-[18px]" />
                        ) : (
                          <Eye aria-hidden="true" className="h-[18px] w-[18px]" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div aria-live="polite" className="min-h-14 pt-4">
                  {hasInvalidCredentials && (
                    <div
                      role="alert"
                      className="border-l-[3px] border-[#b6494a] bg-[#faeeee] px-3 py-2.5 text-[12px] leading-5 text-[#7d363a]"
                    >
                      <span className="font-semibold">Access not granted.</span>{" "}
                      This is a demonstration, so mock credentials are not
                      accepted.
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-[3px] bg-[#155894] px-4 text-[13px] font-semibold text-white shadow-[0_8px_16px_rgba(21,88,148,0.2)] transition hover:bg-[#104b80] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#1d5c9e]/25 disabled:cursor-wait disabled:bg-[#5d82a5]"
                >
                  {isSubmitting ? (
                    <>
                      <span
                        aria-hidden="true"
                        className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
                      />
                      Checking access
                    </>
                  ) : (
                    <>
                      Sign in to demonstration
                      <ArrowRight aria-hidden="true" className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            </div>

            <p className="mx-auto mt-5 max-w-sm text-center text-[11px] leading-5 text-[#647588]">
              This is not a production banking login. It is a protected
              preview of the Northstar Business product experience.
            </p>
          </div>
        </section>
      </section>
    </main>
  );
}