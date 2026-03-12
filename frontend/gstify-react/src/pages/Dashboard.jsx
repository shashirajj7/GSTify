import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';

const Dashboard = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [greeting, setGreeting] = useState('Welcome back, Admin 👋');

    const [invoices, setInvoices] = useState([]);

    useEffect(() => {
        const userName = localStorage.getItem('userName') || 'Admin';
        const loginType = localStorage.getItem('loginType') || 'login';

        if (loginType === 'signup') {
            setGreeting(`Welcome, ${userName} 👋`);
        } else {
            setGreeting(`Welcome back, ${userName} 👋`);
        }

        const stored = localStorage.getItem('approvedInvoices');
        if (stored) {
            setInvoices(JSON.parse(stored));
        }
    }, []);

    // Derived Statistics
    const totalInvoices = invoices.length;
    const flaggedInvoicesCount = invoices.filter(inv => inv.status === 'Flagged').length;
    const compliantCount = totalInvoices - flaggedInvoicesCount;
    const complianceScore = totalInvoices > 0 ? Math.round((compliantCount / totalInvoices) * 100) : 100;
    const recentInvoices = [...invoices].reverse().slice(0, 5); // Newest first

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const reader = new FileReader();

            reader.onloadend = () => {
                localStorage.setItem('uploadedInvoiceImage', reader.result);
                localStorage.setItem('uploadedInvoiceName', file.name);
                navigate('/validation');
            };

            reader.readAsDataURL(file);
        }
    };

    return (
        <AppLayout>

            <div className="flex-1 overflow-y-auto w-full p-6 lg:p-10">
                <div className="max-w-7xl mx-auto flex flex-col gap-6">

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
                        <div className="flex flex-col gap-1">
                            <h2 className="text-slate-900 dark:text-white text-3xl font-extrabold tracking-tight">{greeting}</h2>
                            <p className="text-secondary text-sm md:text-base">Here is what's happening with your GST compliance today.</p>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => navigate('/upload')} className="flex items-center justify-center gap-2 rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold hover:bg-blue-600 transition-colors shadow-sm shadow-blue-200 dark:shadow-none">
                                <span className="material-symbols-outlined text-[18px]">add</span>
                                <span>New Invoice</span>
                            </button>
                        </div>
                    </div>

                    {/* 4 Stat Cards Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                        {/* Stat 1 */}
                        <div className="bg-gradient-to-br from-white to-blue-50/20 dark:from-[#1A2632] dark:to-[#121A23] rounded-2xl p-6 border border-slate-200/60 dark:border-slate-800 shadow-sm flex flex-col transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-blue-900/10 hover:border-blue-200 dark:hover:border-blue-800/50 group">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                    <span className="material-symbols-outlined text-[24px]">receipt_long</span>
                                </div>
                                <span className="text-[15px] font-bold text-slate-500 dark:text-slate-400">Total Invoices</span>
                            </div>
                            <div className="flex items-end justify-between mt-auto">
                                <h3 className="text-[44px] font-extrabold text-slate-900 dark:text-white leading-none tracking-tight">{totalInvoices}</h3>
                                {totalInvoices > 0 && (
                                    <span className="flex items-center text-[14px] font-bold text-green-600 mb-1">
                                        <span className="material-symbols-outlined text-[16px]">arrow_upward</span> {invoices.filter(i => i.date === new Date().toLocaleDateString('en-GB')).length} Today
                                    </span>
                                )}
                            </div>
                        </div>
                        {/* Stat 2 */}
                        <div className="bg-gradient-to-br from-white to-green-50/20 dark:from-[#1A2632] dark:to-[#121A23] rounded-2xl p-6 border border-slate-200/60 dark:border-slate-800 shadow-sm flex flex-col transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-green-900/10 hover:border-green-200 dark:hover:border-green-800/50 group">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                    <span className="material-symbols-outlined text-[24px]">check_circle</span>
                                </div>
                                <span className="text-[15px] font-bold text-slate-500 dark:text-slate-400">Compliance Score</span>
                            </div>
                            <div className="flex items-end justify-between mt-auto">
                                <h3 className="text-[44px] font-extrabold text-slate-900 dark:text-white leading-none tracking-tight">{complianceScore}%</h3>
                                <span className="flex items-center text-[14px] font-bold text-green-600 mb-1">
                                    <span className="material-symbols-outlined text-[16px]">trending_up</span> Stable
                                </span>
                            </div>
                        </div>
                        {/* Stat 3 */}
                        <div className="bg-gradient-to-br from-white to-red-50/20 dark:from-[#1A2632] dark:to-[#121A23] rounded-2xl p-6 border border-slate-200/60 dark:border-slate-800 shadow-sm flex flex-col transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-red-900/10 hover:border-red-200 dark:hover:border-red-800/50 group">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                    <span className="material-symbols-outlined text-[24px]">warning</span>
                                </div>
                                <span className="text-[15px] font-bold text-slate-500 dark:text-slate-400">Risk Alerts</span>
                            </div>
                            <div className="flex items-end justify-between mt-auto">
                                <h3 className="text-[44px] font-extrabold text-slate-900 dark:text-white leading-none tracking-tight">{flaggedInvoicesCount}</h3>
                                {flaggedInvoicesCount > 0 && (
                                    <span className="flex items-center text-[14px] font-bold text-red-500 mb-1">
                                        <span className="material-symbols-outlined text-[16px]">error</span> Action Needed
                                    </span>
                                )}
                            </div>
                        </div>
                        {/* Stat 4 */}
                        <div className="bg-gradient-to-br from-white to-purple-50/20 dark:from-[#1A2632] dark:to-[#121A23] rounded-2xl p-6 border border-slate-200/60 dark:border-slate-800 shadow-sm flex flex-col transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-purple-900/10 hover:border-purple-200 dark:hover:border-purple-800/50 group">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                    <span className="material-symbols-outlined text-[24px]">drive_folder_upload</span>
                                </div>
                                <span className="text-[15px] font-bold text-slate-500 dark:text-slate-400">Ready for Export</span>
                            </div>
                            <div className="flex items-end justify-between mt-auto">
                                <h3 className="text-[44px] font-extrabold text-slate-900 dark:text-white leading-none tracking-tight">{compliantCount}</h3>
                                <Link to="/export" className="flex items-center text-[14px] font-bold text-primary hover:underline mb-1">
                                    Review <span className="material-symbols-outlined text-[16px] ml-1">arrow_forward</span>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Middle Section: Chart and Activity */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-auto lg:h-[450px]">
                        {/* Left Table Box */}
                        <div className="bg-white dark:bg-[#1A2632] rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-lg shadow-slate-200/40 p-0 lg:col-span-2 flex flex-col overflow-hidden h-[450px]">
                            <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-[#1A2632] shrink-0 sticky top-0 z-20">
                                <div>
                                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">Recent Invoices</h3>
                                    <p className="text-xs text-slate-500">Live feed of processed documents</p>
                                </div>
                                <Link to="/invoices" className="text-xs text-primary font-bold hover:underline">View All</Link>
                            </div>

                            <div className="flex-1 overflow-y-auto overflow-x-auto relative">
                                <table className="w-full text-left border-collapse min-w-[700px]">
                                    <thead className="sticky top-0 bg-slate-50/95 dark:bg-[#151f2a]/95 backdrop-blur-md z-10 border-b border-slate-200 dark:border-slate-700">
                                        <tr className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-widest font-bold">
                                            <th className="py-4 px-6 flex-1 max-w-[150px]">Invoice No</th>
                                            <th className="py-4 px-6">Customer GSTIN</th>
                                            <th className="py-4 px-6 flex-1 min-w-[130px]">Date</th>
                                            <th className="py-4 px-6 text-right">Taxable</th>
                                            <th className="py-4 px-6 text-center">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm divide-y divide-slate-100 dark:divide-slate-800 border-t border-slate-200 dark:border-slate-700">
                                        {recentInvoices.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" className="py-12 px-6 text-center text-slate-500">
                                                    <div className="flex flex-col items-center gap-2">
                                                        <span className="material-symbols-outlined text-4xl text-slate-300 dark:text-slate-600">inbox</span>
                                                        <p className="font-medium text-slate-400 dark:text-slate-500">No recent invoices found.</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            recentInvoices.map((inv, idx) => (
                                                <tr key={idx} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group" onClick={() => navigate('/validation')}>
                                                    <td className="py-4 px-6 font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors max-w-[150px] truncate">{inv.invoiceNumber}</td>
                                                    <td className="py-4 px-6 font-mono text-xs text-slate-600 dark:text-slate-400">{inv.customerGSTIN}</td>
                                                    <td className="py-4 px-6 text-slate-600 dark:text-slate-400 min-w-[130px] truncate">{inv.date}</td>
                                                    <td className="py-4 px-6 font-medium text-slate-900 dark:text-white text-right">₹ {(inv.taxableValue || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                                                    <td className="py-4 px-6 text-center">
                                                        <span className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wide border shadow-sm transition-all ${inv.status === 'Flagged'
                                                            ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800/50 shadow-[0_0_8px_rgba(239,68,68,0.1)]'
                                                            : 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800/50 shadow-[0_0_8px_rgba(34,197,94,0.1)]'
                                                            }`}>
                                                            {inv.status === 'Flagged' ? (
                                                                <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span> Needs Review</span>
                                                            ) : (
                                                                <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Compliant</span>
                                                            )}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Right Activity Box */}
                        <div className="bg-white dark:bg-[#1A2632] rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-lg shadow-slate-200/40 p-0 flex flex-col h-[450px]">
                            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-[#1A2632] rounded-t-2xl shrink-0">
                                <h3 className="font-bold text-lg text-slate-900 dark:text-white">Recent Activity</h3>
                                <Link to="/invoices" className="text-xs text-primary font-bold hover:underline">View All</Link>
                            </div>
                            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">

                                {recentInvoices.length > 0 ? (
                                    recentInvoices.map((inv, idx) => (
                                        <div key={idx} className="flex gap-4 items-start relative group">
                                            {/* Timeline line visual (only if not last item) */}
                                            {idx !== recentInvoices.length - 1 && <div className="absolute left-[15px] top-[32px] w-[2px] h-[calc(100%+16px)] bg-slate-100 dark:bg-slate-800 z-0 group-hover:bg-slate-200 dark:group-hover:bg-slate-700 transition-colors"></div>}
                                            <div className={`w-8 h-8 rounded-full z-10 flex items-center justify-center shrink-0 border-2 border-white dark:border-[#1A2632] shadow-sm ${inv.status === 'Flagged' ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600'}`}>
                                                <span className="material-symbols-outlined text-[16px]">{inv.status === 'Flagged' ? 'error' : 'check'}</span>
                                            </div>
                                            <div className="pt-1 bg-white dark:bg-transparent pr-2">
                                                <p className="text-sm text-slate-900 dark:text-white font-medium leading-tight">
                                                    {inv.status === 'Flagged' ? 'Flagged ' : 'Validated '} <span className="font-bold">{inv.invoiceNumber}</span>.
                                                </p>
                                                <p className="text-xs text-slate-400 mt-1 font-medium">{inv.date}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full gap-2 text-slate-400">
                                        <span className="material-symbols-outlined text-[32px] opacity-50">history</span>
                                        <p className="text-sm font-medium">No activity to show</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-4 text-center border-t border-slate-200 dark:border-slate-800 pt-6 pb-2">
                        <p className="text-xs text-slate-500 dark:text-slate-500">
                            &copy; 2026 GSTify.AI. <Link to="/contact" className="text-primary hover:underline ml-2">Help &amp; Support</Link>
                        </p>
                    </div>

                </div>
            </div>
        </AppLayout>
    );
};

export default Dashboard;
