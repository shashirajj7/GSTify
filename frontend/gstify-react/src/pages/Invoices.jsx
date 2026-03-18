import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import { getUserInvoices } from '../utils/storage';

const Invoices = () => {
    const navigate = useNavigate();
    const [invoices, setInvoices] = React.useState([]);

    React.useEffect(() => {
        const stored = getUserInvoices();
        if (stored && stored.length > 0) {
            setInvoices(stored);
        }
    }, []);

    const validInvoices = invoices.filter(inv => inv.status !== 'Flagged');
    const totalTaxSaved = validInvoices.reduce((acc, curr) => acc + (parseFloat(curr.taxAmount) || 0), 0);

    // GSTR-1 typically due by 11th of next month, we'll just mock days remaining for demo safely
    const daysRemaining = 30 - new Date().getDate();

    return (
        <AppLayout>

            <div className="flex-1 overflow-y-auto w-full p-4 md:p-8 lg:px-12">
                <div className="max-w-6xl mx-auto flex flex-col gap-8">

                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div className="flex flex-col gap-1">
                            <h2 className="text-slate-900 dark:text-white text-3xl font-extrabold tracking-tight">Invoice Management</h2>
                            <p className="text-secondary text-sm md:text-base">Upload and track your GST invoices efficiently.</p>
                        </div>
                        <div className="flex gap-3">
                            <Link to="/fraud-detection" className="flex items-center justify-center gap-2 rounded-lg h-10 px-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                                <span className="material-symbols-outlined text-[18px]">download</span>
                                <span>Export Report</span>
                            </Link>
                            <button onClick={() => navigate('/upload')} className="flex items-center justify-center gap-2 rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold hover:bg-blue-600 transition-colors shadow-sm shadow-blue-200 dark:shadow-none">
                                <span className="material-symbols-outlined text-[18px]">add</span>
                                <span>New Invoice</span>
                            </button>
                        </div>
                    </div>

                    {/* Recent Uploads Section */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-slate-900 dark:text-white text-xl font-bold">Recent Uploads</h3>
                            <Link className="text-primary text-sm font-bold hover:underline flex items-center gap-1" to="/validation">
                                View All
                                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {invoices.length === 0 ? (
                                <div className="col-span-full py-12 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                                    <span className="material-symbols-outlined text-4xl text-slate-400 mb-2">receipt_long</span>
                                    <p className="text-slate-500 font-medium">No invoices uploaded yet.</p>
                                    <button onClick={() => navigate('/upload')} className="mt-4 px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:bg-blue-600 transition-colors hidden md:inline-flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[18px]">add</span> Upload an Invoice
                                    </button>
                                </div>
                            ) : (
                                invoices.map((inv, idx) => (
                                    <div key={idx} className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col gap-4 cursor-pointer hover:border-primary transition-all hover:-translate-y-1 hover:shadow-md" onClick={() => navigate('/fraud-detection')}>
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${inv.status === 'Flagged' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'}`}>
                                                    <span className="material-symbols-outlined">receipt</span>
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <p className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-[150px]">{inv.invoiceNumber}</p>
                                                        {inv.isBatch && (
                                                            <span className="px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-400 text-[10px] font-bold uppercase tracking-wide border border-indigo-200 dark:border-indigo-800">
                                                                Batch ({inv.fileCount})
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-secondary">{inv.date} • ₹{(inv.taxableValue || 0).toLocaleString('en-IN')}</p>
                                                </div>
                                            </div>
                                            <div className="relative group">
                                                <button className="text-slate-400 hover:text-primary">
                                                    <span className="material-symbols-outlined text-[20px]">more_vert</span>
                                                </button>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center pt-2 mt-auto border-t border-slate-50 dark:border-slate-800">
                                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide flex items-center gap-1 ${inv.status === 'Flagged' ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-green-50 text-green-700 border border-green-100'}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${inv.status === 'Flagged' ? 'bg-red-500' : 'bg-green-500'}`}></span> {inv.status}
                                            </span>
                                            <button onClick={() => navigate('/validation')} className="flex items-center gap-1 text-xs font-bold text-primary hover:text-blue-700">
                                                View Details
                                                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Stats / Footer Area */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-8 mt-4">
                        <div className="bg-gradient-to-br from-white to-blue-50/20 dark:from-[#1A2632] dark:to-[#121A23] rounded-2xl p-6 flex items-center gap-5 border border-slate-200/60 dark:border-slate-800 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-900/5 group">
                            <div className="w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-900/40 shadow-sm flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-[28px]">data_usage</span>
                            </div>
                            <div>
                                <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Monthly Usage</p>
                                <p className="text-slate-900 dark:text-white text-2xl font-extrabold">{invoices.length} <span className="text-sm font-medium text-slate-500">/ 500</span></p>
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-white to-green-50/20 dark:from-[#1A2632] dark:to-[#121A23] rounded-2xl p-6 flex items-center gap-5 border border-slate-200/60 dark:border-slate-800 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-xl hover:shadow-green-900/5 group">
                            <div className="w-14 h-14 rounded-full bg-green-100 dark:bg-green-900/40 shadow-sm flex items-center justify-center text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-[28px]">savings</span>
                            </div>
                            <div>
                                <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Tax Validated</p>
                                <p className="text-slate-900 dark:text-white text-2xl font-extrabold">₹ {totalTaxSaved.toLocaleString('en-IN', { maximumFractionDigits: 0 })} <span className="text-sm font-medium text-slate-500">Total</span></p>
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-white to-orange-50/20 dark:from-[#1A2632] dark:to-[#121A23] rounded-2xl p-6 flex items-center gap-5 border border-slate-200/60 dark:border-slate-800 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-900/5 group">
                            <div className="w-14 h-14 rounded-full bg-orange-100 dark:bg-orange-900/40 shadow-sm flex items-center justify-center text-orange-500 dark:text-orange-400 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-[28px]">schedule</span>
                            </div>
                            <div>
                                <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Pending GSTR-1</p>
                                <p className="text-slate-900 dark:text-white text-2xl font-extrabold">{daysRemaining > 0 ? daysRemaining : '0'} Days <span className="text-sm font-medium text-slate-500">Left</span></p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </AppLayout>
    );
};

export default Invoices;
