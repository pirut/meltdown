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
    <header className="sticky top-0 z-50 border-b border-[#E8735A]/15 bg-white backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-2xl items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-1.5">
          <span
            className="text-xl font-bold tracking-tight text-[#2D3436]"
            style={{ fontFamily: "Fredoka, sans-serif" }}
          >
            meltdown
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
                className="rounded-full bg-[#E8735A] text-white hover:bg-[#d4654e]"
              >
                <Link to="/create">Post a Meltdown 🫠</Link>
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
                  className="rounded-full bg-[#E8735A] text-white hover:bg-[#d4654e]"
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
