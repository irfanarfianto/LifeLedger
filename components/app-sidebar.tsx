"use client";

import {
  Calendar,
  LayoutDashboard,
  Settings,
  Wallet,
  CheckSquare,
  PieChart,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

// Menu items.
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
    title: "Analitik",
    url: "/dashboard/analytics",
    icon: PieChart,
  },
  {
    title: "Pengaturan",
    url: "/dashboard/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader className="h-14 flex items-center justify-center border-b px-4 lg:h-[60px] lg:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold w-full">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60 text-xl">
            LifeLedger
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    tooltip={item.title}
                  >
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
       <p className="text-xs text-muted-foreground">
         &copy; 2025 LifeLedger. All rights reserved.
       </p>
      </SidebarFooter>
    </Sidebar>
  );
}
