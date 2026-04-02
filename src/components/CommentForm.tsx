import { useState } from "react";
import { useMutation } from "convex/react";
import { useConvexAuth } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SignInButton } from "@clerk/tanstack-react-start";

const PLACEHOLDERS = [
  "Share your solidarity...",
  "Your toddler probably did this too...",
  "Tell them they're not alone...",
  "Drop your sympathy here...",
];

interface CommentFormProps {
  meltdownId: Id<"meltdowns">;
}

export function CommentForm({ meltdownId }: CommentFormProps) {
  const { isAuthenticated } = useConvexAuth();
  const [body, setBody] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createComment = useMutation(api.comments.create);

  const placeholder =
    PLACEHOLDERS[Math.floor(Math.random() * PLACEHOLDERS.length)];

  if (!isAuthenticated) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-muted/30 p-4 text-center">
        <p className="text-sm text-muted-foreground">
          <SignInButton mode="modal">
            <button type="button" className="font-medium text-[#FF6B6B] underline-offset-2 hover:underline">
              Sign in
            </button>
          </SignInButton>
          {" "}to join the commiseration.
        </p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim()) return;

    setIsSubmitting(true);
    try {
      await createComment({ meltdownId, body: body.trim() });
      setBody("");
    } catch (err) {
      console.error("Failed to post comment:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder={placeholder}
        className="min-h-[40px] flex-1 resize-none rounded-xl border-border/50 bg-[#FFF8F0] text-sm"
        maxLength={500}
        rows={1}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
          }
        }}
      />
      <Button
        type="submit"
        disabled={!body.trim() || isSubmitting}
        size="sm"
        className="shrink-0 rounded-xl bg-[#FF6B6B] text-white hover:bg-[#ff5252]"
      >
        Post
      </Button>
    </form>
  );
}
