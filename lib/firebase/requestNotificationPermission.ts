import { getToken, messaging } from "./config";

export const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
      console.log("Notification permission denied");
      return null;
    }

    const registration = await navigator.serviceWorker.register(
      "/firebase-messaging-sw.js"
    );

    if (!registration) {
      console.error("Service Worker registration failed");
      return null;
    }

    // Wait for service worker to be ready
    await navigator.serviceWorker.ready;

    const token = await getToken(messaging!, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
      serviceWorkerRegistration: registration,
    });

    if (!token) {
      console.error("Failed to get FCM token");
      return null;
    }

    console.log("FCM Token obtained:", token);
    return token;

  } catch (error) {
    console.error("Error Requesting Notification Permission:", error);
    return null;
  }
};
