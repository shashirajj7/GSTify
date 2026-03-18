import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase';

const Login = () => {
    const navigate = useNavigate();
    const { loginWithEmail, loginWithGoogle } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Forgot password modal state
    const [showForgotModal, setShowForgotModal] = useState(false);
    const [resetEmail, setResetEmail] = useState('');
    const [resetLoading, setResetLoading] = useState(false);
    const [resetError, setResetError] = useState('');
    const [resetSuccess, setResetSuccess] = useState(false);

    const handleTryDemo = () => {
        sessionStorage.setItem('demoMode', 'true');
        localStorage.setItem('userName', 'Guest User');
        navigate('/dashboard');
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setPasswordError('');

        if (password.length < 8) {
            return setPasswordError('Password must be at least 8 characters.');
        }

        setLoading(true);
        try {
            await loginWithEmail(email, password);
            navigate('/dashboard');
        } catch (err) {
            setLoading(false);
            switch (err.code) {
                case 'auth/user-not-found':
                case 'auth/wrong-password':
                case 'auth/invalid-credential':
                    setError('Invalid email or password. Please try again.');
                    break;
                case 'auth/too-many-requests':
                    setError('Too many failed attempts. Please try again later.');
                    break;
                default:
                    setError('Failed to sign in. Please check your credentials.');
            }
        }
    };

    const handleGoogleLogin = async () => {
        setError('');
        setLoading(true);
        try {
            await loginWithGoogle();
            navigate('/dashboard');
        } catch (err) {
            setLoading(false);
            if (err.code !== 'auth/popup-closed-by-user') {
                setError('Google sign-in failed. Please try again.');
            }
        }
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setResetError('');
        setResetLoading(true);
        try {
            await sendPasswordResetEmail(auth, resetEmail);
            setResetSuccess(true);
        } catch (err) {
            setResetLoading(false);
            switch (err.code) {
                case 'auth/user-not-found':
                    setResetError('No account found with this email address.');
                    break;
                case 'auth/invalid-email':
                    setResetError('Please enter a valid email address.');
                    break;
                default:
                    setResetError('Failed to send reset email. Please try again.');
            }
        }
    };

    const closeForgotModal = () => {
        setShowForgotModal(false);
        setResetEmail('');
        setResetError('');
        setResetSuccess(false);
        setResetLoading(false);
    };

    return (
        <div className="bg-gray-50 text-gray-800 font-sans antialiased overflow-hidden h-screen flex">
            {/* Left Pattern / Info Side */}
            <div className="hidden lg:flex w-1/2 bg-t_navy relative overflow-hidden flex-col justify-between p-12">
                <Link to="/" className="flex items-center gap-2 cursor-pointer relative z-10 w-fit">
                    <span className="material-symbols-outlined text-primary text-3xl">auto_awesome</span>
                    <span className="font-bold text-2xl tracking-tight text-white">GSTify.AI</span>
                </Link>
                <div className="absolute top-1/4 -right-20 w-96 h-96 bg-primary rounded-full blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute bottom-1/4 -left-20 w-80 h-80 bg-blue-400 rounded-full blur-3xl opacity-20"></div>
                <div className="relative z-10 max-w-md">
                    <h1 className="text-4xl font-bold text-white leading-tight mb-6">
                        Automate your GST compliance <span className="text-primary">10x faster.</span>
                    </h1>
                    <p className="text-blue-100 text-lg mb-8 leading-relaxed">
                        Join thousands of businesses who trust GSTify.AI for 99.8% accurate invoice extraction and GSTR-1 filing.
                    </p>
                </div>
                <div className="relative z-10 text-sm text-blue-300">&copy; 2026 GSTify.AI. All rights reserved.</div>
            </div>

            {/* Right Login Form Side */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-24 bg-white relative overflow-y-auto">
                <div className="w-full max-w-md my-auto">
                    <Link to="/" className="flex lg:hidden items-center gap-2 cursor-pointer mb-8 md:mb-10 w-fit">
                        <span className="material-symbols-outlined text-primary text-3xl">auto_awesome</span>
                        <span className="font-bold text-2xl tracking-tight text-t_navy">GSTify.AI</span>
                    </Link>

                    <div className="text-center lg:text-left mb-10">
                        <h2 className="text-3xl font-bold text-t_navy mb-2">Welcome back</h2>
                        <p className="text-gray-500">Please enter your details to sign in.</p>
                    </div>

                    {/* Error Banner */}
                    {error && (
                        <div className="mb-6 p-3 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2 text-red-700 text-sm">
                            <span className="material-symbols-outlined text-[18px]">error</span>
                            {error}
                        </div>
                    )}

                    {/* Google Login */}
                    <div className="space-y-4 mb-8">
                        <button
                            type="button"
                            onClick={handleGoogleLogin}
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors font-medium text-gray-700 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            Continue with Google
                        </button>
                    </div>

                    <div className="flex items-center gap-4 mb-8">
                        <div className="h-px bg-gray-200 flex-1"></div>
                        <span className="text-sm font-medium text-gray-400">or sign in with email</span>
                        <div className="h-px bg-gray-200 flex-1"></div>
                    </div>

                    <form className="space-y-5" onSubmit={handleLogin}>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                            <input
                                type="email"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-sm"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-sm font-medium text-gray-700">Password</label>
                                <button
                                    type="button"
                                    onClick={() => { setShowForgotModal(true); setResetEmail(email); }}
                                    className="text-sm font-medium text-primary hover:text-blue-700 transition-colors"
                                >
                                    Forgot password?
                                </button>
                            </div>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-sm pr-10"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    <span className="material-symbols-outlined text-[20px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                                </button>
                            </div>
                            {passwordError && (
                                <p className="text-red-500 text-xs mt-2">{passwordError}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 px-6 text-white font-bold bg-primary hover:bg-blue-700 rounded-xl transition-all shadow-lg shadow-blue-500/30 mt-4 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Signing in...</>
                            ) : 'Sign In'}
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-500 mt-8">
                        Don't have an account? <Link to="/signup" className="font-medium text-primary hover:text-blue-700 transition-colors">Sign up for free</Link>
                    </p>

                    <div className="flex items-center justify-center mt-6">
                        <button onClick={handleTryDemo} className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 text-sm font-medium transition-colors">
                            <span className="material-symbols-outlined text-[18px]">rocket_launch</span>
                            Try a Free Demo
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Forgot Password Modal ── */}
            {showForgotModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={closeForgotModal}>
                    <div
                        className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative animate-fade-in"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={closeForgotModal}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>

                        {resetSuccess ? (
                            /* ── Success State ── */
                            <div className="text-center py-4">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="material-symbols-outlined text-green-600 text-3xl">mark_email_read</span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Check your inbox</h3>
                                <p className="text-gray-500 text-sm mb-1">We sent a password reset link to:</p>
                                <p className="text-primary font-semibold text-sm mb-6">{resetEmail}</p>
                                <p className="text-gray-400 text-xs mb-6">Didn't receive it? Check your spam folder or try again.</p>
                                <button
                                    onClick={closeForgotModal}
                                    className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-blue-700 transition-colors"
                                >
                                    Back to Login
                                </button>
                            </div>
                        ) : (
                            /* ── Reset Form ── */
                            <>
                                <div className="mb-6">
                                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                                        <span className="material-symbols-outlined text-primary text-xl">lock_reset</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-1">Reset your password</h3>
                                    <p className="text-gray-500 text-sm">Enter your email and we'll send you a reset link.</p>
                                </div>

                                {resetError && (
                                    <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2 text-red-700 text-sm">
                                        <span className="material-symbols-outlined text-[18px]">error</span>
                                        {resetError}
                                    </div>
                                )}

                                <form onSubmit={handleForgotPassword} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Email address</label>
                                        <input
                                            type="email"
                                            autoFocus
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-sm"
                                            placeholder="Enter your email"
                                            value={resetEmail}
                                            onChange={(e) => setResetEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={resetLoading}
                                        className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {resetLoading ? (
                                            <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Sending...</>
                                        ) : 'Send Reset Link'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={closeForgotModal}
                                        className="w-full py-3 text-gray-600 font-medium rounded-xl hover:bg-gray-50 transition-colors text-sm"
                                    >
                                        Cancel
                                    </button>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Login;
