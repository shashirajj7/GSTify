import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-white border-t border-gray-100 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 bg-blue-50/50 rounded-3xl p-8 lg:p-12 border border-blue-100 mb-16 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="z-10">
                        <h2 className="text-3xl font-extrabold text-t_navy mb-4">Ready to automate your GST?</h2>
                        <p className="text-gray-600 mb-0 max-w-lg">Join businesses saving hours of manual work and eliminating compliance errors with GSTify.AI.</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 z-10 w-full md:w-auto">
                        <Link to="/contact" className="inline-flex items-center justify-center px-6 py-3 border-2 border-primary text-base font-semibold text-primary bg-white rounded-full hover:bg-blue-50 transition-colors">
                            Contact Sales
                        </Link>
                        <Link to="/signup" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-semibold text-white bg-primary rounded-full hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30">
                            Start for Free
                            <span className="material-symbols-outlined ml-2 text-sm">arrow_forward</span>
                        </Link>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-gray-200">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                        <div>
                            <h3 className="font-bold text-t_navy mb-4">Product</h3>
                            <ul className="space-y-3 text-sm text-gray-500">
                                <li><a href="/#features" className="hover:text-primary transition-colors">Features</a></li>
                                <li><a href="/#pricing" className="hover:text-primary transition-colors">Pricing</a></li>
                                <li><Link to="/" className="hover:text-primary transition-colors">Integrations</Link></li>
                                <li><Link to="/" className="hover:text-primary transition-colors">Changelog</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-bold text-t_navy mb-4">Resources</h3>
                            <ul className="space-y-3 text-sm text-gray-500">
                                <li><Link to="/" className="hover:text-primary transition-colors">Documentation</Link></li>
                                <li><Link to="/" className="hover:text-primary transition-colors">Blog</Link></li>
                                <li><Link to="/" className="hover:text-primary transition-colors">GST Guidelines</Link></li>
                                <li><Link to="/" className="hover:text-primary transition-colors">Community</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-bold text-t_navy mb-4">Company</h3>
                            <ul className="space-y-3 text-sm text-gray-500">
                                <li><Link to="/" className="hover:text-primary transition-colors">About Us</Link></li>
                                <li><Link to="/" className="hover:text-primary transition-colors">Careers</Link></li>
                                <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
                                <li><Link to="/" className="hover:text-primary transition-colors">Partners</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-bold text-t_navy mb-4">Legal</h3>
                            <ul className="space-y-3 text-sm text-gray-500">
                                <li><Link to="/" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                                <li><Link to="/" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                                <li><Link to="/" className="hover:text-primary transition-colors">Security</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-200">
                        <div className="flex items-center gap-2 mb-4 md:mb-0">
                            <img src="/logo.png" alt="GSTify.AI Logo" className="w-6 h-6 object-contain" />
                            <span className="font-bold text-lg tracking-tight text-t_navy">GSTify.AI</span>
                            <span className="text-sm text-gray-400 ml-4">&copy; 2026. All rights reserved.</span>
                        </div>
                        <div className="flex space-x-4 text-gray-400">
                            <Link to="/" className="hover:text-t_navy transition-colors"><span className="material-symbols-outlined">language</span></Link>
                            <Link to="/" className="hover:text-t_navy transition-colors"><span className="material-symbols-outlined">email</span></Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
