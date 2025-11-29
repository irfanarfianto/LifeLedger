"use client";

import { Habit, HabitLog, createHabit, toggleHabit } from "@/lib/actions/tasks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { Plus, Check } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface HabitTrackerProps {
  habits: Habit[];
  logs: HabitLog[]; // Logs for today
}

export function HabitTracker({ habits, logs }: HabitTrackerProps) {
  const [newHabit, setNewHabit] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async () => {
    if (!newHabit.trim()) return;
    setIsCreating(true);
    try {
      const formData = new FormData();
      formData.append("title", newHabit);
      await createHabit(formData);
      setNewHabit("");
      toast.success("Kebiasaan baru ditambahkan");
    } catch (error) {
      toast.error("Gagal menambahkan kebiasaan");
    } finally {
      setIsCreating(false);
    }
  };

  const handleToggle = async (habitId: string) => {
    const today = new Date().toISOString().split('T')[0];
    try {
      await toggleHabit(habitId, today);
    } catch (error) {
      toast.error("Gagal memperbarui kebiasaan");
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center justify-between">
          <span>Habit Tracker (Hari Ini)</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {habits.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-2">Belum ada kebiasaan.</p>
          ) : (
            habits.map(habit => {
              const isCompleted = logs.some(log => log.habit_id === habit.id);
              return (
                <div key={habit.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={habit.id} 
                    checked={isCompleted}
                    onCheckedChange={() => handleToggle(habit.id)}
                  />
                  <label
                    htmlFor={habit.id}
                    className={cn(
                      "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer",
                      isCompleted && "line-through text-muted-foreground"
                    )}
                  >
                    {habit.title}
                  </label>
                </div>
              );
            })
          )}
        </div>

        <div className="flex gap-2">
          <Input 
            placeholder="Kebiasaan baru..." 
            className="h-8 text-xs" 
            value={newHabit}
            onChange={(e) => setNewHabit(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
          />
          <Button size="sm" className="h-8 w-8 p-0" onClick={handleCreate} disabled={isCreating}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
