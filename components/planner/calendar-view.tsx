"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Task } from "@/lib/actions/tasks";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TaskDialog } from "./task-dialog";
import { isSameDay } from "date-fns";
import { cn } from "@/lib/utils";

interface CalendarViewProps {
  tasks: Task[];
}

export function CalendarView({ tasks }: CalendarViewProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());

  // Group tasks by date for easier lookup
  const tasksByDate = tasks.reduce((acc, task) => {
    if (!task.due_date) return acc;
    const dateStr = new Date(task.due_date).toDateString();
    if (!acc[dateStr]) acc[dateStr] = [];
    acc[dateStr].push(task);
    return acc;
  }, {} as Record<string, Task[]>);

  const selectedDateTasks = date 
    ? tasks.filter(t => t.due_date && isSameDay(new Date(t.due_date), date)) 
    : [];

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="flex-1">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border shadow p-4 w-full"
          modifiers={{
            hasTask: (date) => {
              const dateStr = date.toDateString();
              return !!tasksByDate[dateStr];
            }
          }}
          modifiersStyles={{
            hasTask: {
              fontWeight: 'bold',
              textDecoration: 'underline',
              color: 'var(--primary)'
            }
          }}
        />
      </div>
      
      <div className="flex-1">
        <h3 className="font-semibold mb-4">
          {date ? date.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : "Pilih Tanggal"}
        </h3>
        <div className="space-y-3">
          {selectedDateTasks.length === 0 ? (
            <div className="text-center p-8 border rounded-lg border-dashed text-muted-foreground">
              Tidak ada tugas pada tanggal ini.
            </div>
          ) : (
            selectedDateTasks.map(task => (
              <TaskDialog 
                key={task.id} 
                task={task} 
                trigger={
                  <Card className="cursor-pointer hover:bg-accent transition-colors">
                    <CardContent className="p-3 flex items-center justify-between">
                      <div>
                        <p className={cn("font-medium", task.status === 'completed' && "line-through text-muted-foreground")}>
                          {task.title}
                        </p>
                        <div className="flex gap-2 mt-1">
                          {task.is_urgent && <Badge variant="destructive" className="text-[10px] px-1 py-0 h-4">Urgent</Badge>}
                          {task.is_important && <Badge variant="default" className="text-[10px] px-1 py-0 h-4">Important</Badge>}
                        </div>
                      </div>
                      <div className={`w-2 h-2 rounded-full ${
                        task.priority === 'high' ? 'bg-red-500' : 
                        task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                      }`} />
                    </CardContent>
                  </Card>
                } 
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
