import { Suspense } from "react";
import { getCalendarEvents } from "@/lib/actions/analytics";
import { CalendarView } from "@/components/analytics/calendar-view";
import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton";

async function CalendarContent() {
  const events = await getCalendarEvents();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Kalender Keuangan</h1>
      <CalendarView events={events} />
    </div>
  );
}

export default function CalendarPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <CalendarContent />
    </Suspense>
  );
}
