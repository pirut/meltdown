import { HeadContent, Outlet, Scripts, createRootRoute } from "@tanstack/react-router";
import { ClerkProvider, useAuth } from "@clerk/tanstack-react-start";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/components/Navbar";
import { StoreUserProvider } from "@/components/StoreUserProvider";
import { convexClient, queryClient } from "@/router";
import { Analytics } from "@vercel/analytics/react";

import appCss from "../styles.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "default" },
      { name: "apple-mobile-web-app-title", content: "Meltdown" },
      { name: "theme-color", content: "#ffffff" },
      { title: "Meltdown - Share Your Toddler's Funniest Meltdowns" },
      {
        name: "description",
        content:
          "A community for parents to share and laugh about their toddler's most hilarious meltdowns. Today my toddler had a meltdown because...",
      },
      // OpenGraph
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://meltdown.jrbussard.com" },
      {
        property: "og:title",
        content: "Meltdown - Today My Toddler Had a Meltdown Because...",
      },
      {
        property: "og:description",
        content:
          "Share & laugh about your kid's funniest tantrums. A community for parents who've been there. 😭🤣",
      },
      {
        property: "og:image",
        content: "https://meltdown.jrbussard.com/og-image.png",
      },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "Meltdown - Today my toddler had a meltdown because..." },
      { property: "og:site_name", content: "Meltdown" },
      // Twitter Card
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "twitter:title",
        content: "Meltdown - Today My Toddler Had a Meltdown Because...",
      },
      {
        name: "twitter:description",
        content:
          "Share & laugh about your kid's funniest tantrums. A community for parents who've been there. 😭🤣",
      },
      {
        name: "twitter:image",
        content: "https://meltdown.jrbussard.com/og-image.png",
      },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.svg" },
      { rel: "manifest", href: "/manifest.json" },
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
        <Analytics />
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
              <main className="mx-auto max-w-2xl px-4 py-6 animate-in fade-in duration-300">
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
