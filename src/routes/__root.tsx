import { HeadContent, Outlet, Scripts, createRootRoute } from "@tanstack/react-router";
import { ClerkProvider, useAuth } from "@clerk/tanstack-react-start";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/components/Navbar";
import { StoreUserProvider } from "@/components/StoreUserProvider";
import { convexClient, queryClient } from "@/router";

import appCss from "../styles.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Meltdown - Share Your Toddler's Funniest Meltdowns" },
      {
        name: "description",
        content:
          "A community for parents to share and laugh about their toddler's most hilarious meltdowns.",
      },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "stylesheet", href: appCss },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&display=swap",
      },
    ],
  }),
  component: RootComponent,
  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="min-h-screen bg-[#FFF8F0] font-sans text-[#2D3436] antialiased">
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <ClerkProvider>
      <ConvexProviderWithClerk client={convexClient} useAuth={useAuth}>
        <QueryClientProvider client={queryClient}>
          <StoreUserProvider>
            <div className="min-h-screen">
              <Navbar />
              <main className="mx-auto max-w-2xl px-4 py-6">
                <Outlet />
              </main>
            </div>
            <Toaster />
          </StoreUserProvider>
        </QueryClientProvider>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
