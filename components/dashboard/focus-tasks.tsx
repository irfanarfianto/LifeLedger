"use client";

import { Task, updateTaskStatus } from "@/lib/actions/tasks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { CheckCircle2, Circle, Target, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface FocusTasksProps {
  initialTasks: Task[];
}

export function FocusTasks({ initialTasks }: FocusTasksProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const router = useRouter();

  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  const handleToggle = async (taskId: string) => {
    const isCompleted = completedIds.has(taskId);
    const newStatus = isCompleted ? "pending" : "completed";

    // Optimistic update
    const newCompletedIds = new Set(completedIds);
    if (isCompleted) {
      newCompletedIds.delete(taskId);
    } else {
      newCompletedIds.add(taskId);
    }
    setCompletedIds(newCompletedIds);

    // Check if all tasks are completed
    if (!isCompleted && newCompletedIds.size === tasks.length && tasks.length > 0) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }

    try {
      await updateTaskStatus(taskId, newStatus);
      router.refresh(); // Refresh to sync server state eventually
    } catch (error) {
      console.error("Failed to update task", error);
      // Revert optimistic update
      if (isCompleted) {
        newCompletedIds.add(taskId);
      } else {
        newCompletedIds.delete(taskId);
      }
      setCompletedIds(new Set(newCompletedIds));
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          Fokus Hari Ini
        </CardTitle>
      </CardHeader>
      <CardContent>
        {tasks.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>Tidak ada tugas prioritas tinggi.</p>
            <p className="text-sm">Waktunya bersantai atau rencanakan hari esok! 🌟</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => {
              const isCompleted = completedIds.has(task.id);
              return (
                <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg bg-card/50 hover:bg-accent/50 transition-colors">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className={cn(
                      "p-2 rounded-full shrink-0",
                      task.priority === "high" ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400" :
                      task.priority === "medium" ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400" :
                      "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                    )}>
                      <Target className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className={cn(
                        "font-medium truncate",
                        isCompleted && "line-through text-muted-foreground"
                      )}>
                        {task.title}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1 shrink-0">
                          <Clock className="h-3 w-3" />
                          {task.due_date ? new Date(task.due_date).toLocaleDateString("id-ID", { day: 'numeric', month: 'short' }) : "Tanpa tenggat"}
                        </span>
                        {task.is_urgent && (
                          <span className="bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300 px-1.5 py-0.5 rounded text-[10px] font-semibold shrink-0">
                            Mendesak
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className={cn(
                      "shrink-0 ml-2",
                      isCompleted ? "text-green-600 hover:text-green-700" : "text-muted-foreground hover:text-primary"
                    )}
                    onClick={() => handleToggle(task.id)}
                  >
                    {isCompleted ? <CheckCircle2 className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
