/** @format */

import { ClerkProvider } from "@clerk/clerk-react";

const PUBLISHABLE_KEY =
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY ||
  "pk_test_YOUR_CLERK_PUBLISHABLE_KEY";

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

export function ClerkAuthProvider({ children }) {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>{children}</ClerkProvider>
  );
}
