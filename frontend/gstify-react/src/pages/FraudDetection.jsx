import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';

const FraudDetection = () => {
    const navigate = useNavigate();
    const [invoices, setInvoices] = useState([]);
    const [editingIdx, setEditingIdx] = useState(null);
    const [editData, setEditData] = useState(null);

    useEffect(() => {
        const stored = localStorage.getItem('approvedInvoices');
        if (stored) {
            setInvoices(JSON.parse(stored));
        }
    }, []);

    const handleDelete = (index) => {
        const updated = invoices.filter((_, i) => i !== index);
        setInvoices(updated);
        localStorage.setItem('approvedInvoices', JSON.stringify(updated));
    };

    const handleEdit = (index, inv) => {
        setEditingIdx(index);
        setEditData({ ...inv });
    };

    const handleSaveEdit = (index) => {
        const updated = [...invoices];
        updated[index] = { ...editData };
        setInvoices(updated);
        localStorage.setItem('approvedInvoices', JSON.stringify(updated));
        setEditingIdx(null);
        setEditData(null);
    };

    const handleCancelEdit = () => {
        setEditingIdx(null);
        setEditData(null);
    };

    const handleDismissFlag = (originalIdx) => {
        const updated = [...invoices];
        updated[originalIdx] = { ...updated[originalIdx], status: 'Validated' };
        setInvoices(updated);
        localStorage.setItem('approvedInvoices', JSON.stringify(updated));
    };

    const flaggedInvoices = invoices
        .map((inv, index) => ({ ...inv, originalIndex: index }))
        .filter(inv => inv.status === 'Flagged');


    const downloadCSVData = (invoicesToDownload, filename) => {
        const headers = ['Invoice Number', 'Date', 'Customer GSTIN', 'Taxable Value', 'Tax Amount', 'Status'];
        const data = invoicesToDownload.flatMap(inv => {
            if (inv.isBatch && inv.invoices) {
                return inv.invoices.map(subInv => [
                    subInv.invoiceNumber,
                    subInv.date,
                    subInv.customerGSTIN,
                    subInv.taxableValue,
                    subInv.taxAmount,
                    subInv.status
                ]);
            }
            return [[
                inv.invoiceNumber,
                inv.date,
                inv.customerGSTIN,
                inv.taxableValue,
                inv.taxAmount,
                inv.status
            ]];
        });

        const csvContent = [
            headers.join(','),
            ...data.map(row => row.join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleDownloadAllCSV = () => {
        downloadCSVData(invoices, 'gstr1_draft_all.csv');
    };

    const totalTaxableValue = invoices.reduce((sum, inv) => sum + (parseFloat(inv.taxableValue) || 0), 0);
    const totalTaxAmount = invoices.reduce((sum, inv) => sum + (parseFloat(inv.taxAmount) || 0), 0);


    return (
        <AppLayout>

            <div className="flex-1 overflow-y-auto w-full">
                <div className="max-w-7xl mx-auto p-6 lg:p-10 flex flex-col gap-6">

                    {/* Title Bar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
                        <div>
                            <h2 className="text-slate-900 dark:text-white text-2xl font-bold tracking-tight flex items-center gap-3">
                                Fraud Detection & Compliance
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400 border border-green-200 dark:border-green-800">
                                    <span className="size-2 rounded-full bg-green-500 relative">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    </span>
                                    System Operational
                                </span>
                            </h2>
                            <p className="text-secondary text-sm mt-1">AI-powered risk auditing and draft generation for your current month.</p>
                        </div>
                    </div>

                    {/* Risk Overview Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Risk Meter Component */}
                        <div className="bg-white dark:bg-[#1A2632] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 lg:col-span-1 flex flex-col justify-between relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 dark:bg-green-500/10 rounded-bl-full pointer-events-none"></div>
                            <div>
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="font-bold text-slate-900 dark:text-white">Overall Risk Meter</h3>
                                    <span className="material-symbols-outlined text-green-500 bg-green-50 dark:bg-green-900/20 p-1.5 rounded-lg">health_and_safety</span>
                                </div>

                                <div className="flex flex-col items-center justify-center py-4">
                                    <div className="relative w-40 h-20 overflow-hidden mb-2">
                                        {/* Semi-circle background */}
                                        <div className="absolute top-0 left-0 w-40 h-40 rounded-full border-[16px] border-slate-100 dark:border-slate-800 box-border"></div>
                                        {/* Semi-circle gradient fill representing 'Low' risk (e.g. 15%) */}
                                        <div className="absolute top-0 left-0 w-40 h-40 rounded-full border-[16px] border-transparent border-t-green-500 border-r-green-500 box-border rotate-[-135deg] transition-transform duration-1000 shadow-[0_0_15px_rgba(34,197,94,0.5)]"></div>
                                    </div>
                                    <div className="text-center -mt-6 bg-white dark:bg-[#1A2632] px-4 rounded-full">
                                        <h2 className="text-3xl font-extrabold text-green-500 drop-shadow-sm">Low</h2>
                                        <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mt-1">15/100 Score</p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-center flex justify-between">
                                <div className="text-center">
                                    <p className="text-xl font-bold text-slate-900 dark:text-white">1,248</p>
                                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Processed</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xl font-bold text-amber-500">2</p>
                                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Flagged</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xl font-bold text-green-500">98%</p>
                                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Compliant</p>
                                </div>
                            </div>
                        </div>

                        {/* Flag List with Severity Tags */}
                        <div className="bg-white dark:bg-[#1A2632] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-0 lg:col-span-2 flex flex-col">
                            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                                <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <span className="material-symbols-outlined text-amber-500 text-[20px]">flag</span>
                                    Recent Anomalies &amp; Flags
                                </h3>
                                <button className="text-xs text-primary font-bold hover:underline">View History</button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
                                {flaggedInvoices.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full text-slate-500 dark:text-slate-400 py-8">
                                        <span className="material-symbols-outlined text-4xl mb-2 opacity-50">check_circle</span>
                                        <p className="font-medium text-sm">No recent anomalies detected.</p>
                                    </div>
                                ) : (
                                    flaggedInvoices.map((flaggedInv, idx) => (
                                        <div key={idx} className="flex items-start gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-800/30 hover:bg-white dark:hover:bg-slate-800 transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-700 hover:shadow-md">
                                            <div className="mt-0.5 shrink-0">
                                                <span className="material-symbols-outlined text-amber-500 bg-amber-100 dark:bg-amber-900/30 p-2 rounded-lg text-[20px] shadow-inner">warning</span>
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-1">
                                                    <p className="text-sm font-bold text-slate-900 dark:text-white">Review Required</p>
                                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 uppercase tracking-widest border border-amber-200 dark:border-amber-800/50 shadow-[0_0_8px_rgba(245,158,11,0.2)]">Medium</span>
                                                </div>
                                                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">Invoice <span className="font-mono font-medium text-slate-800 dark:text-slate-200 bg-slate-200 dark:bg-slate-700 px-1 rounded">{flaggedInv.invoiceNumber || 'Unknown'}</span> was automatically flagged by the system for review.</p>
                                                <div className="flex gap-4">
                                                    <button onClick={() => handleEdit(flaggedInv.originalIndex, invoices[flaggedInv.originalIndex])} className="text-xs font-bold text-primary hover:text-blue-700 transition-colors flex items-center gap-1 group">
                                                        Review Invoice <span className="material-symbols-outlined text-[14px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                                    </button>
                                                    <button onClick={() => handleDismissFlag(flaggedInv.originalIndex)} className="text-xs font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">cancel</span> Dismiss</button>
                                                    <button onClick={() => handleDelete(flaggedInv.originalIndex)} className="text-xs font-bold text-red-500 hover:text-red-700 transition-colors flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">delete</span> Delete</button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Invoice Table (Draft Generator) */}
                    <div className="bg-white dark:bg-[#1A2632] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
                        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">table_view</span> GSTR-1 Draft Generator
                            </h3>
                            <div className="flex gap-3 w-full sm:w-auto">
                                <button onClick={handleDownloadAllCSV} className="flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-lg h-9 px-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                                    <span className="material-symbols-outlined text-[18px]">download</span>
                                    Download CSV
                                </button>
                                <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-lg h-9 px-4 bg-primary text-white text-sm font-bold hover:bg-blue-600 transition-colors shadow-sm">
                                    <span className="material-symbols-outlined text-[18px]">rocket_launch</span>
                                    Generate Draft
                                </button>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 dark:bg-slate-800/50 text-xs font-bold text-slate-500 dark:text-slate-300 tracking-wider uppercase border-b border-slate-200 dark:border-slate-700">
                                        <th className="p-4 w-12"><input type="checkbox" className="rounded border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-primary focus:ring-primary" defaultChecked /></th>
                                        <th className="p-4">Invoice #</th>
                                        <th className="p-4">Date</th>
                                        <th className="p-4">Customer GSTIN</th>
                                        <th className="p-4 text-right">Taxable Value</th>
                                        <th className="p-4 text-right">Tax (IGST/CGST)</th>
                                        <th className="p-4 text-center">Status</th>
                                        <th className="p-4 text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm divide-y divide-slate-200 dark:divide-slate-800">
                                    {invoices.length === 0 ? (
                                        <tr>
                                            <td colSpan="8" className="p-8 text-center text-slate-500 dark:text-slate-400">
                                                No drafted invoices yet. Upload and approve invoices to see them here.
                                            </td>
                                        </tr>
                                    ) : (
                                        invoices.map((inv, idx) => (
                                            <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group">
                                                <td className="p-4"><input type="checkbox" className="rounded border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-primary focus:ring-primary" defaultChecked /></td>

                                                {editingIdx === idx ? (
                                                    <>
                                                        <td className="p-4"><input type="text" className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2 py-1 text-sm text-slate-900 dark:text-white" value={editData.invoiceNumber} onChange={(e) => setEditData({ ...editData, invoiceNumber: e.target.value })} /></td>
                                                        <td className="p-4"><input type="text" className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2 py-1 text-sm text-slate-900 dark:text-white" value={editData.date} onChange={(e) => setEditData({ ...editData, date: e.target.value })} /></td>
                                                        <td className="p-4"><input type="text" className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2 py-1 text-sm text-slate-900 dark:text-white font-mono" value={editData.customerGSTIN} onChange={(e) => setEditData({ ...editData, customerGSTIN: e.target.value })} /></td>
                                                        <td className="p-4"><input type="number" className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2 py-1 text-sm text-slate-900 dark:text-white text-right" value={editData.taxableValue} onChange={(e) => setEditData({ ...editData, taxableValue: parseFloat(e.target.value) || 0 })} /></td>
                                                        <td className="p-4"><input type="number" className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2 py-1 text-sm text-slate-900 dark:text-white text-right" value={editData.taxAmount} onChange={(e) => setEditData({ ...editData, taxAmount: parseFloat(e.target.value) || 0 })} /></td>
                                                        <td className="p-4 text-center">
                                                            <select className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2 py-1 text-[10px] font-bold uppercase text-slate-900 dark:text-white" value={editData.status} onChange={(e) => setEditData({ ...editData, status: e.target.value })}>
                                                                <option value="Validated">Validated</option>
                                                                <option value="Flagged">Flagged</option>
                                                            </select>
                                                        </td>
                                                        <td className="p-4 text-center">
                                                            <div className="flex items-center justify-center gap-2">
                                                                <button onClick={() => handleSaveEdit(idx)} className="text-green-500 dark:text-green-400 hover:text-green-600 dark:hover:text-green-300 transition-colors" title="Save"><span className="material-symbols-outlined text-[18px]">check_circle</span></button>
                                                                <button onClick={handleCancelEdit} className="text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 transition-colors" title="Cancel"><span className="material-symbols-outlined text-[18px]">cancel</span></button>
                                                            </div>
                                                        </td>
                                                    </>
                                                ) : (
                                                    <>
                                                        <td className="p-4 font-bold text-slate-900 dark:text-white">{inv.invoiceNumber}</td>
                                                        <td className="p-4 text-slate-600 dark:text-slate-200">{inv.date}</td>
                                                        <td className="p-4 font-mono text-slate-600 dark:text-slate-200">{inv.customerGSTIN}</td>
                                                        <td className="p-4 text-right font-medium text-slate-900 dark:text-white">₹ {(inv.taxableValue || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                                                        <td className="p-4 text-right font-medium text-slate-500 dark:text-slate-200">₹ {(inv.taxAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                                                        <td className="p-4 text-center">
                                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase ${inv.status === 'Flagged' ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400' : 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400'}`}>
                                                                {inv.status}
                                                            </span>
                                                        </td>
                                                        <td className="p-4 text-center">
                                                            <div className="flex items-center justify-center gap-2 transition-opacity">
                                                                <button onClick={() => downloadCSVData([inv], `gstr1_${inv.invoiceNumber || 'draft'}.csv`)} className="text-slate-400 dark:text-slate-500 hover:text-blue-500 dark:hover:text-blue-400 transition-colors" title="Download CSV"><span className="material-symbols-outlined text-[18px]">download</span></button>
                                                                <button onClick={() => handleEdit(idx, inv)} className="text-slate-400 dark:text-slate-500 hover:text-primary dark:hover:text-blue-400 transition-colors" title="Edit"><span className="material-symbols-outlined text-[18px]">edit</span></button>
                                                                <button onClick={() => handleDelete(idx)} className="text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 transition-colors" title="Delete"><span className="material-symbols-outlined text-[18px]">delete</span></button>
                                                            </div>
                                                        </td>
                                                    </>
                                                )}
                                            </tr>
                                        ))
                                    )}
                                    {invoices.length > 0 && editingIdx === null && (
                                        <tr className="bg-slate-100 dark:bg-slate-800/80 font-bold border-t-2 border-slate-300 dark:border-slate-600">
                                            <td colSpan="4" className="p-4 text-right text-slate-900 dark:text-white uppercase tracking-wider">Total:</td>
                                            <td className="p-4 text-right text-slate-900 dark:text-white text-base">₹ {totalTaxableValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                                            <td className="p-4 text-right text-slate-900 dark:text-white text-base">₹ {totalTaxAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                                            <td colSpan="2" className="p-4"></td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* AI Advisory Banner */}
                    <div className="mt-4 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-lg relative overflow-hidden">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                        <div className="flex items-start gap-4 relative z-10 w-full">
                            <div className="bg-white/20 p-2 rounded-lg shrink-0">
                                <span className="material-symbols-outlined text-white text-3xl">auto_awesome</span>
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="text-white font-bold text-lg">AI Assistant Beta</h3>
                                    <span className="px-2 py-0.5 bg-yellow-400 text-yellow-900 text-[10px] font-bold uppercase rounded-full tracking-wide">Coming Soon</span>
                                </div>
                                <p className="text-blue-100 text-sm max-w-2xl leading-relaxed">
                                    Our next update will introduce automated AI-driven replies to tax notices and intelligent tax saving recommendations based on your input claims.
                                </p>
                            </div>
                            <button onClick={() => navigate('/contact')} className="hidden sm:flex self-center px-4 py-2 bg-white text-indigo-700 font-bold text-sm rounded-lg hover:bg-blue-50 transition-colors shadow-sm whitespace-nowrap">
                                Join Waitlist
                            </button>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-8 text-center border-t border-slate-200 dark:border-slate-800 pt-6 pb-2">
                        <p className="text-xs text-slate-500 dark:text-slate-500">
                            &copy; 2026 GSTify.AI. All operations are logged. <Link to="/contact" className="text-primary hover:underline ml-2">Help &amp; Support</Link>
                        </p>
                    </div>

                </div>
            </div>
        </AppLayout>
    );
};

export default FraudDetection;
