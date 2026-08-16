import Link from "next/link";
import type { ReactNode } from "react";

import { LogoutButton } from "@/components/app/logout-button";
import type { NavIconName } from "@/components/app/nav-link";
import { NavLink } from "@/components/app/nav-link";
import type { Profile } from "@/types/database";

const navigation: Array<{
  href: string;
  label: string;
  iconName: NavIconName;
}> = [
  {
    href: "/dashboard",
    label: "Dashboard",
    iconName: "dashboard",
  },
  {
    href: "/settings",
    label: "Settings",
    iconName: "settings",
  },
];

export function AppShell({
  children,
  profile,
}: {
  children: ReactNode;
  profile: Profile;
}) {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-zinc-800 bg-zinc-950/95 px-4 py-5 lg:block">
        <Link
          href="/dashboard"
          className="block rounded-md px-2 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
        >
          <p className="text-xl font-semibold tracking-wide text-zinc-50">MIRA</p>
          <p className="mt-1 text-xs text-zinc-500">Routine assistant foundation</p>
        </Link>
        <nav className="mt-8 space-y-1" aria-label="Primary">
          {navigation.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              label={item.label}
              iconName={item.iconName}
            />
          ))}
        </nav>
        <div className="absolute bottom-5 left-4 right-4 space-y-3">
          <div className="rounded-md border border-zinc-800 bg-zinc-900/70 p-3">
            <p className="truncate text-sm font-medium text-zinc-100">
              {profile.display_name || "Menaka"}
            </p>
            <p className="truncate text-xs text-zinc-500">{profile.email}</p>
          </div>
          <LogoutButton mode="desktop" />
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-40 border-b border-zinc-800 bg-zinc-950/90 px-4 py-3 backdrop-blur lg:hidden">
          <div className="flex items-center justify-between">
            <Link
              href="/dashboard"
              className="rounded-md text-lg font-semibold text-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
            >
              MIRA
            </Link>
            <LogoutButton mode="mobile" />
          </div>
        </header>
        <main className="mx-auto flex min-h-dvh w-full max-w-7xl flex-col px-4 py-6 pb-24 sm:px-6 lg:px-8 lg:pb-8">
          {children}
        </main>
      </div>

      <nav
        className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-2 border-t border-zinc-800 bg-zinc-950/95 px-2 py-2 backdrop-blur lg:hidden"
        aria-label="Mobile primary"
      >
        {navigation.map((item) => (
          <NavLink
            key={item.href}
            href={item.href}
            label={item.label}
            iconName={item.iconName}
            mobile
          />
        ))}
      </nav>
    </div>
  );
}
