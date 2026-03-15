import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Check if Firebase is properly configured
const isFirebaseConfigured = 
  firebaseConfig.apiKey && 
  firebaseConfig.apiKey !== 'AIzaSyDemoKeyForTestingPurposesOnly1234567890' &&
  firebaseConfig.projectId && 
  firebaseConfig.projectId !== 'road-trip-advisor-demo';

let app;
let auth;
let googleProvider;

if (isFirebaseConfigured) {
  try {
    // Initialize Firebase
    app = initializeApp(firebaseConfig);
    // Initialize Firebase Authentication and get a reference to the service
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
  } catch (error) {
    console.error('Firebase initialization error:', error);
    // Fallback for development
    app = null;
    auth = null;
    googleProvider = null;
  }
} else {
  console.warn('Firebase is not configured. Please set up your Firebase credentials in the .env file.');
  app = null;
  auth = null;
  googleProvider = null;
}

export { auth, googleProvider, isFirebaseConfigured };
export default app;
