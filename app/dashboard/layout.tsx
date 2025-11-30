import { AppSidebar } from "@/components/app-sidebar";
import { BottomNav } from "@/components/dashboard/bottom-nav";
import { MobileHeader } from "@/components/dashboard/mobile-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { FCMInitializer } from "@/components/fcm-initializer";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <FCMInitializer />
      <AppSidebar />
      <SidebarInset>
        <MobileHeader />
        <div className="flex flex-col flex-1 p-4 md:p-6 lg:p-8 pb-20 md:pb-6 w-full">
          {children}
        </div>
      </SidebarInset>
      <BottomNav />
    </SidebarProvider>
  );
}
