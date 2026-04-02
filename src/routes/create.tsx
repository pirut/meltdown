import { createFileRoute } from "@tanstack/react-router";
import { CreateMeltdownForm } from "@/components/CreateMeltdownForm";

export const Route = createFileRoute("/create")({
  component: CreatePage,
});

function CreatePage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1
          className="text-2xl font-bold tracking-tight text-[#2D3436]"
          style={{ fontFamily: "Fredoka, sans-serif" }}
        >
          Share a Meltdown 😭
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Tell us about your child's latest masterpiece of drama.
        </p>
      </div>

      <CreateMeltdownForm />
    </div>
  );
}
