"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  CheckCircle2,
  ClipboardList,
  LayoutDashboard,
  Send,
  Settings2,
} from "lucide-react";

import { cn } from "@/lib/utils";

const items = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/contents", label: "Contents", icon: ClipboardList },
  { href: "/approvals", label: "Approvals", icon: CheckCircle2 },
  { href: "/publishing", label: "Publishing", icon: Send },
  { href: "/metrics", label: "Metrics", icon: BarChart3 },
  { href: "/settings/generation", label: "Settings", icon: Settings2 },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="grid gap-2">
      {items.map((item) => {
        const active = pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition",
              active
                ? "bg-primary text-primary-foreground shadow-soft"
                : "text-muted-foreground hover:bg-white hover:text-foreground",
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

