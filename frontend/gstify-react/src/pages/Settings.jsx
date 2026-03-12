import React, { useState, useEffect } from 'react';
import AppLayout from '../components/layout/AppLayout';

const Settings = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const [isAnnual, setIsAnnual] = useState(true);

    // User Profile State
    const [firstName, setFirstName] = useState('Business');
    const [lastName, setLastName] = useState('Admin');
    const [email, setEmail] = useState('admin@gstify.ai');

    useEffect(() => {
        const storedName = localStorage.getItem('userName');
        if (storedName) {
            // Simple split logic if it's a full name
            const nameParts = storedName.split(' ');
            setFirstName(nameParts[0]);
            if (nameParts.length > 1) {
                setLastName(nameParts.slice(1).join(' '));
            } else {
                setLastName('');
            }
            setEmail(`${storedName.toLowerCase().replace(/\s+/g, '')}@gstify.ai`);
        }
    }, []);

    return (
        <AppLayout>
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
                                            <div className="w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-bold flex items-center justify-center text-3xl border border-blue-200 dark:border-blue-800 shadow-sm relative group select-none">
                                                <span>{firstName ? firstName.charAt(0).toUpperCase() : 'A'}</span>
                                                <div className="absolute inset-0 bg-black/50 rounded-full hidden group-hover:flex items-center justify-center cursor-pointer transition-all">
                                                    <span className="material-symbols-outlined text-white text-[24px]">photo_camera</span>
                                                </div>
                                            </div>
                                            <div>
                                                <button className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-bold rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors mr-3">Change Photo</button>
                                                <button className="px-4 py-2 text-red-600 dark:text-red-400 text-sm font-bold hover:underline">Remove</button>
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
                                                <input type="text" defaultValue="GSTify.AI Pro Technologies" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex justify-end">
                                        <button className="px-6 py-2.5 bg-primary text-white text-sm font-bold rounded-lg hover:bg-blue-600 transition-colors shadow-md shadow-blue-500/20">Save Changes</button>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'security' && (
                                <div className="space-y-8 animate-in fade-in duration-300">
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Change Password</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Update your password associated with your account.</p>

                                        <div className="space-y-4 max-w-md">
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Current Password</label>
                                                <input type="password" placeholder="••••••••" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">New Password</label>
                                                <input type="password" placeholder="••••••••" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Confirm New Password</label>
                                                <input type="password" placeholder="••••••••" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex justify-end">
                                        <button className="px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-bold rounded-lg hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors">Update Password</button>
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
                                                <div>
                                                    <p className="font-bold text-slate-900 dark:text-white text-sm">GSTR-1 Deadlines</p>
                                                    <p className="text-xs text-slate-500 mt-1">Get reminded 3 days before filing deadline.</p>
                                                </div>
                                                <div className="relative inline-block w-10 mr-2 align-middle select-nones transition duration-200 ease-in">
                                                    <input type="checkbox" name="toggle" id="toggle1" className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 border-slate-300 appearance-none cursor-pointer transition-transform duration-200 ease-in-out cursor-pointer checked:bg-primary checked:translate-x-full checked:border-primary" defaultChecked />
                                                    <label htmlFor="toggle1" className="toggle-label block overflow-hidden h-5 rounded-full bg-slate-300 cursor-pointer"></label>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                                                <div>
                                                    <p className="font-bold text-slate-900 dark:text-white text-sm">Anomaly Detection Alerts</p>
                                                    <p className="text-xs text-slate-500 mt-1">Immediate email when GSTIN or Tax logic fails.</p>
                                                </div>
                                                <div className="relative inline-block w-10 mr-2 align-middle select-nones transition duration-200 ease-in">
                                                    <input type="checkbox" name="toggle" id="toggle2" className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 border-slate-300 appearance-none cursor-pointer transition-transform duration-200 ease-in-out cursor-pointer checked:bg-primary checked:translate-x-full checked:border-primary" defaultChecked />
                                                    <label htmlFor="toggle2" className="toggle-label block overflow-hidden h-5 rounded-full bg-slate-300 cursor-pointer"></label>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                                                <div>
                                                    <p className="font-bold text-slate-900 dark:text-white text-sm">Product Updates</p>
                                                    <p className="text-xs text-slate-500 mt-1">News about the latest AI models and features.</p>
                                                </div>
                                                <div className="relative inline-block w-10 mr-2 align-middle select-nones transition duration-200 ease-in">
                                                    <input type="checkbox" name="toggle" id="toggle3" className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 border-slate-300 appearance-none cursor-pointer transition-transform duration-200 ease-in-out cursor-pointer checked:bg-primary checked:translate-x-full checked:border-primary" />
                                                    <label htmlFor="toggle3" className="toggle-label block overflow-hidden h-5 rounded-full bg-slate-300 cursor-pointer"></label>
                                                </div>
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
                                        <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 lg:w-2/3 shadow-sm">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-8 bg-white border border-slate-200 rounded flex items-center justify-center p-1 shadow-sm">
                                                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" alt="Mastercard" className="h-full object-contain" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900 dark:text-white text-sm">Mastercard ending in 4242</p>
                                                    <p className="text-xs text-slate-500 mt-0.5">Expires 12/26</p>
                                                </div>
                                            </div>
                                            <button className="text-sm font-bold text-primary hover:underline">Edit</button>
                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>

                </div>
            </div>
            {/* Custom styles for toggles since Tailwind forms isn't installed */}
            <style dangerouslySetInnerHTML={{
                __html: `
                .toggle-checkbox:checked {
                    right: 0;
                    border-color: #137fec;
                }
                .toggle-checkbox:checked + .toggle-label {
                    background-color: #137fec;
                }
                .toggle-checkbox {
                    right: 20px;
                    z-index: 1;
                }
            `}} />
        </AppLayout>
    );
};

export default Settings;
