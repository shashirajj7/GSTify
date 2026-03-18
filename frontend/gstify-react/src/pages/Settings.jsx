import React, { useState, useEffect, useRef } from 'react';
import AppLayout from '../components/layout/AppLayout';
import { useAuth } from '../context/AuthContext';
import { getUserSettings, saveUserSettings } from '../utils/storage';

const Settings = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const [isAnnual, setIsAnnual] = useState(true);

    // User Profile State
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [companyName, setCompanyName] = useState('GSTify.AI Pro Technologies');
    const [profilePicture, setProfilePicture] = useState(null);
    const fileInputRef = useRef(null);

    // Security State
    const { changePassword } = useAuth();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
    
    // UI Feedback State
    const [saveStatus, setSaveStatus] = useState({ show: false, message: '', type: 'success' });

    const handleUpdatePassword = async () => {
        setPasswordError('');
        setPasswordSuccess('');
        if (!newPassword || !confirmPassword) {
            setPasswordError("Please fill out new password fields.");
            return;
        }
        if (newPassword !== confirmPassword) {
            setPasswordError("New passwords do not match.");
            return;
        }
        if (newPassword.length < 6) {
            setPasswordError("Password must be at least 6 characters.");
            return;
        }
        
        setIsUpdatingPassword(true);
        try {
            await changePassword(newPassword);
            setPasswordSuccess("Password updated successfully. You will remain logged in.");
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            console.error("Error updating password:", error);
            if (error?.code === 'auth/requires-recent-login') {
                setPasswordError("Security: This action requires a recent login. Please log out and log in again.");
            } else {
                setPasswordError("Failed to update password. " + (error?.message || ""));
            }
        } finally {
            setIsUpdatingPassword(false);
        }
    };

    useEffect(() => {
        // First try to load from generic storage settings
        const settings = getUserSettings();
        if (settings) {
            if (settings.firstName) setFirstName(settings.firstName);
            if (settings.lastName) setLastName(settings.lastName);
            if (settings.email) setEmail(settings.email);
            if (settings.companyName) setCompanyName(settings.companyName);
            if (settings.profilePicture) setProfilePicture(settings.profilePicture);
        } else {
            // Fallback to reading the AuthContext saved name just for initial population
            const storedName = localStorage.getItem('userName');
            if (storedName) {
                const nameParts = storedName.split(' ');
                setFirstName(nameParts[0]);
                if (nameParts.length > 1) {
                    setLastName(nameParts.slice(1).join(' '));
                } else {
                    setLastName('');
                }
                const generatedEmail = `${storedName.toLowerCase().replace(/\s+/g, '')}@gstify.ai`;
                setEmail(localStorage.getItem('userEmail') || generatedEmail); // or actual email if we had it
            }
        }
    }, []);

    const handleSaveProfile = () => {
        saveUserSettings({
            firstName,
            lastName,
            email,
            companyName,
            profilePicture
        });
        
        // Dispatch event so Header and Sidebar update instantly
        window.dispatchEvent(new Event('profileUpdated'));

        setSaveStatus({ show: true, message: 'Profile settings saved successfully!', type: 'success' });
        setTimeout(() => setSaveStatus({ show: false, message: '', type: 'success' }), 3000);
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.match('image.*')) {
                setSaveStatus({ show: true, message: 'Please select a valid image (JPEG, PNG).', type: 'error' });
                setTimeout(() => setSaveStatus({ show: false, message: '', type: 'success' }), 3000);
                if (fileInputRef.current) fileInputRef.current.value = '';
                return;
            }

            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onerror = () => {
                    setSaveStatus({ show: true, message: 'Failed to open image. It might be corrupted or unsupported.', type: 'error' });
                    setTimeout(() => setSaveStatus({ show: false, message: '', type: 'success' }), 3000);
                };
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 256;
                    const MAX_HEIGHT = 256;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }

                    canvas.width = Math.round(width);
                    canvas.height = Math.round(height);
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    // Export as severely compressed JPEG to guarantee it fits in LocalStorage
                    const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
                    setProfilePicture(compressedDataUrl);
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
            
            // Clear input value so the exact same file can be selected again
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleRemovePhoto = () => {
        setProfilePicture(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <AppLayout>
            {/* Toast Notification */}
            {saveStatus.show && (
                <div className={`fixed top-20 right-4 md:right-8 z-50 ${saveStatus.type === 'success' ? 'bg-green-600' : 'bg-red-600'} text-white px-4 py-3 rounded-lg shadow-xl shadow-black/10 flex items-center gap-3 animate-in fade-in slide-in-from-top-10 duration-300 border border-white/20`}>
                    <span className="material-symbols-outlined">{saveStatus.type === 'success' ? 'check_circle' : 'error'}</span>
                    <span className="font-bold text-sm">{saveStatus.message}</span>
                </div>
            )}
            
            <div className="flex-1 overflow-y-auto w-full p-4 md:p-8 lg:px-12">
                <div className="max-w-4xl mx-auto flex flex-col gap-8">

                    <div className="flex flex-col gap-1">
                        <h2 className="text-slate-900 dark:text-white text-3xl font-extrabold tracking-tight">Account Settings</h2>
                        <p className="text-secondary text-sm md:text-base">Manage your profile, preferences, and billing information.</p>
                    </div>

                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Settings Navigation */}
                        <div className="w-full md:w-64 shrink-0">
                            <nav className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
                                <button
                                    onClick={() => setActiveTab('profile')}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-colors whitespace-nowrap ${activeTab === 'profile' ? 'bg-primary text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'}`}
                                >
                                    <span className="material-symbols-outlined text-[20px]">person</span>
                                    Public Profile
                                </button>
                                <button
                                    onClick={() => setActiveTab('security')}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-colors whitespace-nowrap ${activeTab === 'security' ? 'bg-primary text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'}`}
                                >
                                    <span className="material-symbols-outlined text-[20px]">lock</span>
                                    Security & Password
                                </button>
                                <button
                                    onClick={() => setActiveTab('notifications')}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-colors whitespace-nowrap ${activeTab === 'notifications' ? 'bg-primary text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'}`}
                                >
                                    <span className="material-symbols-outlined text-[20px]">notifications</span>
                                    Notifications
                                </button>
                                <button
                                    onClick={() => setActiveTab('billing')}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-colors whitespace-nowrap ${activeTab === 'billing' ? 'bg-primary text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'}`}
                                >
                                    <span className="material-symbols-outlined text-[20px]">credit_card</span>
                                    Billing & Plans
                                </button>
                            </nav>
                        </div>

                        {/* Settings Content Area */}
                        <div className="flex-1 bg-white dark:bg-[#1A2632] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-sm">

                            {activeTab === 'profile' && (
                                <div className="space-y-8 animate-in fade-in duration-300">
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Profile Information</h3>
                                        <div className="flex items-center gap-6 mb-6">
                                            <input 
                                                type="file" 
                                                ref={fileInputRef} 
                                                onChange={handlePhotoChange} 
                                                accept="image/*" 
                                                className="hidden" 
                                            />
                                            <div 
                                                className="w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-bold flex items-center justify-center text-3xl border border-blue-200 dark:border-blue-800 shadow-sm relative group select-none overflow-hidden"
                                                onClick={() => fileInputRef.current?.click()}
                                            >
                                                {profilePicture ? (
                                                    <img src={profilePicture} alt="Profile" className="w-full h-full object-cover" onError={handleRemovePhoto} />
                                                ) : (
                                                    <span>{firstName ? firstName.charAt(0).toUpperCase() : 'A'}</span>
                                                )}
                                                <div className="absolute inset-0 bg-black/50 rounded-full hidden group-hover:flex items-center justify-center cursor-pointer transition-all">
                                                    <span className="material-symbols-outlined text-white text-[24px]">photo_camera</span>
                                                </div>
                                            </div>
                                            <div>
                                                <button type="button" onClick={() => fileInputRef.current?.click()} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-bold rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors mr-3">Change Photo</button>
                                                <button type="button" onClick={handleRemovePhoto} className="px-4 py-2 text-red-600 dark:text-red-400 text-sm font-bold hover:underline">Remove</button>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">First Name</label>
                                                <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Last Name</label>
                                                <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
                                                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Company Name (GSTIN Registered)</label>
                                                <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex justify-end">
                                        <button type="button" onClick={handleSaveProfile} className="px-6 py-2.5 bg-primary text-white text-sm font-bold rounded-lg hover:bg-blue-600 transition-colors shadow-md shadow-blue-500/20">Save Changes</button>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'security' && (
                                <div className="space-y-8 animate-in fade-in duration-300">
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Change Password</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Update your password associated with your account.</p>

                                        <div className="space-y-4 max-w-md">
                                            {passwordError && (
                                                <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm border border-red-200 dark:border-red-800">
                                                    {passwordError}
                                                </div>
                                            )}
                                            {passwordSuccess && (
                                                <div className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 p-3 rounded-lg text-sm border border-emerald-200 dark:border-emerald-800">
                                                    {passwordSuccess}
                                                </div>
                                            )}
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Current Password</label>
                                                <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="••••••••" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">New Password</label>
                                                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="••••••••" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Confirm New Password</label>
                                                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex justify-end">
                                        <button 
                                            onClick={handleUpdatePassword} 
                                            disabled={isUpdatingPassword}
                                            className="px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-bold rounded-lg hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors disabled:opacity-50"
                                        >
                                            {isUpdatingPassword ? 'Updating...' : 'Update Password'}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'notifications' && (
                                <div className="space-y-8 animate-in fade-in duration-300">
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Email Notifications</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Choose what updates you want to receive via email.</p>

                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                                                <div className="pr-4">
                                                    <p className="font-bold text-slate-900 dark:text-white text-sm">GSTR-1 Deadlines</p>
                                                    <p className="text-xs text-slate-500 mt-1">Get reminded 3 days before filing deadline.</p>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                                                    <input type="checkbox" className="sr-only peer" defaultChecked />
                                                    <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                                </label>
                                            </div>

                                            <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                                                <div className="pr-4">
                                                    <p className="font-bold text-slate-900 dark:text-white text-sm">Anomaly Detection Alerts</p>
                                                    <p className="text-xs text-slate-500 mt-1">Immediate email when GSTIN or Tax logic fails.</p>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                                                    <input type="checkbox" className="sr-only peer" defaultChecked />
                                                    <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                                </label>
                                            </div>

                                            <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                                                <div className="pr-4">
                                                    <p className="font-bold text-slate-900 dark:text-white text-sm">Product Updates</p>
                                                    <p className="text-xs text-slate-500 mt-1">News about the latest AI models and features.</p>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                                                    <input type="checkbox" className="sr-only peer" />
                                                    <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'billing' && (
                                <div className="space-y-10 animate-in fade-in duration-300">
                                    {/* Plan Header & Toggle */}
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Subscription Plan</h3>
                                                <span className="bg-blue-100 text-primary dark:bg-blue-900/30 dark:text-blue-400 text-xs font-bold px-2.5 py-1 rounded-full border border-blue-200 dark:border-blue-800">Current Plan: Growth</span>
                                            </div>
                                            <p className="text-slate-500 text-sm">Manage your billing frequency and plan features.</p>
                                        </div>
                                        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                                            <button
                                                onClick={() => setIsAnnual(false)}
                                                className={`px-4 py-2 text-sm font-bold rounded-md transition-all ${!isAnnual ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                                            >
                                                Monthly
                                            </button>
                                            <button
                                                onClick={() => setIsAnnual(true)}
                                                className={`px-4 py-2 text-sm font-bold rounded-md transition-all ${isAnnual ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                                            >
                                                Annual <span className="text-green-500 ml-1">-20%</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Usage Progress */}
                                    <div className="bg-slate-50 dark:bg-[#121A23] rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                                        <div className="flex justify-between items-end mb-4">
                                            <div>
                                                <h4 className="font-bold text-slate-900 dark:text-white mb-1">Invoice Processing Usage</h4>
                                                <p className="text-xs text-slate-500">Resets in 14 days (Nov 1, 2023)</p>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-2xl font-extrabold text-slate-900 dark:text-white">1,248</span>
                                                <span className="text-sm font-medium text-slate-500"> / 5,000 invoices</span>
                                            </div>
                                        </div>
                                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 mb-2 overflow-hidden shadow-inner">
                                            <div className="bg-gradient-to-r from-blue-400 to-indigo-600 h-3 rounded-full relative transition-all duration-1000" style={{ width: '25%' }}>
                                            </div>
                                        </div>
                                        <p className="text-xs text-slate-500 text-right">25% used</p>
                                    </div>

                                    {/* Feature Comparison Table */}
                                    <div>
                                        <h4 className="font-bold text-slate-900 dark:text-white mb-4">Plan Features</h4>
                                        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                                            <table className="w-full text-left text-sm border-collapse min-w-[600px]">
                                                <thead className="bg-slate-50 dark:bg-slate-800/50">
                                                    <tr>
                                                        <th className="py-3 px-4 font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700">Features</th>
                                                        <th className="py-3 px-4 font-bold text-slate-500 border-b border-slate-200 dark:border-slate-700 text-center">Free</th>
                                                        <th className="py-3 px-4 font-bold text-primary dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/10 border-b border-slate-200 dark:border-slate-700 text-center">Growth (Current)</th>
                                                        <th className="py-3 px-4 font-bold text-slate-500 border-b border-slate-200 dark:border-slate-700 text-center">Enterprise</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                                                        <td className="py-3 px-4 text-slate-700 dark:text-slate-300 font-medium">Monthly Invoices</td>
                                                        <td className="py-3 px-4 text-center text-slate-500">100</td>
                                                        <td className="py-3 px-4 text-center font-bold text-slate-900 dark:text-white bg-blue-50/30 dark:bg-blue-900/5">5,000</td>
                                                        <td className="py-3 px-4 text-center text-slate-500">Unlimited</td>
                                                    </tr>
                                                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                                                        <td className="py-3 px-4 text-slate-700 dark:text-slate-300 font-medium">OCR Accuracy target</td>
                                                        <td className="py-3 px-4 text-center text-slate-500">95%</td>
                                                        <td className="py-3 px-4 text-center font-bold text-slate-900 dark:text-white bg-blue-50/30 dark:bg-blue-900/5">99.8%</td>
                                                        <td className="py-3 px-4 text-center text-slate-500">99.9% + Human Review</td>
                                                    </tr>
                                                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                                                        <td className="py-3 px-4 text-slate-700 dark:text-slate-300 font-medium">GSTR-1 JSON Export</td>
                                                        <td className="py-3 px-4 text-center text-slate-300 dark:text-slate-600"><span className="material-symbols-outlined text-[18px]">close</span></td>
                                                        <td className="py-3 px-4 text-center text-green-500 bg-blue-50/30 dark:bg-blue-900/5"><span className="material-symbols-outlined text-[18px]">check</span></td>
                                                        <td className="py-3 px-4 text-center text-green-500"><span className="material-symbols-outlined text-[18px]">check</span></td>
                                                    </tr>
                                                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                                                        <td className="py-3 px-4 text-slate-700 dark:text-slate-300 font-medium">API Access</td>
                                                        <td className="py-3 px-4 text-center text-slate-300 dark:text-slate-600"><span className="material-symbols-outlined text-[18px]">close</span></td>
                                                        <td className="py-3 px-4 text-center text-slate-300 dark:text-slate-600 bg-blue-50/30 dark:bg-blue-900/5"><span className="material-symbols-outlined text-[18px]">close</span></td>
                                                        <td className="py-3 px-4 text-center text-green-500"><span className="material-symbols-outlined text-[18px]">check</span></td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    {/* Payment Method */}
                                    <div>
                                        <h4 className="font-bold text-slate-900 dark:text-white mb-4">Payment Method</h4>
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 lg:w-2/3 shadow-sm">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-8 bg-white border border-slate-200 rounded flex items-center justify-center p-1 shadow-sm shrink-0">
                                                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" alt="Mastercard" className="h-full object-contain" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-bold text-slate-900 dark:text-white text-sm truncate">Mastercard ending in 4242</p>
                                                    <p className="text-xs text-slate-500 mt-0.5">Expires 12/26</p>
                                                </div>
                                            </div>
                                            <button type="button" onClick={() => { setSaveStatus({ show: true, message: 'Payment method editing is mocked in demo mode.', type: 'error' }); setTimeout(() => setSaveStatus({ show: false, message: '', type: 'success' }), 3000); }} className="w-full sm:w-auto text-sm font-bold text-primary hover:underline bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-lg sm:p-0 sm:bg-transparent sm:dark:bg-transparent">Edit</button>
                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>

                </div>
            </div>

        </AppLayout>
    );
};

export default Settings;
