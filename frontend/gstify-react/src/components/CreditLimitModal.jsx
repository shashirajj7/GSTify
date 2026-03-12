import React from 'react';
import { useNavigate } from 'react-router-dom';

const CreditLimitModal = ({ onClose }) => {
    const navigate = useNavigate();

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal Card */}
            <div className="relative w-full max-w-md bg-white dark:bg-[#1A2632] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-[fadeInUp_0.3s_ease-out_forwards]">
                <style>{`
                    @keyframes fadeInUp {
                        from { opacity: 0; transform: translateY(20px) scale(0.97); }
                        to { opacity: 1; transform: translateY(0) scale(1); }
                    }
                `}</style>

                {/* Top gradient bar */}
                <div className="h-1.5 w-full bg-gradient-to-r from-amber-400 via-orange-500 to-red-500" />

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                    <span className="material-symbols-outlined text-lg">close</span>
                </button>

                <div className="p-8">
                    {/* Icon */}
                    <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center mx-auto mb-5">
                        <span className="material-symbols-outlined text-amber-500 text-3xl">bolt</span>
                    </div>

                    {/* Heading */}
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">
                            Demo Limit Reached
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                            You've used all <span className="font-bold text-slate-700 dark:text-slate-300">5 free demo uploads</span>.
                            Create a free account or log in to continue processing invoices with no limits.
                        </p>
                    </div>

                    {/* Feature highlights */}
                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 mb-6 space-y-2.5">
                        {[
                            { icon: 'all_inclusive', text: 'Unlimited invoice uploads' },
                            { icon: 'history', text: 'Full invoice history & records' },
                            { icon: 'download', text: 'Export to GSTR-1, GSTR-3B & GSTR-9' },
                        ].map(({ icon, text }) => (
                            <div key={text} className="flex items-center gap-3">
                                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                    <span className="material-symbols-outlined text-primary text-[16px]">{icon}</span>
                                </div>
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{text}</span>
                            </div>
                        ))}
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col gap-3">
                        <button
                            onClick={() => navigate('/signup')}
                            className="w-full py-3.5 px-6 bg-primary hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/30 hover:-translate-y-0.5 flex items-center justify-center gap-2"
                        >
                            <span className="material-symbols-outlined text-[18px]">person_add</span>
                            Create Free Account
                        </button>
                        <button
                            onClick={() => navigate('/login')}
                            className="w-full py-3.5 px-6 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl hover:border-primary hover:text-primary dark:hover:border-primary dark:hover:text-primary transition-all flex items-center justify-center gap-2"
                        >
                            <span className="material-symbols-outlined text-[18px]">login</span>
                            Log In to Existing Account
                        </button>
                    </div>

                    <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-4">
                        Free plan — no credit card required
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CreditLimitModal;
