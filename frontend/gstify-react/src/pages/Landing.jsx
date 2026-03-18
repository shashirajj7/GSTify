import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

const Landing = () => {
    const navigate = useNavigate();

    const handleTryDemo = async () => {
        // Sign out of Firebase so Try Demo always starts as a guest
        try { await signOut(auth); } catch (_) {}
        localStorage.removeItem('loginType');
        sessionStorage.setItem('demoMode', 'true');
        localStorage.setItem('userName', 'Guest User');
        navigate('/dashboard');
    };

    return (
        <div className="bg-white text-gray-800 font-sans antialiased overflow-x-hidden min-h-screen flex flex-col">
            <style>{`
                html { scroll-behavior: smooth; }
                @keyframes scan-line {
                    0%, 100% { transform: translateY(-100%); opacity: 0; }
                    10% { opacity: 1; border-color: #3b82f6; box-shadow: 0 4px 20px rgba(59,130,246,0.8); }
                    50% { transform: translateY(100%); opacity: 1; border-color: #8b5cf6; box-shadow: 0 4px 20px rgba(139,92,246,0.8); }
                    90% { transform: translateY(100%); opacity: 0; }
                }
                @keyframes float-doc {
                    0%, 100% { transform: translateY(0) rotate(-2deg); }
                    50% { transform: translateY(-15px) rotate(1deg); }
                }
                @keyframes pulse-ring {
                    0% { transform: scale(0.8); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7); }
                    70% { transform: scale(1); box-shadow: 0 0 0 15px rgba(34, 197, 94, 0); }
                    100% { transform: scale(0.8); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
                }
                @keyframes pop-in {
                    0% { opacity: 0; transform: translateY(10px) scale(0.95); }
                    100% { opacity: 1; transform: translateY(0) scale(1); }
                }
                .animate-scan { animation: scan-line 3.5s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
                .animate-float { animation: float-doc 6s ease-in-out infinite; }
                .animate-ring { animation: pulse-ring 2s infinite; }
                .animate-pop { animation: pop-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; opacity: 0; }
                .delay-1 { animation-delay: 1.5s; }
                .delay-2 { animation-delay: 2s; }
            `}</style>
            <Navbar />

            <main className="flex-1">
                {/* Hero Section */}
                <section className="pt-24 pb-12 md:pt-32 md:pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                        <div className="absolute top-0 right-0 -mr-20 lg:-mr-40 w-[500px] h-[500px] bg-blue-50/50 rounded-full blur-3xl -z-10 text-primary"></div>
                        <div className="absolute top-40 left-0 -ml-20 w-[300px] h-[300px] bg-blue-50/30 rounded-full blur-2xl -z-10 text-primary"></div>

                        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
                            <div className="max-w-2xl">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-primary text-sm font-semibold mb-6">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                                    </span>
                                    AI-Powered GST Automation
                                </div>
                                <h1 className="mb-6">
                                    Automate GST Invoice Processing <br className="hidden lg:block" /><span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-500">with AI</span>
                                </h1>
                                <p className="text-lg text-slate-600 mb-8 max-w-xl leading-relaxed">
                                    AI-powered invoice extraction, GST validation, fraud detection and GSTR-1 draft generation — built for Indian MSMEs.
                                </p>
                                <div className="flex flex-col sm:flex-row items-center gap-4 mb-10">
                                    <button onClick={handleTryDemo} className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 text-[16px] font-semibold text-white bg-primary rounded-lg hover:bg-blue-700 transition-all hover:shadow-[0_4px_20px_rgba(19,127,236,0.4)] shadow-lg shadow-blue-500/30 gap-2">
                                        Try Demo
                                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                    </button>
                                    <Link to="/dashboard" className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 text-[16px] font-semibold text-slate-700 bg-white border-2 border-slate-200 rounded-lg hover:border-primary hover:text-primary hover:bg-blue-50/20 transition-all gap-2">
                                        <span className="material-symbols-outlined text-primary">play_circle</span>
                                        Watch Workflow
                                    </Link>
                                </div>
                            </div>

                            <div className="relative lg:ml-10">
                                {/* Intelligent Invoice Scanner Animation */}
                                <div className="relative w-full max-w-sm md:max-w-lg mx-auto transform hover:-translate-y-4 transition-transform duration-700">
                                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
                                    <div className="relative bg-[#0F172A] rounded-2xl shadow-[0_20px_50px_rgba(8,_112,_184,_0.15)] border border-slate-700/80 overflow-hidden aspect-[4/3] flex flex-col z-10">
                                        {/* Scanner Header */}
                                        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800/80 bg-slate-900/90 backdrop-blur-sm">
                                            <div className="flex items-center gap-3">
                                                <div className="w-3 h-3 rounded-full bg-green-500 animate-ring"></div>
                                                <span className="text-[11px] font-mono text-slate-400 tracking-wider font-bold">GSTIFY_NEURAL_ENGINE</span>
                                            </div>
                                            <span className="px-2.5 py-1 rounded text-[10px] font-black tracking-widest bg-green-500/10 text-green-400 border border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.2)]">EXTRACTION ACTIVE</span>
                                        </div>

                                        {/* Scanner Body */}
                                        <div className="flex-1 relative flex items-center justify-center p-6 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800 via-[#0F172A] to-[#0A0F1C] overflow-hidden">

                                            {/* Background Grid Map Effect */}
                                            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>

                                            {/* The Invoice Document */}
                                            <div className="relative w-56 h-72 bg-[#f8fafc] rounded-lg shadow-2xl border border-slate-300 p-5 transform transition-transform duration-700 animate-float z-10">
                                                {/* Decorative Hologram overlay on document */}
                                                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 to-purple-500/5 rounded-lg pointer-events-none"></div>

                                                {/* Invoice structural lines */}
                                                <div className="flex items-center justify-between mb-8">
                                                    <div className="w-16 h-4 bg-slate-800/10 rounded"></div>
                                                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                                                        <span className="material-symbols-outlined text-indigo-500 text-[20px]">store</span>
                                                    </div>
                                                </div>
                                                <div className="w-full h-2 bg-slate-200 rounded mb-2"></div>
                                                <div className="w-3/4 h-2 bg-slate-200 rounded mb-8"></div>

                                                <div className="space-y-4 mb-8">
                                                    <div className="flex justify-between items-center"><div className="w-14 h-2 bg-slate-200 rounded"></div><div className="w-12 h-2.5 bg-slate-300 rounded"></div></div>
                                                    <div className="flex justify-between items-center"><div className="w-20 h-2 bg-slate-200 rounded"></div><div className="w-16 h-2.5 bg-slate-300 rounded"></div></div>
                                                    <div className="flex justify-between items-center"><div className="w-10 h-2 bg-slate-200 rounded"></div><div className="w-24 h-2.5 bg-slate-300 rounded"></div></div>
                                                </div>

                                                <div className="w-full border-t-2 border-dashed border-slate-200 mb-4"></div>
                                                <div className="flex justify-between items-center"><div className="w-12 h-3 bg-slate-300 rounded"></div><div className="w-20 h-4 bg-indigo-500/20 rounded"></div></div>

                                                {/* Scanning Laser */}
                                                <div className="absolute -inset-x-4 top-0 h-32 border-b-[3px] border-blue-500 bg-gradient-to-b from-transparent via-blue-500/10 to-blue-500/30 origin-top animate-scan z-20 mix-blend-color-dodge"></div>
                                            </div>

                                            {/* Extraction Data Floating Side Panels */}
                                            <div className="absolute -right-8 top-1/2 -translate-y-1/2 w-52 bg-slate-800/60 backdrop-blur-xl rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.5)] border border-white/10 p-4 z-30 animate-pop delay-1">
                                                <div className="flex items-center justify-between mb-3 pb-3 border-b border-white/10">
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="material-symbols-outlined text-purple-400 text-[18px]">neurology</span>
                                                        <span className="text-[10px] font-black text-white uppercase tracking-widest">AI Parsed</span>
                                                    </div>
                                                    <span className="text-[9px] text-green-400 font-mono bg-green-400/10 px-1.5 rounded">100%</span>
                                                </div>
                                                <div className="space-y-3.5">
                                                    <div className="group">
                                                        <span className="block text-[9px] text-slate-400 font-mono mb-1 tracking-wider">SUPPLIER GSTIN</span>
                                                        <span className="block text-sm font-bold text-slate-100 flex items-center justify-between">
                                                            27AAPCU3890G1Z2
                                                            <span className="material-symbols-outlined text-green-400 text-[14px] bg-green-400/10 rounded-full p-0.5">check_small</span>
                                                        </span>
                                                    </div>
                                                    <div className="group animate-pop delay-2">
                                                        <span className="block text-[9px] text-slate-400 font-mono mb-1 tracking-wider">TOTAL TAX VALUE</span>
                                                        <span className="block text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                                                            ₹ 42,500.00
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    </div>

                                    {/* Tech rings decoration */}
                                    <div className="absolute -bottom-6 -left-6 w-24 h-24 border border-blue-500/20 rounded-full -z-10 animate-spin" style={{ animationDuration: '10s' }}></div>
                                    <div className="absolute -bottom-2 -left-2 w-16 h-16 border border-purple-500/20 rounded-full -z-10 animate-spin" style={{ animationDuration: '7s', animationDirection: 'reverse' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Trust Indicators Section */}
                <section className="py-8 md:py-12 bg-white border-y border-slate-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
                            <div className="flex items-center gap-2 text-slate-500 font-semibold"><span className="material-symbols-outlined text-green-500">verified</span> GSTN Compatible</div>
                            <div className="flex items-center gap-2 text-slate-500 font-semibold"><span className="material-symbols-outlined text-primary">apartment</span> Built for Indian MSMEs</div>
                            <div className="flex items-center gap-2 text-slate-500 font-semibold"><span className="material-symbols-outlined text-purple-500">memory</span> AI-Powered</div>
                            <div className="flex items-center gap-2 text-slate-500 font-semibold"><span className="material-symbols-outlined text-blue-400">cloud_done</span> Secure Cloud Processing</div>
                        </div>
                    </div>
                </section>

                {/* Problem Section */}
                <section className="py-12 md:py-20 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center max-w-2xl mx-auto mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-t_navy mb-4">
                                Why Manual Entry is <span className="text-red-500">Holding You Back</span>
                            </h2>
                            <p className="text-gray-600 text-lg">
                                Traditional accounting processes are slow, expensive, and a compliance nightmare waiting to happen.
                            </p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-8">
                            {/* Card 1 */}
                            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-blue-900/5 hover:border-slate-200 transition-all duration-300 transform hover:-translate-y-1">
                                <h2 className="text-4xl md:text-[48px] font-black text-primary mb-2">80%</h2>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">Manual Entry Default</h3>
                                <p className="text-slate-600 leading-relaxed">
                                    80% of Indian MSMEs still manually enter invoices into their accounting software, severely limiting their bandwidth.
                                </p>
                            </div>
                            {/* Card 2 */}
                            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-red-900/5 hover:border-slate-200 transition-all duration-300 transform hover:-translate-y-1">
                                <h2 className="text-[48px] font-black text-red-500 mb-2">30%</h2>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">Filing Error Rate</h3>
                                <p className="text-slate-600 leading-relaxed">
                                    Manual typing results in a ~30% error rate in critical fields such as GSTINs and HSN codes, causing notice disputes.
                                </p>
                            </div>
                            {/* Card 3 */}
                            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-amber-900/5 hover:border-slate-200 transition-all duration-300 transform hover:-translate-y-1">
                                <div className="w-14 h-14 rounded-xl bg-amber-50 flex items-center justify-center mb-6">
                                    <span className="material-symbols-outlined text-amber-500 text-[32px]">timer</span>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">Wasted Reconciliation</h3>
                                <p className="text-slate-600 leading-relaxed">
                                    Accountants waste valuable hours matching GSTR-1 vs GSTR-2B data instead of focusing on tax strategy.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Process Section */}
                <section id="how-it-works" className="py-24">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center max-w-2xl mx-auto mb-20">
                            <span className="text-primary font-semibold tracking-wider uppercase text-sm mb-2 block">How it Works</span>
                            <h2 className="text-3xl md:text-4xl font-bold text-t_navy">Simplify Your Workflow in 4 Steps</h2>
                        </div>
                        <div className="relative">
                            <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 border-t-2 border-dashed border-gray-200 -translate-y-12 z-0"></div>
                            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 relative z-10">
                                {/* Step 1 */}
                                <div className="text-center group">
                                    <div className="mx-auto w-24 h-24 rounded-full bg-blue-50 border-4 border-white shadow-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                        <span className="material-symbols-outlined text-primary text-4xl">cloud_upload</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-t_navy mb-2">1. Upload</h3>
                                    <p className="text-gray-600 leading-relaxed">Drag & drop your PDFs, images, or scanned documents securely.</p>
                                </div>
                                {/* Step 2 */}
                                <div className="text-center group">
                                    <div className="mx-auto w-24 h-24 rounded-full bg-purple-50 border-4 border-white shadow-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                        <span className="material-symbols-outlined text-purple-600 text-4xl">memory</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-t_navy mb-2">2. Extract</h3>
                                    <p className="text-gray-600 leading-relaxed">Our OCR & AI instantly extracts relevant fields with high precision.</p>
                                </div>
                                {/* Step 3 */}
                                <div className="text-center group">
                                    <div className="mx-auto w-24 h-24 rounded-full bg-green-50 border-4 border-white shadow-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                        <span className="material-symbols-outlined text-green-600 text-4xl">verified</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-t_navy mb-2">3. Validate</h3>
                                    <p className="text-gray-600 leading-relaxed">Cross-check against GSTN and identify tax mismatch anomalies.</p>
                                </div>
                                {/* Step 4 */}
                                <div className="text-center group">
                                    <div className="mx-auto w-24 h-24 rounded-full bg-orange-50 border-4 border-white shadow-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                        <span className="material-symbols-outlined text-orange-600 text-4xl">download</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-t_navy mb-2">4. Export</h3>
                                    <p className="text-gray-600 leading-relaxed">Review flagged issues and export government-ready formats.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="py-24 bg-t_navy text-white relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="text-center max-w-2xl mx-auto mb-20">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features for Modern Teams</h2>
                            <p className="text-gray-400 text-lg">Built with enterprise-grade security and accuracy in mind.</p>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {/* Feature 1 */}
                            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 hover:bg-slate-800 transition-colors">
                                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center mb-6 text-blue-400">
                                    <span className="material-symbols-outlined">document_scanner</span>
                                </div>
                                <h3 className="text-xl font-bold mb-3">Smart OCR Extraction</h3>
                                <p className="text-gray-400 leading-relaxed">Extracts text even from poor quality scans or handwritten invoices.</p>
                            </div>
                            {/* Feature 2 */}
                            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 hover:bg-slate-800 transition-colors">
                                <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center mb-6 text-green-400">
                                    <span className="material-symbols-outlined">verified</span>
                                </div>
                                <h3 className="text-xl font-bold mb-3">Live GSTIN Validation</h3>
                                <p className="text-gray-400 leading-relaxed">Cross-checks supplier details directly with the official GST portal.</p>
                            </div>
                            {/* Feature 3 */}
                            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 hover:bg-slate-800 transition-colors">
                                <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mb-6 text-purple-400">
                                    <span className="material-symbols-outlined">analytics</span>
                                </div>
                                <h3 className="text-xl font-bold mb-3">Anomaly Detection</h3>
                                <p className="text-gray-400 leading-relaxed">Flags duplicate invoices and mismatched tax amounts automatically.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Pricing / Final CTA */}
                <section id="pricing" className="py-20 bg-primary relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 tracking-tight">
                            Start automating your GST workflow today.
                        </h2>
                        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                            <button onClick={handleTryDemo} className="px-8 py-4 bg-white text-primary text-lg font-bold rounded-xl hover:bg-slate-50 transition-all shadow-xl shadow-blue-900/20 hover:-translate-y-1">
                                Get Started for Free
                            </button>
                            <Link to="/contact" className="px-8 py-4 bg-transparent border-2 border-white/30 text-white text-lg font-bold rounded-xl hover:bg-white/10 transition-all">
                                Contact Sales
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            {/* Let's wrap Footer div to place the contact anchor accurately at the bottom */}
            <div id="contact">
                <Footer />
            </div>
        </div >
    );
};

export default Landing;
