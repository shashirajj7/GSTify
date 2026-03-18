import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { getUserSettings } from '../../utils/storage';

const navItems = [
    { path: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
    { path: '/upload', icon: 'cloud_upload', label: 'Upload Invoices' },
    { path: '/invoices', icon: 'receipt_long', label: 'All Invoices' },
    { path: '/validation', icon: 'verified', label: 'Compliance Engine' },
    { path: '/fraud-detection', icon: 'shield', label: 'Fraud Detection' },
    { path: '/export', icon: 'download', label: 'GSTR-1 Export' }
];

const Sidebar = ({ isOpen, setIsOpen }) => {
    const [localSettings, setLocalSettings] = useState(getUserSettings());

    useEffect(() => {
        const handleProfileUpdate = () => {
            setLocalSettings(getUserSettings());
        };
        window.addEventListener('profileUpdated', handleProfileUpdate);
        return () => window.removeEventListener('profileUpdated', handleProfileUpdate);
    }, []);

    const name = localSettings?.firstName ? `${localSettings.firstName} ${localSettings.lastName || ''}`.trim() : (localStorage.getItem('userName') || 'User Profile');
    const avatarLetter = name.charAt(0).toUpperCase();
    const customPhoto = localSettings?.profilePicture;
    const [imageError, setImageError] = useState(false);

    useEffect(() => {
        setImageError(false);
    }, [customPhoto]);
    
    return (
        <div className={`fixed inset-y-0 left-0 z-40 w-[240px] transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 flex flex-col h-full border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex-shrink-0 ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}`}>
            {/* App Logo */}
            <div className="h-20 flex items-center px-6 border-b border-slate-100 dark:border-slate-800 pointer-events-auto shrink-0">
                <Link to="/dashboard" className="flex items-center gap-2 cursor-pointer transition-transform hover:scale-105">
                    <img src="/logo.png" alt="GSTify.AI Logo" className="w-8 h-8 object-contain drop-shadow-sm" />
                    <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">GSTify.AI</span>
                </Link>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsOpen && setIsOpen(false)}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-300 ${isActive
                                ? 'bg-primary/10 text-primary font-bold shadow-[0_0_15px_rgba(19,127,236,0.3)] dark:shadow-[0_0_15px_rgba(19,127,236,0.5)] border border-primary/20'
                                : 'text-secondary hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-primary font-medium border border-transparent'
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <span className={`material-symbols-outlined text-[20px] transition-transform duration-300 ${isActive ? 'fill-1 scale-110 drop-shadow-md' : ''}`}>
                                    {item.icon}
                                </span>
                                <span className="text-sm">{item.label}</span>
                            </>
                        )}
                    </NavLink>
                ))}

                <div className="pt-4 mt-auto">
                    <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">System</p>
                    <NavLink to="/settings" onClick={() => setIsOpen && setIsOpen(false)} className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-300 ${isActive
                            ? 'bg-primary/10 text-primary font-bold shadow-[0_0_15px_rgba(19,127,236,0.3)] dark:shadow-[0_0_15px_rgba(19,127,236,0.5)] border border-primary/20'
                            : 'text-secondary hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-primary font-medium border border-transparent'
                        }`
                    }>
                        <span className="material-symbols-outlined text-[20px]">settings</span>
                        <span className="text-sm">Settings</span>
                    </NavLink>
                </div>
            </div>

            {/* Upgrade CTA */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 shrink-0">
                <Link to="/pricing" className="flex w-full items-center justify-center gap-2 rounded-lg h-10 px-4 bg-primary hover:bg-blue-600 text-white text-sm font-bold transition-all shadow-lg shadow-blue-500/30">
                    <span className="material-symbols-outlined text-[18px]">upgrade</span>
                    <span>Upgrade Plan</span>
                </Link>
            </div>
            {/* Mobile Profile & Logout */}
            <div className="md:hidden p-4 border-t border-slate-100 dark:border-slate-800 shrink-0 bg-slate-50 dark:bg-slate-800/10">
                <Link to="/settings" onClick={() => setIsOpen && setIsOpen(false)} className="flex items-center gap-3 group">
                    <div className="size-9 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 font-bold flex items-center justify-center border border-blue-200 dark:border-blue-800 overflow-hidden">
                        {customPhoto && !imageError ? (
                            <img src={customPhoto} alt={name} className="w-full h-full object-cover" onError={() => setImageError(true)} />
                        ) : (
                            avatarLetter
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-primary transition-colors">{name}</p>
                        <p className="text-xs text-slate-500 truncate">Settings & Account</p>
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default Sidebar;
