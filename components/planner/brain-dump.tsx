"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createTask } from "@/lib/actions/tasks";
import { toast } from "sonner";
import { ArrowRight, Loader2, BrainCircuit } from "lucide-react";

export function BrainDump() {
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleConvert = async () => {
    if (!content.trim()) return;
    setIsLoading(true);

    try {
      // Split by newlines to create multiple tasks or just one big task
      // For simplicity, let's create one task per non-empty line
      const lines = content.split('\n').filter(line => line.trim());
      
      for (const line of lines) {
        const formData = new FormData();
        formData.append("title", line);
        formData.append("priority", "medium"); // Default
        await createTask(formData);
      }

      toast.success(`${lines.length} tugas berhasil dibuat dari Brain Dump!`);
      setContent("");
    } catch (error) {
      toast.error("Gagal mengonversi Brain Dump");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <BrainCircuit className="h-4 w-4" />
          Brain Dump
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Textarea 
          placeholder="Tulis apa saja yang ada di pikiranmu... (Satu baris = Satu tugas)" 
          className="min-h-[150px] resize-none"
          value={content}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)}
        />
        <Button 
          className="w-full" 
          size="sm" 
          onClick={handleConvert} 
          disabled={isLoading || !content.trim()}
        >
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ArrowRight className="mr-2 h-4 w-4" />}
          Konversi ke Tugas
        </Button>
      </CardContent>
    </Card>
  );
}
