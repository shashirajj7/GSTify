import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const Pricing = () => {
    const [billingCycle, setBillingCycle] = useState('monthly');

    return (
        <div className="bg-background-light text-slate-900 font-display antialiased min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-1 flex flex-col items-center pt-24">
                {/* Hero / Heading */}
                <div className="w-full max-w-[1200px] px-6 py-16 flex flex-col items-center text-center gap-6">
                    <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-primary border border-blue-100">
                        <span className="material-symbols-outlined text-base">verified</span>
                        Trusted by 2000+ Businesses
                    </div>
                    <h1 className="text-slate-900 text-4xl md:text-5xl font-extrabold leading-tight tracking-tight max-w-3xl">
                        Simple, Transparent Pricing for Your GST Needs
                    </h1>
                    <p className="text-slate-600 text-lg font-medium leading-relaxed max-w-2xl">
                        Start for free, upgrade when you need power. No hidden fees, cancel anytime. Secured with bank-grade encryption.
                    </p>

                    {/* Toggle */}
                    <div className="flex items-center gap-2 mt-4 p-1 bg-slate-100 rounded-lg border border-slate-200">
                        <button
                            onClick={() => setBillingCycle('monthly')}
                            className={`px-4 py-2 rounded shadow-sm text-sm font-bold transition-colors ${billingCycle === 'monthly' ? 'bg-white text-slate-900' : 'bg-transparent text-slate-500 hover:text-slate-900'}`}
                        >
                            Monthly Billing
                        </button>
                        <button
                            onClick={() => setBillingCycle('annual')}
                            className={`px-4 py-2 rounded shadow-sm text-sm font-bold transition-colors ${billingCycle === 'annual' ? 'bg-white text-slate-900' : 'bg-transparent text-slate-500 hover:text-slate-900'}`}
                        >
                            Annual Billing <span className="text-green-600 text-xs ml-1 font-bold">-20%</span>
                        </button>
                    </div>
                </div>

                {/* Pricing Cards */}
                <div className="w-full max-w-[1200px] px-6 pb-20">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Starter Plan */}
                        <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-full h-1 bg-slate-200 group-hover:bg-slate-400 transition-colors"></div>
                            <div className="mb-6">
                                <h3 className="text-slate-900 text-lg font-bold mb-2">Starter</h3>
                                <p className="text-slate-500 text-sm mb-4">Perfect for freelancers and small businesses.</p>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-slate-900 text-4xl font-extrabold tracking-tight">Free</span>
                                    <span className="text-slate-500 text-base font-medium">/forever</span>
                                </div>
                            </div>
                            <Link to="/signup" className="flex items-center justify-center w-full h-12 rounded-xl bg-slate-100 text-slate-900 text-sm font-bold hover:bg-slate-200 transition-colors mb-8">
                                Get Started
                            </Link>
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-3 text-sm text-slate-600">
                                    <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
                                    Basic GST Filing (GSTR-1)
                                </div>
                                <div className="flex items-center gap-3 text-sm text-slate-600">
                                    <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
                                    Manual Excel Uploads
                                </div>
                                <div className="flex items-center gap-3 text-sm text-slate-600">
                                    <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
                                    Email Support
                                </div>
                                <div className="flex items-center gap-3 text-sm text-slate-600">
                                    <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
                                    Up to 100 Invoices/mo
                                </div>
                            </div>
                        </div>

                        {/* Pro Plan */}
                        <div className="flex flex-col rounded-2xl border-2 border-primary bg-white p-8 shadow-lg shadow-blue-100 relative overflow-hidden transform md:-mt-4 md:mb-4 z-10">
                            <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                                POPULAR
                            </div>
                            <div className="mb-6">
                                <h3 className="text-primary text-lg font-bold mb-2">Pro Business</h3>
                                <p className="text-slate-500 text-sm mb-4">For growing teams requiring automation.</p>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-slate-900 text-4xl font-extrabold tracking-tight">${billingCycle === 'annual' ? '23' : '29'}</span>
                                    <span className="text-slate-500 text-base font-medium">/month</span>
                                </div>
                            </div>
                            <Link to="/signup" className="flex items-center justify-center w-full h-12 rounded-xl bg-primary text-white text-sm font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-colors mb-8">
                                Start 14-Day Free Trial
                            </Link>
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-3 text-sm text-slate-900 font-medium">
                                    <span className="material-symbols-outlined text-primary text-[20px]">verified</span>
                                    <strong>Everything in Starter, plus:</strong>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-slate-600">
                                    <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
                                    Bulk Invoice Uploads
                                </div>
                                <div className="flex items-center gap-3 text-sm text-slate-600">
                                    <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
                                    Developer API Access
                                </div>
                                <div className="flex items-center gap-3 text-sm text-slate-600">
                                    <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
                                    Priority Chat Support
                                </div>
                                <div className="flex items-center gap-3 text-sm text-slate-600">
                                    <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
                                    Reconciliation Engine
                                </div>
                            </div>
                        </div>

                        {/* Enterprise Plan */}
                        <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-full h-1 bg-slate-200 group-hover:bg-primary transition-colors"></div>
                            <div className="mb-6">
                                <h3 className="text-slate-900 text-lg font-bold mb-2">Enterprise</h3>
                                <p className="text-slate-500 text-sm mb-4">Custom solutions for large organizations.</p>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-slate-900 text-4xl font-extrabold tracking-tight">$99+</span>
                                    <span className="text-slate-500 text-base font-medium">/month</span>
                                </div>
                            </div>
                            <Link to="/contact" className="flex items-center justify-center w-full h-12 rounded-xl bg-white border-2 border-slate-200 text-slate-900 text-sm font-bold hover:border-primary hover:text-primary transition-colors mb-8">
                                Contact Sales
                            </Link>
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-3 text-sm text-slate-600">
                                    <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
                                    Unlimited Invoices &amp; Users
                                </div>
                                <div className="flex items-center gap-3 text-sm text-slate-600">
                                    <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
                                    Custom ERP Integrations
                                </div>
                                <div className="flex items-center gap-3 text-sm text-slate-600">
                                    <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
                                    Dedicated Account Manager
                                </div>
                                <div className="flex items-center gap-3 text-sm text-slate-600">
                                    <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
                                    SLA &amp; Uptime Guarantees
                                </div>
                                <div className="flex items-center gap-3 text-sm text-slate-600">
                                    <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
                                    On-premise Deployment
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Security Section */}
                <div className="w-full bg-white border-t border-slate-100 py-20">
                    <div className="max-w-[1200px] mx-auto px-6">
                        <div className="flex flex-col md:flex-row gap-12 items-start">
                            <div className="md:w-1/3 sticky top-24">
                                <div className="inline-flex items-center gap-2 text-primary font-bold mb-4">
                                    <span className="material-symbols-outlined">security</span>
                                    Security First
                                </div>
                                <h2 className="text-slate-900 text-3xl font-extrabold leading-tight mb-4">
                                    Your Financial Data is Safe with Us
                                </h2>
                                <p className="text-slate-600 text-lg leading-relaxed mb-8">
                                    We employ bank-grade security measures to ensure your GST data remains private, protected, and compliant with all regulations.
                                </p>
                                <Link to="/contact" className="text-primary font-bold hover:underline inline-flex items-center gap-1">
                                    Read our Security Whitepaper
                                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                </Link>
                            </div>
                            <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {/* Feature 1 */}
                                <div className="p-6 rounded-xl bg-slate-50 border border-slate-100 hover:border-blue-100 hover:shadow-md transition-all">
                                    <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center text-primary mb-4">
                                        <span className="material-symbols-outlined">lock</span>
                                    </div>
                                    <h3 className="text-slate-900 text-lg font-bold mb-2">Encrypted Uploads</h3>
                                    <p className="text-slate-600 text-sm leading-relaxed">
                                        All files are encrypted in transit and at rest using industry-standard AES-256 encryption protocols.
                                    </p>
                                </div>
                                {/* Feature 2 */}
                                <div className="p-6 rounded-xl bg-slate-50 border border-slate-100 hover:border-blue-100 hover:shadow-md transition-all">
                                    <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center text-primary mb-4">
                                        <span className="material-symbols-outlined">shield_person</span>
                                    </div>
                                    <h3 className="text-slate-900 text-lg font-bold mb-2">Data Privacy Commitment</h3>
                                    <p className="text-slate-600 text-sm leading-relaxed">
                                        We strictly adhere to GDPR and local data privacy regulations. Your data is yours, and we never sell it.
                                    </p>
                                </div>
                                {/* Feature 3 */}
                                <div className="p-6 rounded-xl bg-slate-50 border border-slate-100 hover:border-blue-100 hover:shadow-md transition-all">
                                    <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center text-primary mb-4">
                                        <span className="material-symbols-outlined">auto_delete</span>
                                    </div>
                                    <h3 className="text-slate-900 text-lg font-bold mb-2">No Permanent Storage</h3>
                                    <p className="text-slate-600 text-sm leading-relaxed">
                                        Processed files can be configured to automatically delete from our servers 24 hours after processing.
                                    </p>
                                </div>
                                {/* Feature 4 */}
                                <div className="p-6 rounded-xl bg-slate-50 border border-slate-100 hover:border-blue-100 hover:shadow-md transition-all">
                                    <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center text-primary mb-4">
                                        <span className="material-symbols-outlined">admin_panel_settings</span>
                                    </div>
                                    <h3 className="text-slate-900 text-lg font-bold mb-2">Role-Based Access</h3>
                                    <p className="text-slate-600 text-sm leading-relaxed">
                                        Granular permissions ensure only authorized team members can view or edit sensitive financial records.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Roadmap Section */}
                <div className="w-full bg-slate-50 py-20 border-t border-slate-200">
                    <div className="max-w-[1000px] mx-auto px-6">
                        <div className="text-center mb-12">
                            <span className="text-primary font-bold tracking-wider uppercase text-sm">Coming Soon</span>
                            <h2 className="text-slate-900 text-3xl font-extrabold mt-2">Future Roadmap</h2>
                            <p className="text-slate-500 mt-2">We are constantly improving to serve you better.</p>
                        </div>
                        <div className="relative">
                            {/* Line */}
                            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-slate-300 -translate-x-1/2 hidden md:block"></div>
                            <div className="flex flex-col gap-12">
                                {/* Item 1 */}
                                <div className="flex flex-col md:flex-row items-center gap-8 relative">
                                    <div className="md:w-1/2 flex justify-end">
                                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 w-full md:max-w-md">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="material-symbols-outlined text-primary">cloud_sync</span>
                                                <h3 className="font-bold text-lg text-slate-900">Direct Portal Integration</h3>
                                            </div>
                                            <p className="text-slate-600 text-sm">Seamlessly push data directly to the government GST portal without manual JSON file downloads.</p>
                                            <div className="mt-3 inline-block px-2 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded">Q4 2023</div>
                                        </div>
                                    </div>
                                    <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-primary border-4 border-white shadow-sm hidden md:block"></div>
                                    <div className="md:w-1/2"></div>
                                </div>
                                {/* Item 2 */}
                                <div className="flex flex-col md:flex-row items-center gap-8 relative">
                                    <div className="md:w-1/2"></div>
                                    <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-slate-400 border-4 border-white shadow-sm hidden md:block"></div>
                                    <div className="md:w-1/2 flex justify-start">
                                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 w-full md:max-w-md opacity-75">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="material-symbols-outlined text-slate-500">account_balance_wallet</span>
                                                <h3 className="font-bold text-lg text-slate-900">Tally &amp; Zoho Integration</h3>
                                            </div>
                                            <p className="text-slate-600 text-sm">One-click sync with popular accounting software to automate your entire reconciliation workflow.</p>
                                            <div className="mt-3 inline-block px-2 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded">Q1 2024</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </main>

            <Footer />
        </div>
    );
};

export default Pricing;
