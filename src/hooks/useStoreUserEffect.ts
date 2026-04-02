import { useEffect, useRef } from "react";
import { useMutation } from "convex/react";
import { useConvexAuth } from "convex/react";
import { useAuth } from "@clerk/tanstack-react-start";
import { api } from "../../convex/_generated/api";

function decodeJwtPayload(token: string) {
  try {
    const base64 = token.split(".")[1];
    const json = atob(base64.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function useStoreUserEffect() {
  const { isSignedIn, getToken } = useAuth();
  const { isAuthenticated } = useConvexAuth();
  const storeUser = useMutation(api.users.store);
  const hasStored = useRef(false);

  // Debug: decode the JWT to see issuer and audience
  useEffect(() => {
    if (!isSignedIn) return;
    getToken({ template: "convex" }).then((token) => {
      const payload = token ? decodeJwtPayload(token) : null;
      console.log("[Meltdown Auth Debug]", {
        clerkSignedIn: isSignedIn,
        convexAuthenticated: isAuthenticated,
        hasConvexToken: !!token,
        jwtIssuer: payload?.iss ?? "N/A",
        jwtAudience: payload?.aud ?? "N/A",
        jwtSubject: payload?.sub ?? "N/A",
      });
    });
  }, [isSignedIn, isAuthenticated, getToken]);

  useEffect(() => {
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
