import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const AppLayout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display antialiased overflow-hidden">
            <div className="flex h-screen w-full bg-slate-50 dark:bg-[#0A1017] overflow-hidden relative">

                {/* Mobile Overlay */}
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-30 md:hidden transition-opacity"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}

                {/* Sidebar Segment */}
                <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

                {/* Main Content Area */}
                <main className="flex-1 flex flex-col h-full bg-slate-50 dark:bg-[#0A1017] overflow-hidden min-w-0">
                    <Header toggleSidebar={toggleSidebar} />

                    {/* Page Content injected here */}
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AppLayout;
