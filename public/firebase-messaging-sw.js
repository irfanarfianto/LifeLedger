importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

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

messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icon.png',
    badge: '/icon.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
