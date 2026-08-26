import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAppStore } from "@/store";

export function DemoDisclosureDialog() {
  const { demoDisclosure, closeDemoDisclosure } = useAppStore();

  return (
    <Dialog
      open={demoDisclosure !== null}
      onOpenChange={(open) => !open && closeDemoDisclosure()}
    >
      <DialogContent className="w-[calc(100vw-1.5rem)] rounded-xl sm:max-w-[440px]">
        <DialogHeader>
          <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Info className="h-5 w-5" />
          </div>
          <DialogTitle>{demoDisclosure?.title}</DialogTitle>
          <DialogDescription className="pt-1 leading-relaxed">
            {demoDisclosure?.description}
          </DialogDescription>
        </DialogHeader>
        <div
          className="rounded-lg border border-border/70 bg-muted/30 px-3 py-2.5 text-[11px] leading-relaxed text-muted-foreground"
          role="note"
        >
          No banking instruction was submitted and no external account was
          changed.
        </div>
        <DialogFooter>
          <Button onClick={closeDemoDisclosure} className="rounded-full">
            Return to dashboard
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}