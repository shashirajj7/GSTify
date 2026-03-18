import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import CreditLimitModal from '../components/CreditLimitModal';
import { isLoggedIn, getGuestCredits, useGuestCredit, MAX_GUEST_CREDITS } from '../utils/credits';

const Upload = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [showCreditModal, setShowCreditModal] = useState(false);
    const [credits, setCredits] = useState(() => getGuestCredits());
    const [toastMessage, setToastMessage] = useState('');

    const showToast = (message) => {
        setToastMessage(message);
        setTimeout(() => setToastMessage(''), 4000);
    };

    const loggedIn = isLoggedIn();

    const simulateUpload = async (files) => {
        // Credit gate: only for guests
        if (!loggedIn) {
            const consumed = useGuestCredit();
            if (!consumed) {
                setShowCreditModal(true);
                return;
            }
            // Update displayed credit count after consuming
            setCredits(getGuestCredits());
        }

        setIsUploading(true);
        setUploadProgress(10); // Start at 10%

        // Read files and store images natively for preview
        if (files && files.length > 0) {
            const readFiles = Array.from(files).map((file) => {
                return new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result);
                    reader.readAsDataURL(file);
                });
            });

            Promise.all(readFiles).then((results) => {
                if (results.length > 0) {
                    localStorage.setItem('uploadedInvoiceImage', results[0]);
                    localStorage.setItem('uploadedInvoiceImages', JSON.stringify(results));
                }
                localStorage.setItem('uploadedInvoiceName', files.length > 1 ? `${files.length} Invoices Batch` : files[0].name);
                // Always stamp the exact date the user uploaded this invoice
                localStorage.setItem('invoiceUploadDate', new Date().toLocaleDateString('en-GB'));
            });
        }

        // Fake progress up to 90% while waiting for API
        const progressInterval = setInterval(() => {
            setUploadProgress(prev => {
                if (prev >= 90) return 90;
                return prev + Math.floor(Math.random() * 10) + 2;
            });
        }, 500);

        try {
            // Send actual request to API
            // Prioritize production URL from .env, fallback to dynamic local resolution
            const host = window.location.hostname === 'localhost' ? '127.0.0.1' : window.location.hostname;
            const baseUrl = import.meta.env.VITE_API_URL || `http://${host}:5000`;
            const formData = new FormData();
            let targetUrl = `${baseUrl}/api/process-multiple`;

            if (files.length === 1) {
                targetUrl = `${baseUrl}/api/process-invoice`;
                formData.append('file', files[0]);
            } else {
                Array.from(files).forEach(f => formData.append('files', f));
            }

            const response = await fetch(targetUrl, {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            clearInterval(progressInterval);
            setUploadProgress(100);

            if (response.ok && data.success) {
                // Save actual AI results
                localStorage.setItem('aiResult', JSON.stringify(data));

                setTimeout(() => {
                    navigate('/validation');
                }, 500);
            } else {
                showToast(`Error processing invoice: ${data.error || 'Unknown error'}`);
                setIsUploading(false);
                setUploadProgress(0);
            }
        } catch (error) {
            clearInterval(progressInterval);
            console.error("Upload failed", error);
            showToast("Failed to connect to the AI Agent API. The service might be sleeping or offline.");
            setIsUploading(false);
            setUploadProgress(0);
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            simulateUpload(e.target.files);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            simulateUpload(e.dataTransfer.files);
        }
    };

    // For guest: clicking on upload zone should first check credits
    const handleZoneClick = () => {
        if (!loggedIn && credits <= 0) {
            setShowCreditModal(true);
            return;
        }
        fileInputRef.current?.click();
    };

    return (
        <AppLayout>
            {/* Toast Notification */}
            {toastMessage && (
                <div className="fixed top-20 right-4 md:right-8 z-50 bg-red-600 text-white px-4 py-3 rounded-lg shadow-xl shadow-black/10 flex items-center gap-3 animate-in fade-in slide-in-from-top-10 duration-300 border border-white/20">
                    <span className="material-symbols-outlined">error</span>
                    <span className="font-bold text-sm">{toastMessage}</span>
                </div>
            )}
            
            {showCreditModal && (
                <CreditLimitModal onClose={() => setShowCreditModal(false)} />
            )}

            <div className="flex-1 overflow-y-auto w-full p-4 md:p-8 lg:px-12 flex flex-col justify-center items-center">
                <div className="w-full max-w-2xl bg-white dark:bg-[#1A2632] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 md:p-12">

                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">Upload Invoices</h2>
                        <p className="text-slate-500 text-sm">Upload standard GST formats for AI extraction and validation.</p>
                    </div>

                    {!isUploading ? (
                        <>
                            <div
                                className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all group cursor-pointer h-72 ${isDragging ? 'border-primary bg-blue-50/50 dark:bg-blue-900/20 scale-[1.02]' : 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 hover:border-primary hover:bg-blue-50/30 dark:hover:bg-slate-800/80'}`}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                onClick={handleZoneClick}
                            >
                                <input
                                    type="file"
                                    multiple
                                    className="hidden"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    accept=".jpg,.jpeg,.png,.pdf"
                                />
                                <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-inner">
                                    <span className="material-symbols-outlined text-primary text-4xl">cloud_upload</span>
                                </div>
                                <h3 className="text-slate-900 dark:text-white text-lg font-bold mb-2 text-center">Tap or Drag & Drop here</h3>
                                <p className="text-slate-500 text-sm mb-6 text-center">
                                    <span className="font-semibold text-slate-700 dark:text-slate-300">Supported Formats:</span> PDF, JPG, PNG (Max 5MB)
                                </p>
                                <button onClick={(e) => { e.stopPropagation(); handleZoneClick(); }} className="px-6 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm font-bold rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm">
                                    Browse Files
                                </button>
                            </div>

                            {/* Guest credit indicator */}
                            {!loggedIn && (
                                <div className={`mt-4 flex items-center justify-between px-4 py-3 rounded-xl border ${credits <= 1 ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' : 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800'}`}>
                                    <div className="flex items-center gap-2">
                                        <span className={`material-symbols-outlined text-[18px] ${credits <= 1 ? 'text-red-500' : 'text-amber-500'}`}>
                                            {credits <= 0 ? 'block' : 'bolt'}
                                        </span>
                                        <span className={`text-sm font-semibold ${credits <= 1 ? 'text-red-700 dark:text-red-400' : 'text-amber-700 dark:text-amber-400'}`}>
                                            {credits <= 0
                                                ? 'No demo credits left'
                                                : `${credits} of ${MAX_GUEST_CREDITS} free demo upload${credits !== 1 ? 's' : ''} remaining`}
                                        </span>
                                    </div>
                                    <Link to="/signup" className="text-xs font-bold text-primary hover:underline">
                                        Upgrade →
                                    </Link>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-72 border-2 border-transparent">
                            <div className="relative w-24 h-24 mb-8">
                                <svg className="w-full h-full animate-spin text-slate-200 dark:text-slate-700" viewBox="0 0 100 100">
                                    <circle className="stroke-current stroke-[8]" cx="50" cy="50" r="40" fill="none" />
                                </svg>
                                <svg className="w-full h-full absolute top-0 left-0 text-primary transition-all duration-300" viewBox="0 0 100 100">
                                    <circle
                                        className="stroke-current stroke-[8] origin-center -rotate-90 transition-all duration-300"
                                        cx="50"
                                        cy="50"
                                        r="40"
                                        fill="none"
                                        strokeDasharray="251.2"
                                        strokeDashoffset={251.2 - (251.2 * uploadProgress) / 100}
                                        strokeLinecap="round"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-xl font-bold text-slate-900 dark:text-white">{uploadProgress}%</span>
                                </div>
                            </div>
                            <h3 className="text-slate-900 dark:text-white text-lg font-bold mb-2 animate-pulse">Processing Documents...</h3>
                            <p className="text-slate-500 text-sm">AI Engine is extracting GST details</p>
                        </div>
                    )}

                </div>
            </div>
        </AppLayout>
    );
};

export default Upload;
