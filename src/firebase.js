import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBMX7Hn6n3Rqf_uxc-HTc7IvmqYSJUbCqw",
  authDomain: "vibeask-1c689.firebaseapp.com",
  projectId: "vibeask-1c689",
  storageBucket: "vibeask-1c689.firebasestorage.app",
  messagingSenderId: "617854189651",
  appId: "1:617854189651:web:381f254b3fdf4fc4dfc6a6",
  measurementId: "G-32T3GRNDJX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export { signInWithPopup, signOut };
