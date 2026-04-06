import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface UsernamePromptProps {
  open: boolean;
  onComplete: () => void;
}

export function UsernamePrompt({ open, onComplete }: UsernamePromptProps) {
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const updateName = useMutation(api.users.updateName);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      await updateName({ name: name.trim() });
      toast.success("Welcome to Meltdown! 😭");
      onComplete();
    } catch (err) {
      toast.error("Couldn't set your name", {
        description:
          err instanceof Error ? err.message : "Try again in a moment",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent
        className="sm:max-w-md"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle
            className="text-center text-xl"
            style={{ fontFamily: "Fredoka, sans-serif" }}
          >
            Welcome to Meltdown! 😭
          </DialogTitle>
          <DialogDescription className="text-center">
            Pick a username so other parents know who's sharing the chaos.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name or nickname"
              maxLength={50}
              autoFocus
              className="w-full rounded-xl border border-border/50 bg-[#FFF8F0] px-4 py-3 text-base outline-none placeholder:text-muted-foreground/50 focus:border-[#FF6B6B]/40 focus:ring-2 focus:ring-[#FF6B6B]/20"
            />
            <p className="mt-1.5 text-xs text-muted-foreground">
              This is how you'll appear on your posts and comments.
            </p>
          </div>

          <Button
            type="submit"
            disabled={!name.trim() || isSubmitting}
            className="w-full rounded-full bg-[#FF6B6B] py-5 text-base font-semibold text-white hover:bg-[#ff5252] disabled:opacity-50"
            style={{ fontFamily: "Fredoka, sans-serif" }}
          >
            {isSubmitting ? "Setting up..." : "Let's Go! 🎉"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
