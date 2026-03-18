import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { confirmPasswordReset, verifyPasswordResetCode } from 'firebase/auth';
import { auth } from '../firebase';

const ResetPassword = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const oobCode = searchParams.get('oobCode');

    const [step, setStep] = useState('loading'); // 'loading' | 'form' | 'success' | 'error'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!oobCode) {
            setStep('error');
            setError('Invalid or missing reset link. Please request a new one.');
            return;
        }
        // Verify the reset code is still valid
        verifyPasswordResetCode(auth, oobCode)
            .then((userEmail) => {
                setEmail(userEmail);
                setStep('form');
            })
            .catch(() => {
                setStep('error');
                setError('This reset link has expired or already been used. Please request a new one.');
            });
    }, [oobCode]);

    const handleReset = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            return setError('Passwords do not match.');
        }
        if (password.length < 8) {
            return setError('Password must be at least 8 characters.');
        }

        setLoading(true);
        try {
            await confirmPasswordReset(auth, oobCode, password);
            setStep('success');
        } catch (err) {
            setLoading(false);
            switch (err.code) {
                case 'auth/expired-action-code':
                    setError('This reset link has expired. Please request a new one.');
                    break;
                case 'auth/weak-password':
                    setError('Password is too weak. Use at least 8 characters.');
                    break;
                default:
                    setError('Failed to reset password. Please try again.');
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans antialiased flex">
            {/* Left branding panel */}
            <div className="hidden lg:flex w-1/2 bg-t_navy relative overflow-hidden flex-col justify-between p-12">
                <Link to="/" className="flex items-center gap-2 cursor-pointer relative z-10 w-fit">
                    <span className="material-symbols-outlined text-primary text-3xl">auto_awesome</span>
                    <span className="font-bold text-2xl tracking-tight text-white">GSTify.AI</span>
                </Link>
                <div className="absolute top-1/4 -right-20 w-96 h-96 bg-primary rounded-full blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute bottom-1/4 -left-20 w-80 h-80 bg-blue-400 rounded-full blur-3xl opacity-20"></div>
                <div className="relative z-10 max-w-md">
                    <h1 className="text-4xl font-bold text-white leading-tight mb-6">
                        Secure your account <span className="text-primary">in seconds.</span>
                    </h1>
                    <p className="text-blue-100 text-lg leading-relaxed">
                        Set a strong new password to keep your GST data safe and protected.
                    </p>
                </div>
                <div className="relative z-10 text-sm text-blue-300">&copy; 2026 GSTify.AI. All rights reserved.</div>
            </div>

            {/* Right panel */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-24 bg-white overflow-y-auto">
                <div className="w-full max-w-md my-auto">

                    {/* Mobile logo */}
                    <Link to="/" className="flex lg:hidden items-center gap-2 mb-8 md:mb-10 w-fit">
                        <span className="material-symbols-outlined text-primary text-3xl">auto_awesome</span>
                        <span className="font-bold text-2xl tracking-tight text-t_navy">GSTify.AI</span>
                    </Link>

                    {/* ── LOADING ── */}
                    {step === 'loading' && (
                        <div className="flex flex-col items-center gap-4 py-16">
                            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-slate-500 font-medium">Verifying your reset link...</p>
                        </div>
                    )}

                    {/* ── ERROR ── */}
                    {step === 'error' && (
                        <div className="text-center">
                            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <span className="material-symbols-outlined text-red-500 text-4xl">link_off</span>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-3">Link invalid or expired</h2>
                            <p className="text-gray-500 mb-8 leading-relaxed">{error}</p>
                            <Link
                                to="/login"
                                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20"
                            >
                                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                                Back to Login
                            </Link>
                        </div>
                    )}

                    {/* ── FORM ── */}
                    {step === 'form' && (
                        <>
                            <div className="mb-8">
                                <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-5">
                                    <span className="material-symbols-outlined text-primary text-3xl">lock_reset</span>
                                </div>
                                <h2 className="text-3xl font-bold text-gray-900 mb-1">Set new password</h2>
                                {email && (
                                    <p className="text-gray-500 text-sm">
                                        Resetting for <span className="font-semibold text-slate-700">{email}</span>
                                    </p>
                                )}
                            </div>

                            {error && (
                                <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2 text-red-700 text-sm">
                                    <span className="material-symbols-outlined text-[18px]">error</span>
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleReset} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-sm pr-10"
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            autoFocus
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            <span className="material-symbols-outlined text-[20px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                                        </button>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1.5">Must be at least 8 characters.</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                                    <input
                                        type="password"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-sm"
                                        placeholder="••••••••"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                </div>

                                {/* Password strength hint */}
                                {password.length > 0 && (
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4].map((i) => (
                                            <div
                                                key={i}
                                                className={`h-1 flex-1 rounded-full transition-colors ${
                                                    password.length >= i * 3
                                                        ? password.length >= 12 ? 'bg-green-500' : password.length >= 8 ? 'bg-amber-400' : 'bg-red-400'
                                                        : 'bg-gray-200'
                                                }`}
                                            />
                                        ))}
                                        <span className="text-xs text-gray-400 ml-2 self-center whitespace-nowrap">
                                            {password.length < 6 ? 'Too short' : password.length < 8 ? 'Weak' : password.length < 12 ? 'Good' : 'Strong'}
                                        </span>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-4 text-white font-bold bg-primary hover:bg-blue-700 rounded-xl transition-all shadow-lg shadow-blue-500/30 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
                                >
                                    {loading ? (
                                        <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Updating password...</>
                                    ) : (
                                        <><span className="material-symbols-outlined text-[18px]">lock</span> Update Password</>
                                    )}
                                </button>
                            </form>

                            <p className="text-center text-sm text-gray-400 mt-6">
                                Remember your password? <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
                            </p>
                        </>
                    )}

                    {/* ── SUCCESS ── */}
                    {step === 'success' && (
                        <div className="text-center">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                                <span className="material-symbols-outlined text-green-600 text-4xl">check_circle</span>
                                <div className="absolute inset-0 rounded-full bg-green-400 opacity-20 animate-ping"></div>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-3">Password updated!</h2>
                            <p className="text-gray-500 mb-8 leading-relaxed">
                                Your password has been changed successfully.<br />You can now log in with your new password.
                            </p>
                            <Link
                                to="/login"
                                className="inline-flex items-center justify-center gap-2 w-full py-4 bg-primary text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20"
                            >
                                <span className="material-symbols-outlined text-[18px]">login</span>
                                Sign In Now
                            </Link>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
