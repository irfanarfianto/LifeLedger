"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, Timer, Settings, Coffee } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import confetti from "canvas-confetti";

export function PomodoroWidget() {
  const [defaultTime, setDefaultTime] = useState(25 * 60);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [customMinutes, setCustomMinutes] = useState(25);
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      
      // Celebration effects
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
      
      // Show completion dialog
      setShowCompletionDialog(true);
      
      // Browser notification (if permission granted)
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification("🍅 Pomodoro Selesai!", {
          body: "Waktu fokus Anda telah selesai. Saatnya istirahat!",
          icon: "/icon.png",
        });
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const toggleTimer = () => {
    // Request notification permission on first start
    if (!isActive && "Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
    setIsActive(!isActive);
  };
  
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(defaultTime);
  };

  const setPresetTime = (minutes: number) => {
    setDefaultTime(minutes * 60);
    setTimeLeft(minutes * 60);
    setIsActive(false);
    setShowSettings(false);
  };

  const setCustomTime = () => {
    if (customMinutes > 0 && customMinutes <= 120) {
      setPresetTime(customMinutes);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (isMinimized) {
    return (
      <Button
        className="fixed bottom-20 right-4 md:bottom-4 z-50 rounded-full h-12 w-12 shadow-lg"
        onClick={() => setIsMinimized(false)}
      >
        <Timer className="h-6 w-6" />
      </Button>
    );
  }

  const pomodoroCard = (
    <Card className="fixed bottom-20 right-4 md:bottom-4 z-50 w-64 shadow-xl border-primary/20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <Timer className="h-4 w-4" /> Pomodoro
          </h3>
          <div className="flex gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6" 
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsMinimized(true)}>
              <span className="sr-only">Minimize</span>
              <span className="text-xs">_</span>
            </Button>
          </div>
        </div>

        {showSettings ? (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setPresetTime(15)}
                className="text-xs"
              >
                15m
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setPresetTime(25)}
                className="text-xs"
              >
                25m
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setPresetTime(45)}
                className="text-xs"
              >
                45m
              </Button>
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Custom (menit)</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  min="1"
                  max="120"
                  value={customMinutes}
                  onChange={(e) => setCustomMinutes(parseInt(e.target.value) || 0)}
                  className="h-8 text-sm"
                  placeholder="25"
                />
                <Button 
                  size="sm" 
                  onClick={setCustomTime}
                  className="h-8"
                >
                  Set
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="text-4xl font-bold text-center mb-4 font-mono tracking-wider">
              {formatTime(timeLeft)}
            </div>
            <div className="flex justify-center gap-2">
              <Button
                variant={isActive ? "secondary" : "default"}
                size="sm"
                onClick={toggleTimer}
                className="w-20"
              >
                {isActive ? <Pause className="h-4 w-4 mr-1" /> : <Play className="h-4 w-4 mr-1" />}
                {isActive ? "Jeda" : "Mulai"}
              </Button>
              <Button variant="outline" size="sm" onClick={resetTimer}>
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );

  return (
    <>
      {pomodoroCard}
      
      {/* Completion Dialog */}
      <Dialog open={showCompletionDialog} onOpenChange={setShowCompletionDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-primary/10 p-6">
                <Coffee className="h-16 w-16 text-primary" />
              </div>
            </div>
            <DialogTitle className="text-center text-2xl">🎉 Pomodoro Selesai!</DialogTitle>
            <DialogDescription className="text-center text-base">
              Waktu fokus Anda telah selesai. Saatnya istirahat sebentar dan minum kopi! ☕
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center">
            <Button 
              onClick={() => {
                setShowCompletionDialog(false);
                resetTimer();
              }}
              className="w-full sm:w-auto"
            >
              Mulai Istirahat
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
