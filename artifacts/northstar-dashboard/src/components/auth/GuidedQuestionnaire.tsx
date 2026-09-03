import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowLeft, Check, LoaderCircle, LayoutDashboard } from "lucide-react";
import { authenticatedFetch } from "@/auth-events";

const QUESTIONS = [
  {
    id: "role",
    title: "What is your primary role?",
    description: "This helps us tailor your insights and metric priorities.",
    options: [
      { id: "accountant", label: "Accountant", desc: "Day-to-day records, reconciliation, and reporting." },
      { id: "controller", label: "Controller", desc: "Financial controls, close, and team oversight." },
      { id: "finance_leader", label: "Finance leader", desc: "Planning, liquidity, and financial direction." },
      { id: "executive", label: "CFO or executive approver", desc: "Organization-wide decisions and final accountability." },
    ]
  },
  {
    id: "responsibility",
    title: "What is your area of responsibility?",
    description: "We'll highlight alerts that need your direct attention.",
    options: [
      { id: "close_reporting", label: "Close and reporting", desc: "Prepare accurate period-end results." },
      { id: "reconciliation", label: "Reconciliation", desc: "Keep accounts and transaction activity aligned." },
      { id: "liquidity", label: "Liquidity and planning", desc: "Guide cash position and working capital." },
      { id: "risk_oversight", label: "Risk and oversight", desc: "Monitor exposure and organization-wide controls." },
    ]
  },
  {
    id: "authority",
    title: "What is your approval authority?",
    description: "This customizes the clearance workflows shown in your dashboard.",
    options: [
      { id: "prepare", label: "I prepare the work", desc: "Build the analysis and supporting records." },
      { id: "recommend", label: "I make recommendations", desc: "Advise decision-makers on the best path." },
      { id: "approve", label: "I approve within a mandate", desc: "Authorize decisions within defined limits." },
      { id: "final_authority", label: "I provide final approval", desc: "Own the final organization-wide decision." },
    ]
  },
  {
    id: "priority",
    title: "What is your first dashboard priority?",
    description: "We'll configure your default view to start exactly where you need it.",
    options: [
      { id: "reconcile_activity", label: "Reconcile activity", desc: "Confirm transactions and balances are accurate." },
      { id: "investigate_variances", label: "Investigate variances", desc: "Understand what changed and prepare reporting." },
      { id: "review_approvals", label: "Review approvals", desc: "Clear priority decisions and manage risk." },
      { id: "strategic_outlook", label: "Monitor the strategic outlook", desc: "Assess liquidity, exposure, and future direction." },
    ]
  }
];

