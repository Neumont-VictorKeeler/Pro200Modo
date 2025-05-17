import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);

export const logout = async () => {
    await signOut(auth);
};

export const signInWithGoogle = async () => {
    try {
        const auth = getAuth();
        await signInWithPopup(auth, provider);
    } catch (error: any) {
        throw new Error(error.code);
    }
};

export const signInWithEmail = async (email: string, password: string) => {
    try {
        const auth = getAuth();
        await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
        throw new Error(error.code);
    }
};

export const signUpWithEmail = async (email: string, password: string) => {
    try {
        const auth = getAuth();
        await createUserWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
        throw new Error(error.code);
    }
};