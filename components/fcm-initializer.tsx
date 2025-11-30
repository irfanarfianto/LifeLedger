"use client";

import { useEffect } from "react";
import { requestNotificationPermission } from "@/lib/firebase/client";
import { saveFCMToken } from "@/lib/actions/notifications";
import { toast } from "sonner";

export function FCMInitializer() {
  useEffect(() => {
    const initFCM = async () => {
      // Only run on client side
      if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

      try {
        const token = await requestNotificationPermission();
        if (token) {
          await saveFCMToken(token);
          console.log("FCM Token saved");
        }
      } catch (error) {
        console.error("FCM Init Error:", error);
      }
    };

    initFCM();
  }, []);

  return null; // This component doesn't render anything
}
