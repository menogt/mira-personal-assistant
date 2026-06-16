"use client";

import { LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import { logoutAction } from "@/features/auth/actions";

export function LogoutButton({ mode }: { mode: "desktop" | "mobile" }) {
  if (mode === "mobile") {
    return (
      <form action={logoutAction}>
        <Button variant="ghost" size="icon" type="submit" aria-label="Logout">
          <LogOut className="h-5 w-5" aria-hidden="true" />
        </Button>
      </form>
    );
  }

  return (
    <form action={logoutAction}>
      <Button variant="outline" className="w-full justify-start" type="submit">
        <LogOut className="h-4 w-4" aria-hidden="true" />
        Logout
      </Button>
    </form>
  );
}
