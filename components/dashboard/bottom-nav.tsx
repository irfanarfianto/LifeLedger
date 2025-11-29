"use client";

import {
  Calendar,
  LayoutDashboard,
  Settings,
  Wallet,
  CheckSquare,
  Menu,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Keuangan",
    url: "/dashboard/finance",
    icon: Wallet,
  },
  {
    title: "Tugas",
    url: "/dashboard/tasks",
    icon: CheckSquare,
  },
  
  {
    title: "Pengaturan",
    url: "/dashboard/settings",
    icon: Settings,
  },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t bg-background px-4 pb-safe md:hidden">
      {items.map((item) => {
        const isActive = pathname === item.url;
        return (
          <Link
            key={item.title}
            href={item.url}
            className={cn(
              "flex flex-col items-center justify-center gap-1 text-xs font-medium transition-colors",
              isActive
                ? "text-primary"
                : "text-muted-foreground hover:text-primary"
            )}
          >
            <item.icon className={cn("h-5 w-5", isActive && "fill-current")} />
            <span>{item.title}</span>
          </Link>
        );
      })}
    </div>
  );
}
