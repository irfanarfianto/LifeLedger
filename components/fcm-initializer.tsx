"use client";

import { useEffect } from "react";
import { requestNotificationPermission } from "@/lib/firebase/requestNotificationPermission";
import { saveFCMToken } from "@/lib/actions/notifications";

export function FCMInitializer() {
  useEffect(() => {
    const subscribeUser = async () => {
      // Only run on client side
      if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
        return;
      }

      try {
        const token = await requestNotificationPermission();
        
        if (token) {
          // Save token to database
          await saveFCMToken(token);
          console.log("✅ FCM Token saved to database");
        }
      } catch (error) {
        console.error("❌ FCM Init Error:", error);
      }
    };

    subscribeUser();
  }, []);

  return null;
}
