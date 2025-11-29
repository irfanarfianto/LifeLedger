import { Suspense } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarView } from "@/components/planner/calendar-view";
import { EisenhowerMatrix } from "@/components/planner/eisenhower-matrix";
import { BrainDump } from "@/components/planner/brain-dump";
import { HabitTracker } from "@/components/planner/habit-tracker";
import { getTasks, getHabits, getHabitLogs } from "@/lib/actions/tasks";
import { TaskDialog } from "@/components/planner/task-dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

async function PlannerContent() {
  const today = new Date().toISOString().split('T')[0];
  const [tasks, habits, todayLogs] = await Promise.all([
    getTasks(),
    getHabits(),
    getHabitLogs(today),
  ]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3 space-y-6">
        <Tabs defaultValue="calendar" className="w-full">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <div className="w-full overflow-x-auto pb-2 sm:pb-0 sm:w-auto">
              <TabsList className="w-full justify-start inline-flex min-w-max">
                <TabsTrigger value="calendar">Kalender</TabsTrigger>
                <TabsTrigger value="matrix">Eisenhower Matrix</TabsTrigger>
              </TabsList>
            </div>
            <TaskDialog trigger={
              <Button size="sm" className="w-full sm:w-auto">
                <Plus className="mr-2 h-4 w-4" /> Tugas Baru
              </Button>
            } />
          </div>
          
          <TabsContent value="calendar" className="mt-0">
            <CalendarView tasks={tasks} />
          </TabsContent>
          
          <TabsContent value="matrix" className="mt-0 h-[600px]">
            <EisenhowerMatrix tasks={tasks} />
          </TabsContent>
        </Tabs>
      </div>

      <div className="space-y-6">
        <BrainDump />
        <HabitTracker habits={habits} logs={todayLogs} />
      </div>
    </div>
  );
}

import { PlannerSkeleton } from "@/components/planner/planner-skeleton";

export default function TasksPage() {
  return (
    <div className="flex flex-col gap-4 pb-20">
      <h1 className="text-2xl font-bold">Perencana (Planner)</h1>
      <Suspense fallback={<PlannerSkeleton />}>
        <PlannerContent />
      </Suspense>
    </div>
  );
}
