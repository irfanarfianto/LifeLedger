"use client";

import { useEffect, useState } from "react";
import { messaging } from "@/lib/firebase/config";
import { getToken } from "firebase/messaging";
import { createClient } from "@/lib/supabase/client";

export function FCMInitializer() {
  const [permission, setPermission] = useState<NotificationPermission>("default");

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setPermission(Notification.permission);
    }
  }, []);

  useEffect(() => {
    async function requestPermissionAndSaveToken() {
      console.log("FCM: Checking permission...", permission);
      if (permission === "granted") {
        try {
          console.log("FCM: Permission granted, initializing messaging...");
          const msg = await messaging();
          if (!msg) {
            console.error("FCM: Messaging not supported or failed to initialize");
            return;
          }

          console.log("FCM: Getting token...");
          
          // Register service worker explicitly
          if ('serviceWorker' in navigator) {
            try {
              let registration;
              
              if (process.env.NODE_ENV === 'development') {
                // In dev, PWA is disabled, so we register the Firebase SW directly
                registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
              } else {
                // In prod, PWA is enabled, so we wait for the main SW (which imports Firebase SW)
                registration = await navigator.serviceWorker.ready;
              }

              console.log('Service Worker used with scope:', registration.scope);
              
              const token = await getToken(msg, {
                vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
                serviceWorkerRegistration: registration,
              });

              if (token) {
            console.log("FCM Token generated:", token);
            // Save token to Supabase
            const supabase = createClient();
            const { data: { user }, error: authError } = await supabase.auth.getUser();
            
            if (authError) {
              console.error("FCM: Auth error:", authError);
              return;
            }

            if (user) {
              console.log("FCM: Saving token for user:", user.id);
              const { error } = await supabase
                .from("profiles")
                .upsert({ id: user.id, fcm_token: token }, { onConflict: "id" });
              
              if (error) {
                console.error("FCM: Error saving token to Supabase:", error);
              } else {
                console.log("FCM: Token saved successfully to Supabase");
              }
            } else {
              console.warn("FCM: No authenticated user found to save token");
            }
          } else {
            console.warn("FCM: No token received");
          }
        } catch (error) {
          console.error("FCM: Service Worker registration failed:", error);
        }
      }
    } catch (error) {
      console.error("FCM: Error getting token:", error);
    }
      } else if (permission === "default") {
        console.log("FCM: Requesting permission...");
        const result = await Notification.requestPermission();
        console.log("FCM: Permission result:", result);
        setPermission(result);
      } else {
        console.log("FCM: Permission denied or other state:", permission);
      }
    }

    requestPermissionAndSaveToken();
  }, [permission]);

  return null;
}
