import { createFileRoute } from "@tanstack/react-router"
import { MeltdownFeed } from "@/components/MeltdownFeed"
import TextLoop from "@/components/text-loop"

export const Route = createFileRoute("/")({ component: HomePage })

function HomePage() {
  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="flex flex-col items-center text-center">
        <h1
          className="text-3xl font-bold tracking-tight text-[#2D3436] sm:text-4xl"
          style={{ fontFamily: "Fredoka, sans-serif" }}
        >
          <TextLoop
            staticText="Today my"
            rotatingTexts={["toddler", "baby", "kid"]}
            interval={2500}
            className="inline-flex justify-center text-3xl font-bold tracking-tight sm:text-4xl"
            staticTextClassName="mr-2 text-[#2D3436]"
            rotatingTextClassName="bg-gradient-to-r from-[#E8735A] to-[#d4654e] pr-1"
            backgroundClassName="bg-gradient-to-r from-transparent via-[#E8735A]/10 to-[#E8735A]/20"
            cursorClassName="bg-[#E8735A]"
          />
          <span className="mt-1 block">had a meltdown because...</span>
        </h1>
        <p className="mt-2 text-muted-foreground">
          The funniest parenting moments, shared.
        </p>
      </div>

      <MeltdownFeed />
    </div>
  )
}
