import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';

const Validation = () => {
    const navigate = useNavigate();

    const handleApprove = async () => {
        const existing = JSON.parse(localStorage.getItem('approvedInvoices') || '[]');
        const uploadDate = new Date().toLocaleDateString('en-GB'); // Date of upload

        if (aiData.is_multiple && aiData.invoices) {
            // Save as a single combined entry per user request but keep individual data
            const newBatchInvoice = {
                invoiceNumber: customBatchName || documentName,
                date: uploadDate,
                customerGSTIN: 'Multiple GSTINs',
                taxableValue: aiData.summary?.taxable_value || 0,
                taxAmount: (aiData.summary?.cgst || 0) + (aiData.summary?.sgst || 0) + (aiData.summary?.igst || 0),
                status: 'Validated',
                isBatch: true,
                fileCount: aiData.file_count || 0,
                invoices: aiData.invoices.map(inv => ({
                    invoiceNumber: inv.invoice_number || inv.filename || 'Unknown',
                    date: uploadDate, // Always use the upload date
                    customerGSTIN: inv.gstin || 'Unknown',
                    taxableValue: inv.taxable_value || 0,
                    taxAmount: (inv.cgst || 0) + (inv.sgst || 0) + (inv.igst || 0),
                    status: 'Validated',
                    filename: inv.filename
                }))
            };
            existing.push(newBatchInvoice);

            // Generate the final CSVs, injecting upload date for each invoice
            try {
                await fetch('http://localhost:5000/api/generate-csv', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        invoices: aiData.invoices.map(inv => ({ ...inv, date: uploadDate })),
                        batch_name: customBatchName || documentName
                    })
                });
            } catch (err) {
                console.error("Failed to generate CSV for batch", err);
            }

        } else {
            const newInvoice = {
                invoiceNumber: aiData.data?.invoice_number || documentName,
                date: uploadDate, // Always use the upload date
                customerGSTIN: aiData.data?.gstin || 'Unknown',
                taxableValue: aiData.data?.taxable_value || 0,
                taxAmount: (aiData.data?.cgst || 0) + (aiData.data?.sgst || 0) + (aiData.data?.igst || 0),
                status: 'Validated'
            };
            existing.push(newInvoice);
        }
        localStorage.setItem('approvedInvoices', JSON.stringify(existing));
        navigate('/fraud-detection');
    };


    // State to hold the uploaded image data
    const [uploadedImage, setUploadedImage] = useState(null);
    const [uploadedImages, setUploadedImages] = useState([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [documentName, setDocumentName] = useState('INV-2023-894.pdf');
    const [customBatchName, setCustomBatchName] = useState('');
    const [aiData, setAiData] = useState({
        success: false,
        confidence: 0,
        data: {}
    });

    useEffect(() => {
        const storedImage = localStorage.getItem('uploadedInvoiceImage');
        const storedImages = localStorage.getItem('uploadedInvoiceImages');
        const storedName = localStorage.getItem('uploadedInvoiceName');
        const storedAiResult = localStorage.getItem('aiResult');

        if (storedImages) {
            try {
                setUploadedImages(JSON.parse(storedImages));
            } catch (e) {
                console.error("Failed to parse multiple images", e);
            }
        }
        if (storedImage && !storedImages) {
            setUploadedImage(storedImage);
        }
        if (storedName) {
            setDocumentName(storedName);
        }
        if (storedAiResult) {
            try {
                setAiData(JSON.parse(storedAiResult));
            } catch (e) {
                console.error("Could not parse AI Result", e);
            }
        }
    }, []);

    const formatCurrency = (val) => {
        if (val === undefined || val === null) return "";
        if (typeof val === 'number') {
            return val.toLocaleString('en-IN', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
        }
        return val;
    }

    const isMultiple = aiData.is_multiple;
    const displayData = isMultiple ? (aiData.summary || {}) : (aiData.data || {});

    return (
        <AppLayout>

            {/* Sub-header / Actions */}
            <div className="bg-white dark:bg-[#1A2632] border-b border-slate-200 dark:border-slate-800 p-4 md:px-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0 z-10">
                <div className="flex items-center gap-3">
                    <Link to="/invoices" className="flex items-center justify-center size-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors">
                        <span className="material-symbols-outlined text-lg">arrow_back</span>
                    </Link>
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            {documentName}
                            <span className="px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-500 text-[10px] font-bold uppercase tracking-wide border border-yellow-200 dark:border-yellow-800/50">Needs Review</span>
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Uploaded recently</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button onClick={() => navigate('/dashboard')} className="flex items-center justify-center gap-2 rounded-lg h-9 px-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-red-600 dark:text-red-400 text-sm font-bold hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-200 dark:hover:border-red-800 transition-all">
                        <span className="material-symbols-outlined text-[18px]">flag</span>
                        Flag Issue
                    </button>
                    <button
                        onClick={handleApprove}
                        className="flex items-center justify-center gap-2 rounded-lg h-9 px-4 bg-primary hover:bg-blue-600 text-white text-sm font-bold transition-colors shadow-sm shadow-blue-500/20"
                    >
                        <span className="material-symbols-outlined text-[18px]">save</span>
                        Approve &amp; Save
                    </button>
                </div>
            </div>

            {/* Split View Container */}
            <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">

                {/* Left Panel: Document Viewer */}
                <div className="w-full lg:w-1/2 flex flex-col border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-[#0d141c] relative group min-h-[50vh] lg:min-h-0">
                    {/* Viewer Toolbar */}
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-slate-800/80 backdrop-blur-sm text-white px-4 py-2 rounded-full z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg hidden md:flex">
                        <button className="hover:text-primary transition-colors"><span className="material-symbols-outlined text-sm">remove</span></button>
                        <span className="text-xs font-medium w-8 text-center">85%</span>
                        <button className="hover:text-primary transition-colors"><span className="material-symbols-outlined text-sm">add</span></button>
                        <div className="w-px h-3 bg-white/20 mx-1"></div>
                        <button className="hover:text-primary transition-colors"><span className="material-symbols-outlined text-sm">crop_free</span></button>
                        <button className="hover:text-primary transition-colors"><span className="material-symbols-outlined text-sm">download</span></button>
                    </div>

                    {/* Document Image with Carousel if Multiple */}
                    <div className="flex-1 overflow-auto p-4 lg:p-8 flex items-start justify-center no-scrollbar relative">
                        <div className="bg-white shadow-xl rounded-sm w-full max-w-[600px] relative overflow-hidden flex items-center justify-center p-2 border border-slate-200 dark:border-slate-800" data-alt="Scanned invoice document preview">
                            <img
                                src={uploadedImages.length > 0 ? uploadedImages[currentImageIndex] : (uploadedImage || "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80")}
                                alt={`Uploaded Invoice Preview ${currentImageIndex + 1}`}
                                className="w-full h-auto object-contain rounded-sm"
                            />
                            {uploadedImages.length > 1 && (
                                <>
                                    <button
                                        onClick={() => setCurrentImageIndex(prev => prev > 0 ? prev - 1 : uploadedImages.length - 1)}
                                        className="absolute left-2 top-1/2 -translate-y-1/2 size-8 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-primary transition-colors z-10"
                                    >
                                        <span className="material-symbols-outlined text-sm">chevron_left</span>
                                    </button>
                                    <button
                                        onClick={() => setCurrentImageIndex(prev => prev < uploadedImages.length - 1 ? prev + 1 : 0)}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 size-8 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-primary transition-colors z-10"
                                    >
                                        <span className="material-symbols-outlined text-sm">chevron_right</span>
                                    </button>
                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/50 px-3 py-1.5 rounded-full z-10">
                                        {uploadedImages.map((_, idx) => (
                                            <div
                                                key={idx}
                                                onClick={() => setCurrentImageIndex(idx)}
                                                className={`size-2 rounded-full cursor-pointer transition-colors ${currentImageIndex === idx ? 'bg-primary' : 'bg-white/50'}`}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Panel: Extraction Data */}
                <div className="w-full lg:w-1/2 bg-white dark:bg-[#1A2632] flex flex-col overflow-hidden h-[50vh] lg:h-auto">
                    <div className="flex-1 overflow-y-auto p-4 lg:p-6">

                        {/* AI Summary Card */}
                        <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded-xl p-4 mb-6 flex items-start gap-4 shadow-sm">
                            <div className="size-10 rounded-full bg-white dark:bg-indigo-900 flex items-center justify-center shrink-0 text-indigo-600 dark:text-indigo-400 shadow-sm">
                                <span className="material-symbols-outlined">smart_toy</span>
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-slate-900 dark:text-white font-bold text-sm">AI Analysis Summary</h3>
                                    <div className="flex items-center gap-2">
                                        <div className="w-16 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                            <div className="h-full bg-emerald-500 rounded-full transition-all duration-1000" style={{ width: `${aiData.confidence || 0}%` }}></div>
                                        </div>
                                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{aiData.confidence}% Match</span>
                                    </div>
                                </div>
                                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed" dangerouslySetInnerHTML={{
                                    __html: isMultiple
                                        ? `Successfully processed a batch of <strong>${aiData.file_count || 0} invoices</strong>. Validated GSTINs and aggregated total tax values.`
                                        : `Successfully extracted data from the uploaded photo <strong>${documentName}</strong>. Validated GSTINs, extracted line items, and verified tax calculations based on the document text.`
                                }}></p>
                            </div>
                        </div>

                        {/* Custom Batch Name Input */}
                        {isMultiple && (
                            <div className="mb-6 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800/50 rounded-xl p-4 flex flex-col gap-2 shadow-sm">
                                <label className="text-sm font-bold text-yellow-800 dark:text-yellow-500 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[18px]">drive_file_rename_outline</span>
                                    Provide a Name for this Batch
                                </label>
                                <p className="text-xs text-yellow-700 dark:text-yellow-600/70 mb-1">
                                    Enter a custom name to label this collection of invoices in your records (e.g., "Q1 Travel Expenses").
                                </p>
                                <input
                                    type="text"
                                    placeholder="e.g. October 2023 Bulk"
                                    value={customBatchName}
                                    onChange={(e) => setCustomBatchName(e.target.value)}
                                    className="w-full bg-white dark:bg-[#0A1017] border border-yellow-300 dark:border-yellow-700/50 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 placeholder:text-slate-400"
                                />
                            </div>
                        )}

                        {/* Extraction Form */}
                        <div className="space-y-8">
                            {/* Section: Parties */}
                            <section>
                                <h4 className="text-slate-400 dark:text-slate-500 uppercase tracking-wider text-xs font-bold mb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-sm">handshake</span> Parties Involved
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">

                                    {/* Seller Info */}
                                    <div className="bg-background-light dark:bg-background-dark p-4 rounded-lg border border-slate-200 dark:border-slate-700 relative group/field">
                                        <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Seller Name</label>
                                        <input className="bg-transparent border-none p-0 text-slate-900 dark:text-white font-semibold w-full focus:ring-0 text-sm" type="text" defaultValue={isMultiple ? "Multiple Sellers" : "Extracted Vendor"} />
                                        <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                                            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Seller GSTIN</label>
                                            <div className="flex items-center gap-2">
                                                <input className="bg-transparent border-none p-0 text-slate-900 dark:text-white font-mono font-medium w-full focus:ring-0 text-sm" type="text" value={isMultiple ? "Multiple GSTINs" : (displayData.gstin || "")} />
                                                <span className="shrink-0 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400 uppercase tracking-wide">
                                                    Active
                                                </span>
                                            </div>
                                        </div>
                                        <div className="absolute top-2 right-2 opacity-0 group-hover/field:opacity-100 transition-opacity cursor-pointer text-slate-400 hover:text-primary">
                                            <span className="material-symbols-outlined text-sm">edit</span>
                                        </div>
                                    </div>

                                    {/* Buyer Info */}
                                    <div className="bg-background-light dark:bg-background-dark p-4 rounded-lg border border-slate-200 dark:border-slate-700 relative group/field opacity-60">
                                        <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Buyer Name</label>
                                        <input className="bg-transparent border-none p-0 text-slate-900 dark:text-white font-semibold w-full focus:ring-0 text-sm" type="text" defaultValue="Self / My Company" />
                                        <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                                            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Buyer GSTIN</label>
                                            <div className="flex items-center gap-2">
                                                <input className="bg-transparent border-none p-0 text-slate-900 dark:text-white font-mono font-medium w-full focus:ring-0 text-sm" type="text" defaultValue="" placeholder="Not Extracted" />
                                            </div>
                                        </div>
                                        <div className="absolute top-2 right-2 opacity-0 group-hover/field:opacity-100 transition-opacity cursor-pointer text-slate-400 hover:text-primary">
                                            <span className="material-symbols-outlined text-sm">edit</span>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Section: Invoice Details */}
                            <section>
                                <h4 className="text-slate-400 dark:text-slate-500 uppercase tracking-wider text-xs font-bold mb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-sm">receipt_long</span> Invoice Details
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="group relative">
                                        <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">Invoice Number</label>
                                        <div className="flex items-center rounded-lg bg-background-light dark:bg-background-dark border border-slate-200 dark:border-slate-700 focus-within:ring-2 focus-within:ring-primary focus-within:border-primary transition-all overflow-hidden">
                                            <input className="w-full bg-transparent border-none text-sm text-slate-900 dark:text-white font-medium focus:ring-0 px-3 py-2.5 outline-none" type="text" value={isMultiple ? "Batch Upload" : (displayData.invoice_number || "")} placeholder={isMultiple ? "" : "Not Extracted"} />
                                        </div>
                                    </div>
                                    <div className="group relative">
                                        <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">Invoice Date</label>
                                        <div className="flex items-center rounded-lg bg-background-light dark:bg-background-dark border border-slate-200 dark:border-slate-700 focus-within:ring-2 focus-within:ring-primary focus-within:border-primary transition-all overflow-hidden">
                                            <span className="pl-3 text-slate-400 material-symbols-outlined text-sm">calendar_today</span>
                                            <input className="w-full bg-transparent border-none text-sm text-slate-900 dark:text-white font-medium focus:ring-0 px-3 py-2.5 outline-none" type="text" value={isMultiple ? "Multiple Dates" : (displayData.date || "")} placeholder={isMultiple ? "" : "Not Extracted"} />
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Section: Financials */}
                            <section>
                                <h4 className="text-slate-400 dark:text-slate-500 uppercase tracking-wider text-xs font-bold mb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-sm">payments</span> Financial Breakdown
                                </h4>
                                <div className="bg-background-light dark:bg-background-dark rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                                    <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
                                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Description</span>
                                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase text-right">Amount (INR)</span>
                                    </div>
                                    <div className="p-4 space-y-4">
                                        {/* Taxable Value */}
                                        <div className="flex justify-between items-center group">
                                            <label className="text-sm font-medium text-slate-600 dark:text-slate-300">Taxable Value</label>
                                            <div className="relative">
                                                <input className="text-right bg-transparent border-b border-transparent hover:border-slate-300 focus:border-primary text-slate-900 dark:text-white font-semibold text-sm w-24 sm:w-32 focus:ring-0 outline-none transition-colors" type="text" value={formatCurrency(displayData.taxable_value)} />
                                            </div>
                                        </div>
                                        {/* CGST */}
                                        <div className="flex justify-between items-center group">
                                            <div className="flex items-center gap-2">
                                                <label className="text-sm font-medium text-slate-600 dark:text-slate-300">CGST</label>
                                                {displayData.cgst > 0 && (
                                                    <span className="size-4 rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 flex flex-col items-center justify-center" title="Calculated Match">
                                                        <span className="material-symbols-outlined text-[10px]">check</span>
                                                    </span>
                                                )}
                                            </div>
                                            <div className="relative">
                                                <input className="text-right bg-transparent border-b border-transparent hover:border-slate-300 focus:border-primary text-slate-700 dark:text-slate-200 font-mono text-sm w-24 sm:w-32 outline-none focus:ring-0 transition-colors" type="text" value={formatCurrency(displayData.cgst)} />
                                            </div>
                                        </div>
                                        {/* SGST */}
                                        <div className="flex justify-between items-center group">
                                            <div className="flex items-center gap-2">
                                                <label className="text-sm font-medium text-slate-600 dark:text-slate-300">SGST</label>
                                                {displayData.sgst > 0 && (
                                                    <span className="size-4 rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 flex flex-col items-center justify-center" title="Calculated Match">
                                                        <span className="material-symbols-outlined text-[10px]">check</span>
                                                    </span>
                                                )}
                                            </div>
                                            <div className="relative">
                                                <input className="text-right bg-transparent border-b border-transparent hover:border-slate-300 focus:border-primary text-slate-700 dark:text-slate-200 font-mono text-sm w-24 sm:w-32 outline-none focus:ring-0 transition-colors" type="text" value={formatCurrency(displayData.sgst)} />
                                            </div>
                                        </div>
                                        {/* IGST (Disabled style) */}
                                        <div className="flex justify-between items-center group opacity-50">
                                            <label className="text-sm font-medium text-slate-600 dark:text-slate-300">IGST</label>
                                            <div className="relative">
                                                <input className="text-right bg-transparent border-none text-slate-500 dark:text-slate-400 font-mono text-sm w-24 sm:w-32 focus:ring-0" disabled type="text" value={formatCurrency(displayData.igst)} />
                                            </div>
                                        </div>
                                    </div>
                                    {/* Total */}
                                    <div className="bg-primary/5 dark:bg-primary/10 p-4 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                                        <div className="flex items-center gap-2">
                                            <label className="text-base font-bold text-slate-900 dark:text-white">Total Amount</label>
                                            {displayData.total_value !== null && displayData.total_value !== undefined && (
                                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400 uppercase tracking-wide border border-green-200 dark:border-green-800">
                                                    Extracted
                                                </span>
                                            )}
                                        </div>
                                        <input className="text-left sm:text-right bg-transparent border-none text-primary font-bold text-xl w-full sm:w-48 focus:ring-0 outline-none" type="text" value={displayData.total_value != null ? `₹ ${formatCurrency(displayData.total_value)}` : ""} placeholder="Not Extracted" />
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Footer Actions mobile only */}
                        <div className="lg:hidden mt-8 flex flex-col gap-3">
                            <button
                                onClick={handleApprove}
                                className="w-full flex items-center justify-center rounded-lg h-12 bg-primary text-white font-bold text-sm shadow-md"
                            >
                                Approve Invoice
                            </button>
                            <button onClick={() => navigate('/dashboard')} className="w-full flex items-center justify-center rounded-lg h-12 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold text-sm">
                                Flag for Review
                            </button>
                        </div>
                        <div className="h-10"></div> {/* Spacer */}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default Validation;
