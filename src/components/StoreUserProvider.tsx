import { useStoreUserEffect } from "@/hooks/useStoreUserEffect";

export function StoreUserProvider({ children }: { children: React.ReactNode }) {
  useStoreUserEffect();
  return <>{children}</>;
}
