import { useState } from "react";
import { useQuery } from "convex/react";
import { useConvexAuth } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useStoreUserEffect } from "@/hooks/useStoreUserEffect";
import { UsernamePrompt } from "./UsernamePrompt";

export function StoreUserProvider({ children }: { children: React.ReactNode }) {
  useStoreUserEffect();

  const { isAuthenticated } = useConvexAuth();
  const currentUser = useQuery(
    api.users.current,
    isAuthenticated ? {} : "skip"
  );
  const [dismissed, setDismissed] = useState(false);

  const needsUsername =
    isAuthenticated &&
    currentUser !== undefined &&
    currentUser !== null &&
    currentUser.name === "Anonymous" &&
    !dismissed;

  return (
    <>
      {children}
      <UsernamePrompt
        open={needsUsername}
        onComplete={() => setDismissed(true)}
      />
    </>
  );
}
