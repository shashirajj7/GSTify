import React, { createContext, useContext, useState, useEffect } from 'react';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    onAuthStateChanged,
    updateProfile,
    updatePassword as firebaseUpdatePassword
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase.js';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Sync Firebase user → localStorage so the existing credit system keeps working
    const syncUserToLocalStorage = (user) => {
        if (user) {
            const name = user.displayName || user.email?.split('@')[0] || 'User';
            localStorage.setItem('userName', name);
            localStorage.setItem('userId', user.uid);
            localStorage.setItem('loginType', 'login');
            sessionStorage.removeItem('demoMode'); // Strip demo flag on real login
        } else {
            localStorage.removeItem('userName');
            localStorage.removeItem('userId');
            localStorage.removeItem('loginType');
            // Deliberately NOT clearing approvedInvoices here so that refreshing 
            // the page or transitioning between demo/login doesn't blindly wipe data.
        }
    };

    // Sign up with email and password
    const signupWithEmail = async (email, password, displayName) => {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        if (displayName) {
            await updateProfile(result.user, { displayName });
        }
        localStorage.setItem('loginType', 'signup');
        sessionStorage.removeItem('demoMode'); // Strip demo flag on real signup
        return result;
    };

    // Login with email and password
    const loginWithEmail = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    // Login with Google
    const loginWithGoogle = () => {
        return signInWithPopup(auth, googleProvider);
    };

    const logout = async () => {
        await signOut(auth);
        
        // Explicit explicit logout command by the user - clear session data 
        localStorage.removeItem('userName');
        localStorage.removeItem('userId');
        localStorage.removeItem('loginType');
        // REMOVED: localStorage.removeItem('approvedInvoices'); 
        // Data is now isolated per user, so we don't need to destroy the array
        
        // Optional: you can choose to leave demo credits intact on logout,
        // or clear them if you want a fresh demo slate. We will leave them for the month.
        sessionStorage.removeItem('demoMode');
    };

    // Change Password
    const changePassword = (newPassword) => {
        if (!auth.currentUser) throw new Error("No authenticated user");
        return firebaseUpdatePassword(auth.currentUser, newPassword);
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            syncUserToLocalStorage(user);
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        loading,
        signupWithEmail,
        loginWithEmail,
        loginWithGoogle,
        logout,
        changePassword,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
