import { useEffect, useRef } from "react";
import { useMutation } from "convex/react";
import { useConvexAuth } from "convex/react";
import { useAuth } from "@clerk/tanstack-react-start";
import { api } from "../../convex/_generated/api";

export function useStoreUserEffect() {
  const { isSignedIn, getToken } = useAuth();
  const { isAuthenticated } = useConvexAuth();
  const storeUser = useMutation(api.users.store);
  const hasStored = useRef(false);

  // Debug: log auth state so we can diagnose the token issue
  useEffect(() => {
    if (!isSignedIn) return;
    getToken({ template: "convex" }).then((token) => {
      console.log("[Meltdown Auth Debug]", {
        clerkSignedIn: isSignedIn,
        convexAuthenticated: isAuthenticated,
        hasConvexToken: !!token,
        tokenPreview: token ? token.substring(0, 40) + "..." : "NULL",
      });
    });
  }, [isSignedIn, isAuthenticated, getToken]);

  useEffect(() => {
    // Wait for Convex to actually be authenticated before storing the user
    if (!isAuthenticated) {
      hasStored.current = false;
      return;
    }
    if (hasStored.current) return;

    hasStored.current = true;
    storeUser().catch((err) => {
      console.error("Failed to store user:", err);
      hasStored.current = false;
    });
  }, [isAuthenticated, storeUser]);
}
