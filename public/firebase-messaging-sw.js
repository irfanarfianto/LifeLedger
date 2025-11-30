importScripts(
  "https://www.gstatic.com/firebasejs/10.11.1/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.11.1/firebase-messaging-compat.js"
);

// REPLACE THESE WITH YOUR ACTUAL FIREBASE CONFIG VALUES
const firebaseConfig = {
  apiKey: "AIzaSyDLMgLCBQlwlY1TzAxZNuOfZofbGAN61Rg",
  authDomain: "lifeladger.firebaseapp.com",
  projectId: "lifeladger",
  storageBucket: "lifeladger.firebasestorage.app",
  messagingSenderId: "316852270004",
  appId: "1:316852270004:web:fa8a3382cac9dbc23678e1",
  measurementId: "G-XDQ2CFB39L"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon || '/icon.png',
    data: { url: payload.fcmOptions?.link || "/" },
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || "/";

  event.waitUntil(
    clients
      .matchAll({
        type: "window",
        includeUncontrolled: true,
      })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url.includes(targetUrl) && "focus" in client) {
            return client.focus();
          }
        }
        return clients.openWindow(targetUrl);
      })
  );
});
