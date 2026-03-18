import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';

const Navbar = () => {
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleTryDemo = async () => {
        try { await signOut(auth); } catch (_) {}
        localStorage.removeItem('loginType');
        sessionStorage.setItem('demoMode', 'true');
        localStorage.setItem('userName', 'Guest User');
        navigate('/dashboard');
    };
    const [isDark, setIsDark] = useState(() => {
        // Initialize state based on the document class to keep it consistent
        return document.documentElement.classList.contains('dark');
    });

    // Update state if theme changes elsewhere (e.g. initial load logic)
    useEffect(() => {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class') {
                    setIsDark(document.documentElement.classList.contains('dark'));
                }
            });
        });
        observer.observe(document.documentElement, { attributes: true });
        return () => observer.disconnect();
    }, []);

    const toggleTheme = () => {
        if (document.documentElement.classList.contains('dark')) {
            document.documentElement.classList.remove('dark');
            localStorage.theme = 'light';
            setIsDark(false);
        } else {
            document.documentElement.classList.add('dark');
            localStorage.theme = 'dark';
            setIsDark(true);
        }
    };

    return (
        <nav className="fixed w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-100 dark:border-slate-800 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    <Link to="/" className="flex items-center gap-2 cursor-pointer">
                        <img src="/logo.png" alt="GSTify.AI Logo" className="w-9 h-9 object-contain drop-shadow-sm" />
                        <span className="font-bold text-xl tracking-tight text-t_navy dark:text-white">GSTify.AI</span>
                    </Link>
                    <div className="hidden md:flex items-center space-x-8">
                        <a href="/#how-it-works" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-white transition-colors">How it Works</a>
                        <a href="/#features" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-white transition-colors">Features</a>
                        <a href="/#pricing" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-white transition-colors">Pricing</a>
                        <a href="/#contact" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-white transition-colors">Contact</a>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            aria-label="Toggle Theme"
                        >
                            <span className="material-symbols-outlined text-[20px]">
                                {isDark ? 'light_mode' : 'dark_mode'}
                            </span>
                        </button>
                        {/* Desktop Log In Link */}
                        <Link to="/login" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-t_navy dark:hover:text-white hidden md:block">
                            Log in
                        </Link>

                        {/* Mobile Log In Button (Replaces Try Demo on small screens) */}
                        <Link to="/login" className="md:hidden inline-flex items-center justify-center px-4 py-1.5 text-xs font-semibold text-white bg-primary rounded-full hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/30">
                            Log in
                        </Link>

                        {/* Desktop Try Demo Button */}
                        <button onClick={handleTryDemo} className="hidden md:inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-white bg-primary rounded-full hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30">
                            Try Demo
                        </button>
                        {/* Mobile menu button */}
                        <div className="md:hidden flex items-center">
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white focus:outline-none p-1 ml-2"
                                aria-label="Toggle mobile menu"
                            >
                                <span className="material-symbols-outlined text-3xl">
                                    {isMobileMenuOpen ? 'close' : 'menu'}
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 px-4 pt-2 pb-6 space-y-2 shadow-xl absolute w-full left-0 top-20 flex flex-col transition-all">
                    <a href="/#how-it-works" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-3 rounded-lg text-base font-semibold text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors">How it Works</a>
                    <a href="/#features" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-3 rounded-lg text-base font-semibold text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors">Features</a>
                    <a href="/#pricing" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-3 rounded-lg text-base font-semibold text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors">Pricing</a>
                    <a href="/#contact" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-3 rounded-lg text-base font-semibold text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors">Contact</a>
                    <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-3 rounded-lg text-base font-semibold text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors sm:hidden">Log in</Link>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
