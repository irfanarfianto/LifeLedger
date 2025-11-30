importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
  apiKey: "AIzaSyDLMgLCBQlwlY1TzAxZNuOfZofbGAN61Rg",
  authDomain: "lifeladger.firebaseapp.com",
  projectId: "lifeladger",
  storageBucket: "lifeladger.firebasestorage.app",
  messagingSenderId: "316852270004",
  appId: "1:316852270004:web:fa8a3382cac9dbc23678e1",
  measurementId: "G-XDQ2CFB39L"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icon.png' // customize icon
  };

  self.registration.showNotification(notificationTitle,
    notificationOptions);
});
