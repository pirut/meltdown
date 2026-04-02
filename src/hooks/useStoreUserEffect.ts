import { useEffect, useRef } from "react";
import { useConvexAuth, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

export function useStoreUserEffect() {
  const { isAuthenticated } = useConvexAuth();
  const storeUser = useMutation(api.users.store);
  const hasStored = useRef(false);

  useEffect(() => {
    if (!isAuthenticated) {
      hasStored.current = false;
      return;
    }
    if (hasStored.current) return;

    hasStored.current = true;
    storeUser().catch(console.error);
  }, [isAuthenticated, storeUser]);
}
