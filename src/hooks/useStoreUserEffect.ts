import { useEffect, useRef } from "react";
import { useMutation } from "convex/react";
import { useAuth } from "@clerk/tanstack-react-start";
import { api } from "../../convex/_generated/api";

export function useStoreUserEffect() {
  const { isSignedIn } = useAuth();
  const storeUser = useMutation(api.users.store);
  const hasStored = useRef(false);

  useEffect(() => {
    if (!isSignedIn) {
      hasStored.current = false;
      return;
    }
    if (hasStored.current) return;

    hasStored.current = true;
    // Small delay to ensure Convex has received the auth token from Clerk
    const timer = setTimeout(() => {
      storeUser().catch((err) => {
        console.error("Failed to store user:", err);
        hasStored.current = false;
      });
    }, 500);
    return () => clearTimeout(timer);
  }, [isSignedIn, storeUser]);
}
