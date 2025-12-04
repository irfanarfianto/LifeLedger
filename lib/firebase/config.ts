import { initializeApp, getApps, getApp } from "firebase/app";
import { getMessaging, isSupported } from "firebase/messaging";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDLMgLCBQlwlY1TzAxZNuOfZofbGAN61Rg",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "lifeladger.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "lifeladger",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "lifeladger.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "316852270004",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:316852270004:web:fa8a3382cac9dbc23678e1",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const messaging = async () => {
  try {
    const isSupportedBrowser = await isSupported();
    if (isSupportedBrowser) {
      return getMessaging(app);
    }
    console.log("Firebase Messaging not supported in this browser");
    return null;
  } catch (err) {
    console.error("Error checking messaging support:", err);
    return null;
  }
};

export { app, messaging };
