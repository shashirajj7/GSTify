// Firebase configuration for GSTify AI
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyCN2E5EUqbnNQScOAEtK9HhAGrEwNXUhnY",
    authDomain: "gstify-ai.firebaseapp.com",
    projectId: "gstify-ai",
    storageBucket: "gstify-ai.firebasestorage.app",
    messagingSenderId: "1069702044166",
    appId: "1:1069702044166:web:7c2a2882bee044fcb34187",
    measurementId: "G-2KFET8ZQHF"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export default app;