export function GuidedQuestionnaire({ onCompleted }: { onCompleted: (profile: "ben" | "james") => void }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const reduceMotion = useReducedMotion();

  const currentQuestion = QUESTIONS[step];
  const hasAnswer = !!answers[currentQuestion.id];

  const handleSelect = (id: string) => {
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: id }));
  };

  const handleNext = async () => {
    if (!hasAnswer || isSubmitting) return;

    if (step < QUESTIONS.length - 1) {
      setStep(s => s + 1);
    } else {
      setIsSubmitting(true);
      setError("");
      try {
        const res = await authenticatedFetch("/api/auth/profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answers })
        });
        if (!res.ok) throw new Error("Profile submission failed");
        const data = await res.json() as { profile?: "ben" | "james" };
        if (data.profile !== "ben" && data.profile !== "james") throw new Error("Invalid profile");
        onCompleted(data.profile);
      } catch (e) {
        setError("Unable to save profile configuration. Please try again.");
        setIsSubmitting(false);
      }
    }
  };

  const handleBack = () => {
    if (step > 0 && !isSubmitting) setStep(s => s - 1);
  };

  const isLastStep = step === QUESTIONS.length - 1;

  return (
    <div className="w-full max-w-2xl mx-auto rounded-[1.75rem] border border-white/20 bg-[#eff7fb]/[.97] p-6 text-[#102a43] shadow-[0_28px_70px_rgba(1,13,26,.38)] sm:p-10 backdrop-blur-xl">
      <div className="mb-8 flex items-center gap-2">
        {QUESTIONS.map((_, i) => (
          <div key={i} className="h-1 flex-1 overflow-hidden rounded-full bg-[#d7eefb]">
            <motion.div
              className="h-full bg-[#1275b7]"
              initial={{ width: i < step ? "100%" : "0%" }}
              animate={{ width: i < step ? "100%" : i === step ? "100%" : "0%" }}
              transition={{ duration: reduceMotion ? 0 : 0.5, ease: "easeInOut" }}
            />
          </div>
        ))}
      </div>

      <div className="min-h-[340px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={reduceMotion ? false : { opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: reduceMotion ? 0 : 0.3, ease: "easeOut" }}
            className="flex h-full flex-col"
          >
            <div className="mb-6">
              <h2 className="text-2xl font-semibold tracking-[-0.03em] text-[#102a43] sm:text-3xl">
                {currentQuestion.title}
              </h2>
              <p className="mt-2 text-sm text-[#41647b]">
                {currentQuestion.description}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label={currentQuestion.title}>
              {currentQuestion.options.map((opt) => {
                const isSelected = answers[currentQuestion.id] === opt.id;
                return (
                  <label
                    key={opt.id}
                    className={`group relative flex cursor-pointer flex-col gap-1 rounded-xl border p-4 transition-all has-[:focus-visible]:outline-none has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-[#258bd0]/20 ${
                      isSelected
                        ? "border-[#187fc2] bg-white ring-1 ring-[#187fc2] shadow-sm"
                        : "border-[#b6cfdf] bg-white/60 hover:border-[#187fc2] hover:bg-white"
                    }`}
                  >
                    <input
                      type="radio"
                      name={currentQuestion.id}
                      value={opt.id}
                      checked={isSelected}
                      onChange={() => handleSelect(opt.id)}
                      className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
                    />
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-bold ${isSelected ? "text-[#102a43]" : "text-[#244760]"}`}>
                        {opt.label}
                      </span>
                      <div className={`grid h-5 w-5 place-items-center rounded-full border transition-colors ${
                        isSelected ? "border-[#187fc2] bg-[#187fc2]" : "border-[#b6cfdf] bg-white"
                      }`}>
                        {isSelected && <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />}
                      </div>
                    </div>
                    <span className="text-xs leading-relaxed text-[#53748a]">{opt.desc}</span>
                  </label>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-8 flex items-center justify-between border-t border-[#b8d8ea]/50 pt-6">
        <button
          type="button"
          onClick={handleBack}
          disabled={step === 0 || isSubmitting}
          className={`flex items-center gap-2 text-sm font-bold transition-colors ${
            step === 0
              ? "pointer-events-none text-transparent"
              : "text-[#53748a] hover:text-[#102a43] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#187fc2] rounded-lg px-2 py-1 -ml-2"
          }`}
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        <button
          type="button"
          onClick={handleNext}
          disabled={!hasAnswer || isSubmitting}
          className="flex h-11 items-center justify-center gap-2 rounded-xl bg-[#1275b7] px-6 text-sm font-bold text-white shadow-[0_10px_20px_rgba(18,117,183,.24)] transition hover:bg-[#0d669f] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#187fc2]/35 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? (
            <>
              <LoaderCircle className="h-4 w-4 animate-spin motion-reduce:animate-none" /> Preparing workspace
            </>
          ) : isLastStep ? (
            <>
              Enter workspace <LayoutDashboard className="h-4 w-4" />
            </>
          ) : (
            <>
              Continue <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </div>
      
      <div aria-live="polite" aria-atomic="true">
        {error && (
          <p className="mt-4 rounded-lg border border-[#e7babc] bg-[#fff0f0] px-3 py-2.5 text-xs leading-5 text-[#9c333b]">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}