"use client";

import { useEffect, useState } from "react";
import { messaging } from "@/lib/firebase/config";
import { getToken } from "firebase/messaging";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";

import { toast } from "sonner";

export function FCMInitializer() {
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setPermission(Notification.permission);
    }

    const supabase = createClient();
    // Check initial user
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    async function initializeFCM() {
      if (typeof window === "undefined" || !("Notification" in window)) return;

      // Check for Secure Context (HTTPS or localhost)
      if (!window.isSecureContext) {
        console.warn("FCM: App not in Secure Context. Notifications require HTTPS.");
        return;
      }

      if (permission === "default") {
        // Mobile browsers block auto-request. Show a toast to get User Gesture.
        toast("Aktifkan notifikasi?", {
          description: "Dapatkan pengingat untuk menabung.",
          action: {
            label: "Ya, Aktifkan",
            onClick: async () => {
              console.log("FCM: Requesting permission via User Gesture...");
              const result = await Notification.requestPermission();
              setPermission(result);
            }
          },
          duration: 8000,
        });
        return;
      }

      if (permission === "granted") {
        try {
          const msg = await messaging();
          if (!msg) return;

          // Register service worker explicitly
          let registration;
          if ('serviceWorker' in navigator) {
            if (process.env.NODE_ENV === 'development') {
              registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
            } else {
              registration = await navigator.serviceWorker.ready;
            }

            const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
            if (!vapidKey) {
              console.warn("FCM: VAPID key is missing. Skipping FCM initialization.");
              return;
            }

            const token = await getToken(msg, {
              vapidKey,
              serviceWorkerRegistration: registration,
            });

            if (token) {
              console.log("FCM Token generated:", token);
              
              // Only save if we have a user
              if (user) {
                console.log("FCM: Saving token for user:", user.id);
                const supabase = createClient();
                const { error } = await supabase
                  .from("profiles")
                  .upsert({ id: user.id, fcm_token: token }, { onConflict: "id" });
                
                if (error) {
                  console.error("FCM: Error saving token to Supabase:", error);
                } else {
                  console.log("FCM: Token saved successfully to Supabase");
                }
              } else {
                console.log("FCM: Token generated but no user logged in yet. Waiting for login...");
              }
            }
          }
        } catch (error) {
          if (error instanceof Error && error.message.includes("Registration failed - push service error")) {
            console.warn("FCM: Push notifications are blocked by the browser (common in Brave). Enable 'Use Google Services for Push Messaging' in Brave settings to fix.");
          } else {
            console.error("FCM: Initialization failed:", error);
          }
        }
      }
    }

    initializeFCM();
  }, [permission, user]); // Re-run when permission changes or user logs in

  return null;
}
