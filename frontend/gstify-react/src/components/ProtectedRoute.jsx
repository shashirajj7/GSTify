import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { currentUser, loading } = useAuth();

    if (loading) {
        return (
            <div className="h-screen w-screen flex items-center justify-center bg-slate-50 dark:bg-[#0A1017]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-slate-500 text-sm font-medium">Loading GSTify.AI...</p>
                </div>
            </div>
        );
    }

    const isDemoMode = sessionStorage.getItem('demoMode') === 'true';

    if (!currentUser && !isDemoMode) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
