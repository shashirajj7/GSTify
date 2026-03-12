import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';

const Export = () => {
    const [isExporting, setIsExporting] = useState(false);
    const [invoices, setInvoices] = useState([]);

    useEffect(() => {
        const stored = localStorage.getItem('approvedInvoices');
        if (stored) {
            setInvoices(JSON.parse(stored));
        }
    }, []);

    const handleDownloadCSV = () => {
        setIsExporting(true);
        setTimeout(() => {
            const headers = ['Invoice Number', 'Date', 'Customer GSTIN', 'Taxable Value', 'Tax Amount', 'Status'];
            const data = invoices.length > 0 ? invoices.flatMap(inv => {
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
            }) : [
                ['INV-2023-890', '20/10/2023', '27AABCT1234A1Z5', '150000.00', '27000.00', 'Validated'],
                ['INV-2023-892', '22/10/2023', '07BBDPY4321P1Z9', '210000.00', '37800.00', 'Validated']
            ];

            const csvContent = [
                headers.join(','),
                ...data.map(row => row.join(','))
            ].join('\n');

            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.setAttribute('href', url);
            link.setAttribute('download', 'GSTR1_B2B_Oct2023.csv');
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            setIsExporting(false);
        }, 1500);
    };

    return (
        <AppLayout>
            <div className="flex-1 overflow-y-auto w-full">
                <div className="max-w-7xl mx-auto p-6 lg:p-10 flex flex-col gap-8">

                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                        <div className="flex flex-col gap-1">
                            <h2 className="text-slate-900 dark:text-white text-3xl font-extrabold tracking-tight">GSTR-1 Export</h2>
                            <p className="text-secondary text-sm md:text-base">Generate offline tool compatible CSV/JSON for GST portal filing.</p>
                        </div>
                        <div className="flex gap-3">
                            <button className="flex items-center justify-center gap-2 rounded-lg h-10 px-4 bg-white dark:bg-[#1A2632] border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm">
                                <span className="material-symbols-outlined text-[18px]">history</span>
                                Export History
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* Checklist UI */}
                        <div className="lg:col-span-1 bg-white dark:bg-[#1A2632] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 max-h-fit">
                            <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">fact_check</span>
                                Pre-Export Checklist
                            </h3>

                            <div className="space-y-5">
                                <div className="flex items-start gap-3">
                                    <div className="w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center shrink-0 mt-0.5">
                                        <span className="material-symbols-outlined text-[14px] font-bold">check</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">All Invoices Validated</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{invoices.length} invoices have been validated and approved.</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className={`w-5 h-5 rounded-full text-white flex items-center justify-center shrink-0 mt-0.5 ${invoices.some(inv => inv.status === 'Flagged') ? 'bg-red-500' : 'bg-green-500'}`}>
                                        <span className="material-symbols-outlined text-[14px] font-bold">{invoices.some(inv => inv.status === 'Flagged') ? 'warning' : 'check'}</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">Fraud Checks Passed</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{invoices.filter(i => i.status === 'Flagged').length} active critical flags remaining.</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 text-primary flex items-center justify-center shrink-0 mt-0.5">
                                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">HSN Summary Generated</p>
                                        <p className="text-xs text-primary font-medium mt-1">Ready for export...</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Period</span>
                                    <span className="text-sm font-mono bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-900 dark:text-white">{new Date().toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}</span>
                                </div>
                                <div className="flex justify-between items-center mb-6">
                                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Total B2B Count</span>
                                    <span className="text-sm font-bold text-slate-900 dark:text-white">{invoices.length}</span>
                                </div>
                                <button
                                    onClick={handleDownloadCSV}
                                    disabled={isExporting}
                                    className="w-full h-12 flex items-center justify-center gap-2 bg-primary hover:bg-blue-600 active:bg-blue-700 text-white font-bold rounded-lg transition-all shadow-[0_4px_14px_0_rgba(19,127,236,0.39)] hover:shadow-[0_6px_20px_rgba(19,127,236,0.23)] disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isExporting ? (
                                        <><span className="material-symbols-outlined animate-spin">refresh</span> Packaging CSV...</>
                                    ) : (
                                        <><span className="material-symbols-outlined">download</span> Download GSTR-1 CSV</>
                                    )}
                                </button>
                                <p className="text-center text-[10px] text-slate-400 mt-3 font-medium uppercase tracking-widest">Govt Offline Tool Compatible</p>
                            </div>
                        </div>

                        {/* Preview Table */}
                        <div className="lg:col-span-2 bg-white dark:bg-[#1A2632] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
                            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-[#151f2a]/50">
                                <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[20px] text-primary">visibility</span>
                                    B2B Invoices Preview (b2b.csv)
                                </h3>
                                <div className="inline-flex items-center gap-1 bg-blue-50 dark:bg-blue-900/30 text-primary px-3 py-1 rounded-full text-xs font-bold border border-blue-100 dark:border-blue-800/50">
                                    Showing {Math.min(invoices.length, 10)} of {invoices.length}
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse whitespace-nowrap">
                                    <thead>
                                        <tr className="bg-slate-50 dark:bg-slate-800/50 text-xs font-bold text-slate-500 dark:text-slate-400 tracking-wider uppercase border-b border-slate-200 dark:border-slate-800">
                                            <th className="p-4">Invoice No</th>
                                            <th className="p-4">Date</th>
                                            <th className="p-4">Customer GSTIN</th>
                                            <th className="p-4 text-right">Taxable Value</th>
                                            <th className="p-4 text-center">Tax Amount</th>
                                            <th className="p-4 text-center">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm divide-y divide-slate-200 dark:divide-slate-800 font-mono">
                                        {invoices.length === 0 ? (
                                            <tr>
                                                <td colSpan="6" className="p-8 text-center text-slate-500 font-sans">No invoices ready for export.</td>
                                            </tr>
                                        ) : (
                                            invoices.slice(0, 10).map((inv, idx) => (
                                                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                                                    <td className="p-4 font-bold text-slate-700 dark:text-slate-300">{inv.invoiceNumber}</td>
                                                    <td className="p-4 text-slate-500">{inv.date}</td>
                                                    <td className="p-4 text-slate-700 dark:text-slate-300">{inv.customerGSTIN}</td>
                                                    <td className="p-4 text-right text-slate-700 dark:text-slate-300">₹ {(inv.taxableValue || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                                                    <td className="p-4 text-center text-slate-500">₹ {(inv.taxAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                                                    <td className="p-4 text-center text-slate-500">
                                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase ${inv.status === 'Flagged' ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400' : 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400'}`}>
                                                            {inv.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30 text-center">
                                <p className="text-xs text-slate-500 flex items-center justify-center gap-1">
                                    <span className="material-symbols-outlined text-[14px]">lock</span>
                                    Data formatted strictly as per GSTN Offline Tool ver 3.1.6
                                </p>
                            </div>
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

export default Export;
