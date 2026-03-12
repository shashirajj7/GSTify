import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { resetGuestCredits } from '../utils/credits';

const Signup = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [firstName, setFirstName] = useState('');

    const handleSignup = (e) => {
        e.preventDefault();
        // Simulate signup and redirect
        let name = firstName || 'Admin';
        name = name.charAt(0).toUpperCase() + name.slice(1);
        localStorage.setItem('userName', name);
        localStorage.setItem('loginType', 'signup');
        resetGuestCredits();
        navigate('/dashboard');
    };

    return (
        <div className="bg-gray-50 text-gray-800 font-sans antialiased overflow-x-hidden min-h-screen flex">
            {/* Left Pattern / Info Side */}
            <div className="hidden lg:flex w-1/2 bg-t_navy relative overflow-hidden flex-col justify-between p-12">
                <Link to="/" className="flex items-center gap-2 cursor-pointer relative z-10 w-fit">
                    <span className="material-symbols-outlined text-primary text-3xl">auto_awesome</span>
                    <span className="font-bold text-2xl tracking-tight text-white">GSTify.AI</span>
                </Link>

                {/* Animated abstract shapes */}
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

                <div className="relative z-10 text-sm text-blue-300">
                    &copy; 2026 GSTify.AI. All rights reserved.
                </div>
            </div>

            {/* Right Sign Up Form Side */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-12 bg-white relative overflow-y-auto">
                <div className="w-full max-w-md my-auto">
                    {/* Mobile Header / Logo */}
                    <Link to="/" className="flex lg:hidden items-center gap-2 cursor-pointer mb-8 w-fit">
                        <span className="material-symbols-outlined text-primary text-3xl">auto_awesome</span>
                        <span className="font-bold text-2xl tracking-tight text-t_navy">GSTify.AI</span>
                    </Link>

                    <div className="text-center lg:text-left mb-8">
                        <h2 className="text-3xl font-bold text-t_navy mb-2">Create an account</h2>
                        <p className="text-gray-500">Start automating your GST today.</p>
                    </div>

                    {/* Login Options */}
                    <div className="space-y-4 mb-8">
                        <button type="button" onClick={() => alert('Google Authentication is coming soon! Please use email signup for the demo.')} className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors font-medium text-gray-700">
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            Sign up with Google
                        </button>
                    </div>

                    <div className="flex items-center gap-4 mb-8">
                        <div className="h-px bg-gray-200 flex-1"></div>
                        <span className="text-sm font-medium text-gray-400">or sign up with email</span>
                        <div className="h-px bg-gray-200 flex-1"></div>
                    </div>

                    <form className="space-y-4" onSubmit={handleSignup}>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-sm"
                                    placeholder="First Name"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-sm"
                                    placeholder="Last Name"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Business Email</label>
                            <input
                                type="email"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-sm"
                                placeholder="example@company.com"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-sm pr-10"
                                    placeholder="••••••••"
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
                            <p className="text-xs text-gray-500 mt-2">Must be at least 8 characters.</p>
                        </div>

                        <div className="flex items-center gap-2 pt-2">
                            <input type="checkbox" id="terms" className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer" required />
                            <label htmlFor="terms" className="text-sm text-gray-600 cursor-pointer">
                                I agree to the <Link to="/" className="text-primary hover:underline">Terms of Service</Link> & <Link to="/" className="text-primary hover:underline">Privacy Policy</Link>
                            </label>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-4 px-6 text-white font-bold bg-primary hover:bg-blue-700 rounded-xl transition-all shadow-lg shadow-blue-500/30 mt-4"
                        >
                            Create Account
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-500 mt-8">
                        Already have an account? <Link to="/login" className="font-medium text-primary hover:text-blue-700 transition-colors">Log in</Link>
                    </p>

                </div>
            </div>
        </div>
    );
};

export default Signup;
