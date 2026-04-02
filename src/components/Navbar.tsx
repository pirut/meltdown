import { Link } from "@tanstack/react-router";
import {
  SignInButton,
  SignUpButton,
  UserButton,
  useAuth,
} from "@clerk/tanstack-react-start";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const { isSignedIn, isLoaded } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-orange-200/60 bg-white backdrop-blur-md pt-[env(safe-area-inset-top)]">
      <div className="mx-auto flex h-14 max-w-2xl items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-1.5">
          <span
            className="text-xl font-bold tracking-tight text-[#FF6B6B]"
            style={{ fontFamily: "Fredoka, sans-serif" }}
          >
            MELTD
            <span className="inline-block -rotate-12">😭</span>
            WN
          </span>
        </Link>

        {/* Right side — fade in once Clerk loads */}
        <div
          className={`flex items-center gap-2 transition-opacity duration-300 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
        >
          {isSignedIn ? (
            <>
              <Button
                asChild
                size="sm"
                className="rounded-full bg-[#FF6B6B] text-white hover:bg-[#ff5252]"
              >
                <Link to="/create">Post a Meltdown 😭</Link>
              </Button>
              <UserButton />
            </>
          ) : (
            <>
              <SignInButton mode="modal">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button
                  size="sm"
                  className="rounded-full bg-[#FF6B6B] text-white hover:bg-[#ff5252]"
                >
                  Sign Up
                </Button>
              </SignUpButton>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
