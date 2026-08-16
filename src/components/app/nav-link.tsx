"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ListTodo,
  Target,
  Settings,
  StickyNote,
} from "lucide-react";

import { cn } from "@/lib/utils";

const iconMap = {
  dashboard: LayoutDashboard,
  tasks: ListTodo,
  goals: Target,
  notes: StickyNote,
  settings: Settings,
} as const;

export type NavIconName = keyof typeof iconMap;

export function NavLink({
  href,
  label,
  iconName,
  mobile = false,
}: {
  href: string;
  label: string;
  iconName: NavIconName;
  mobile?: boolean;
}) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(`${href}/`);
  const Icon = iconMap[iconName];

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-md text-sm font-medium text-zinc-400 transition-colors hover:bg-zinc-900 hover:text-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300",
        active && "bg-zinc-900 text-emerald-200",
        mobile
          ? "min-h-14 flex-col justify-center gap-1 px-1 text-[11px]"
          : "min-h-10 px-3",
      )}
      aria-current={active ? "page" : undefined}
    >
      <Icon className={cn("shrink-0", mobile ? "h-5 w-5" : "h-4 w-4")} aria-hidden="true" />
      <span className="max-w-full truncate">{label}</span>
    </Link>
  );
}
