import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

export const firebaseConfig = {
  apiKey: import.meta.env?.VITE_FIREBASE_API_KEY || "AIzaSyDu7EF3Kp38pch3d7pcBkLNVOX4suiFUD0",
  authDomain: import.meta.env?.VITE_FIREBASE_AUTH_DOMAIN || "carecalculus-7bb99.firebaseapp.com",
  projectId: import.meta.env?.VITE_FIREBASE_PROJECT_ID || "carecalculus-7bb99",
  storageBucket: import.meta.env?.VITE_FIREBASE_STORAGE_BUCKET || "carecalculus-7bb99.firebasestorage.app",
  messagingSenderId: import.meta.env?.VITE_FIREBASE_MESSAGING_SENDER_ID || "584218264365",
  appId: import.meta.env?.VITE_FIREBASE_APP_ID || "1:584218264365:web:3c8366be45380b26edc9a4",
  measurementId: import.meta.env?.VITE_FIREBASE_MEASUREMENT_ID || "G-1J4MGT3TLR"
};

// Initialize Firebase safely (Singleton instance)
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Auth & Firestore
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);

// Initialize Firebase Analytics dynamically (browser-only)
export let analytics: any = null;
if (typeof window !== 'undefined') {
  isSupported().then(supported => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch(console.error);
}
