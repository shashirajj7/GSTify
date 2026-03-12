import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { isLoggedIn, getGuestCredits, MAX_GUEST_CREDITS } from '../../utils/credits';

const Header = ({ toggleSidebar }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [userName, setUserName] = useState('Business Admin');
    const [guestCredits, setGuestCredits] = useState(getGuestCredits);
    const [loggedIn, setLoggedIn] = useState(isLoggedIn);
    const dropdownRef = useRef(null);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedName = localStorage.getItem('userName');
        if (storedName) {
            setUserName(storedName);
        }
        setLoggedIn(isLoggedIn());
        setGuestCredits(getGuestCredits());
    }, []);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            console.log("Files selected from Header:", e.target.files);
            navigate('/validation');
        }
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleTheme = () => {
        if (document.documentElement.classList.contains('dark')) {
            document.documentElement.classList.remove('dark');
            localStorage.theme = 'light';
        } else {
            document.documentElement.classList.add('dark');
            localStorage.theme = 'dark';
        }
        // Force a re-render to update the icon
        setIsDropdownOpen(prev => prev); // Hacky way to force re-render if needed, but the DOM class handles it mostly.
    };

    const isDark = document.documentElement.classList.contains('dark');

    return (
        <>
            {/* Mobile Header */}
            <div className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 z-10">
                <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">auto_awesome_mosaic</span>
                    <Link to="/" className="font-bold text-lg">GSTify.AI</Link>
                </div>
                <button className="text-slate-600 dark:text-slate-300" onClick={toggleSidebar}>
                    <span className="material-symbols-outlined">menu</span>
                </button>
            </div>

            {/* Top Header Desktop */}
            <header className="hidden md:flex items-center justify-between border-b border-slate-200 dark:border-slate-800/80 bg-white/80 dark:bg-[#1A2632]/80 backdrop-blur-md px-8 h-16 sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-300 flex items-center gap-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 px-2 py-1 cursor-pointer transition-colors">
                        GSTify Workspace
                        <span className="material-symbols-outlined text-[16px]">expand_more</span>
                    </span>
                </div>

                <div className="flex items-center justify-end gap-3">
                    {/* Guest Demo Credit Pill */}
                    {!loggedIn && (
                        <Link
                            to="/signup"
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all hover:-translate-y-0.5 ${
                                guestCredits <= 1
                                    ? 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-700 text-red-600 dark:text-red-400'
                                    : 'bg-amber-50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-700 text-amber-700 dark:text-amber-400'
                            }`}
                            title="Sign up for unlimited access"
                        >
                            <span className="material-symbols-outlined text-[14px]">bolt</span>
                            {guestCredits}/{MAX_GUEST_CREDITS} Demo Credits
                        </Link>
                    )}

                    <button className="size-9 flex items-center justify-center rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition-colors">
                        <span className="material-symbols-outlined text-[20px]">notifications</span>
                    </button>

                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="size-9 flex items-center justify-center rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                        title="Toggle Theme"
                    >
                        <span className="material-symbols-outlined text-[20px] dark:hidden">dark_mode</span>
                        <span className="material-symbols-outlined text-[20px] hidden dark:block">light_mode</span>
                    </button>

                    {/* Profile Dropdown Container */}
                    <div className="relative ml-2" ref={dropdownRef}>
                        <div
                            className="flex items-center justify-center bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-bold rounded-full size-9 border border-blue-200 dark:border-blue-800 cursor-pointer shadow-sm select-none"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            title={userName}
                        >
                            {userName ? userName.charAt(0).toUpperCase() : 'A'}
                        </div>

                        {/* Dropdown Menu */}
                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 py-2 z-50">
                                <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700 mb-1">
                                    <p className="text-sm font-bold text-slate-900 dark:text-white">{userName}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 overflow-hidden text-ellipsis whitespace-nowrap">{userName.toLowerCase()}@gstify.ai</p>
                                </div>
                                <Link to="/settings" className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center gap-3">
                                    <span className="material-symbols-outlined text-[18px]">person</span> My Profile
                                </Link>
                                <Link to="/settings" className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center gap-3">
                                    <span className="material-symbols-outlined text-[18px]">settings</span> Account Settings
                                </Link>
                                <div className="border-t border-slate-100 dark:border-slate-700 my-1"></div>
                                <Link to="/login" className="block px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-3">
                                    <span className="material-symbols-outlined text-[18px]">logout</span> Log out
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </header>
        </>
    );
};

export default Header;
