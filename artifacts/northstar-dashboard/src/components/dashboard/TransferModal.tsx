import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppStore } from "@/store";
import { useToast } from "@/hooks/use-toast";

const transferSchema = z.object({
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) > 0,
      "Must be a positive number",
    )
    .refine(
      (val) => Number(val) <= 190939.9,
      "Cannot exceed available balance (190,939.90 CAD)",
    ),
});

type TransferFormValues = z.infer<typeof transferSchema>;

export function TransferModal() {
  const {
    isTransferModalOpen,
    setTransferModalOpen,
    submitTransfer,
    dismissPayrollAlert,
    setSelectedAccountFilter,
    isPersistedDataLoading,
  } = useAppStore();
  const { toast } = useToast();

  const form = useForm<TransferFormValues>({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      amount: "129493",
    },
  });

  const onSubmit = async (data: TransferFormValues) => {
    const amount = Number(data.amount);
    form.clearErrors("root");

    try {
      await submitTransfer(amount);
      setSelectedAccountFilter("Northstar Chequing Business #1");
      toast({
        title: "Transfer successful",
        description: `Successfully transferred $${amount.toLocaleString(undefined, { minimumFractionDigits: 2 })} CAD.`,
      });
      dismissPayrollAlert();
      setTransferModalOpen(false);
      form.reset();
    } catch {
      form.setError("root.server", {
        message:
          "We couldn't save this transfer. Your amount is still here so you can try again.",
      });
    }
  };

  return (
    <Dialog open={isTransferModalOpen} onOpenChange={setTransferModalOpen}>
      <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden border-border/80 shadow-lg rounded-xl">
        <DialogTitle className="sr-only">Transfer Funds</DialogTitle>
        <div className="p-6">
          <h2 className="text-lg font-semibold text-foreground mb-1">
            Top up your operating balance
          </h2>
          <p className="text-xs text-muted-foreground mb-6">
            Move available funds from Investments Overview into Deposit Accounts
            Overview
          </p>

          <div className="bg-muted/30 rounded-md p-4 mb-4 space-y-3 text-[13px]">
            <div className="grid grid-cols-[100px_1fr] items-center">
              <span className="text-muted-foreground">From</span>
              <span className="font-medium text-foreground flex justify-end">
                Investments Overview
              </span>
            </div>
            <div className="grid grid-cols-[100px_1fr] items-center">
              <span className="text-muted-foreground">To</span>
              <span className="font-medium text-foreground flex justify-end">
                Deposit Accounts Overview
              </span>
            </div>
            <div className="grid grid-cols-[100px_1fr] items-center">
              <span className="text-muted-foreground">Currency</span>
              <span className="font-medium text-foreground flex justify-end">
                CAD - Canadian Dollar
              </span>
            </div>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label
                htmlFor="transfer-amount"
                className="text-[11px] text-muted-foreground block mb-1.5"
              >
                Amount
              </label>
              <Input
                id="transfer-amount"
                {...form.register("amount")}
                className={`h-9 text-sm ${form.formState.errors.amount ? "border-destructive focus-visible:ring-destructive" : ""}`}
                aria-invalid={!!form.formState.errors.amount}
              />
              {form.formState.errors.amount ? (
                <p className="text-[10px] text-destructive mt-2" role="alert">
                  {form.formState.errors.amount.message}
                </p>
              ) : (
                <p className="text-[10px] text-muted-foreground mt-2">
                  Available to move: 190,939.90 CAD
                </p>
              )}
              {form.formState.errors.root?.server && (
                <p className="text-[11px] text-destructive mt-3" role="alert">
                  {form.formState.errors.root.server.message}
                </p>
              )}
              {isPersistedDataLoading && (
                <p
                  className="text-[10px] text-muted-foreground mt-3"
                  role="status"
                >
                  Loading saved dashboard activity…
                </p>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="ghost"
                className="text-[13px] text-primary hover:text-primary/80 hover:bg-transparent"
                onClick={() => setTransferModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={form.formState.isSubmitting || isPersistedDataLoading}
                className="bg-primary hover:bg-primary/90 text-primary-foreground text-[13px] rounded-full px-6 h-9"
              >
                {form.formState.isSubmitting ? "Saving…" : "Transfer now"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
