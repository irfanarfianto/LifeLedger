"use client";

import { Task } from "@/lib/actions/tasks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TaskDialog } from "./task-dialog";
import { cn } from "@/lib/utils";

interface EisenhowerMatrixProps {
  tasks: Task[];
}

export function EisenhowerMatrix({ tasks }: EisenhowerMatrixProps) {
  // Filter tasks into quadrants
  const doFirst = tasks.filter(t => t.is_urgent && t.is_important && t.status !== 'completed');
  const schedule = tasks.filter(t => !t.is_urgent && t.is_important && t.status !== 'completed');
  const delegate = tasks.filter(t => t.is_urgent && !t.is_important && t.status !== 'completed');
  const eliminate = tasks.filter(t => !t.is_urgent && !t.is_important && t.status !== 'completed');

  const Quadrant = ({ title, color, items, description }: { title: string, color: string, items: Task[], description: string }) => (
    <Card className={cn("h-full flex flex-col border-l-4", color)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-bold uppercase tracking-wider flex justify-between items-center">
          {title}
          <Badge variant="secondary" className="text-xs">{items.length}</Badge>
        </CardTitle>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent className="flex-1 p-2">
        <ScrollArea className="h-[200px] pr-4">
          <div className="space-y-2">
            {items.map(task => (
              <TaskDialog 
                key={task.id} 
                task={task} 
                trigger={
                  <div className="p-2 bg-background rounded border text-sm hover:bg-accent cursor-pointer transition-colors shadow-sm">
                    <p className="font-medium line-clamp-1">{task.title}</p>
                    {task.due_date && (
                      <p className="text-[10px] text-muted-foreground mt-1">
                        {new Date(task.due_date).toLocaleDateString('id-ID')}
                      </p>
                    )}
                  </div>
                } 
              />
            ))}
            {items.length === 0 && (
              <div className="h-full flex items-center justify-center text-xs text-muted-foreground italic p-4">
                Kosong
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
      <Quadrant 
        title="Lakukan Sekarang" 
        description="Penting & Mendesak" 
        color="border-l-red-500 bg-red-50/50 dark:bg-red-950/10" 
        items={doFirst} 
      />
      <Quadrant 
        title="Jadwalkan" 
        description="Penting, Tidak Mendesak" 
        color="border-l-blue-500 bg-blue-50/50 dark:bg-blue-950/10" 
        items={schedule} 
      />
      <Quadrant 
        title="Delegasikan" 
        description="Tidak Penting, Mendesak" 
        color="border-l-yellow-500 bg-yellow-50/50 dark:bg-yellow-950/10" 
        items={delegate} 
      />
      <Quadrant 
        title="Eliminasi" 
        description="Tidak Penting, Tidak Mendesak" 
        color="border-l-green-500 bg-green-50/50 dark:bg-green-950/10" 
        items={eliminate} 
      />
    </div>
  );
}
