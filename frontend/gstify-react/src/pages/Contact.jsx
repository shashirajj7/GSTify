import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Contact = () => {
    const navigate = useNavigate();

    const handleContactSubmit = (e) => {
        e.preventDefault();
        // Simulate contact form submission
        navigate('/');
    };

    return (
        <div className="bg-gray-50 text-gray-800 font-sans antialiased overflow-x-hidden min-h-screen flex flex-col">
            {/* Navigation */}
            <nav className="w-full z-50 bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <Link to="/" className="flex items-center gap-2 cursor-pointer">
                            <span className="material-symbols-outlined text-primary text-3xl">auto_awesome</span>
                            <span className="font-bold text-xl tracking-tight text-t_navy">GSTify.AI</span>
                        </Link>
                        <div className="hidden md:flex items-center space-x-8">
                            <Link to="/#features" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">Features</Link>
                            <Link to="/#how-it-works" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">How it Works</Link>
                            <Link to="/#pricing" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">Pricing</Link>
                            <Link to="/contact" className="text-sm font-bold text-primary transition-colors">Contact</Link>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-t_navy hidden sm:block">Log in</Link>
                            <Link to="/login" className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-white bg-primary rounded-full hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30">
                                Try Demo
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Content */}
            <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden flex flex-col lg:flex-row">

                    {/* Left Panel - Info */}
                    <div className="lg:w-2/5 bg-t_navy p-10 lg:p-12 text-white flex flex-col justify-between relative overflow-hidden">
                        {/* Decorative Circle */}
                        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary rounded-full blur-3xl opacity-30"></div>
                        <div className="absolute top-10 right-0 w-32 h-32 bg-blue-400 rounded-full blur-2xl opacity-20"></div>

                        <div className="relative z-10">
                            <h2 className="text-3xl font-bold mb-4">Get in touch</h2>
                            <p className="text-blue-200 mb-10 leading-relaxed">
                                We'd love to hear from you. Our friendly team is always here to chat and help you automate your GST workflows.
                            </p>

                            <div className="space-y-8">
                                <div className="flex items-start gap-4">
                                    <span className="material-symbols-outlined text-primary text-2xl mt-0.5">location_on</span>
                                    <div>
                                        <h4 className="font-semibold text-white">Office</h4>
                                        <p className="text-blue-200 text-sm mt-1 leading-relaxed">Institute of Aeronautical Engineering, Block 2<br />Dundigal, Hyderabad<br />Telangana 500043</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <span className="material-symbols-outlined text-primary text-2xl mt-0.5">mail</span>
                                    <div>
                                        <h4 className="font-semibold text-white">Email</h4>
                                        <p className="text-blue-200 text-sm mt-1">xxxx@iare.ac.in<br />xxxx@iare.ac.in</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <span className="material-symbols-outlined text-primary text-2xl mt-0.5">call</span>
                                    <div>
                                        <h4 className="font-semibold text-white">Phone</h4>
                                        <p className="text-blue-200 text-sm mt-1">Mon-Fri from 9am to 6pm<br />+91 800 123 4XXX</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 mt-12 relative z-10 text-white/50">
                            <Link to="/" className="hover:text-white transition-colors"><span className="material-symbols-outlined">language</span></Link>
                            <Link to="/" className="hover:text-white transition-colors"><span className="material-symbols-outlined">forum</span></Link>
                        </div>
                    </div>

                    {/* Right Panel - Form */}
                    <div className="lg:w-3/5 p-10 lg:p-16">
                        <form className="space-y-6" onSubmit={handleContactSubmit}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-sm"
                                        placeholder="First Name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-sm"
                                        placeholder="Last Name"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Work Email</label>
                                <input
                                    type="email"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-sm"
                                    placeholder="example@company.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                                <select className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-sm text-gray-600 bg-white appearance-none">
                                    <option>Sales Inquiry</option>
                                    <option>Technical Support</option>
                                    <option>Partnership</option>
                                    <option>Other</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                                <textarea
                                    rows="4"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-sm resize-none"
                                    placeholder="How can we help you?"
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-4 px-6 text-white font-bold bg-primary hover:bg-blue-700 rounded-xl transition-all shadow-lg shadow-blue-500/30"
                            >
                                Send Message
                            </button>
                            <p className="text-xs text-center text-gray-500 mt-4">
                                By sending this message, you agree to our <Link to="/" className="text-primary hover:underline">Privacy Policy</Link>.
                            </p>
                        </form>
                    </div>
                </div>
            </main>

            {/* Footer Light */}
            <footer className="bg-white border-t border-gray-200 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
                    &copy; 2026 GSTify.AI. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

export default Contact;
