"use client";

import { createUser } from "@/lib/user/userManager";
import { ClerkProvider, SignUp, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation"; // For App Router
import React, { useEffect } from "react";

export function SignUpForm() {
  return (
    <ClerkProvider>
      <SignUpContent />
    </ClerkProvider>
  );
}

function SignUpContent() {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      createUser();
      router.push("/note");
    }
  }, [user, router]);

  if (!user) {
    return <SignUp routing="hash" />;
  }

  return null;
}
