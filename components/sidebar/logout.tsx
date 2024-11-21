"use client";

import { ClerkProvider, SignOutButton } from "@clerk/nextjs";
import { LogOut } from "lucide-react";
import React from "react";

export function LogOutButton() {
  return (
    <ClerkProvider>
      <SignUpContent />
    </ClerkProvider>
  );
}

function SignUpContent() {
  return <SignOutButton></SignOutButton>;
}
