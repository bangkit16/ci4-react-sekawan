import React, { useState } from 'react';
import Sidebar from './Sidebar';
import ThemeToggle from './ThemeToggle';

interface DashboardLayoutProps {
  children: React.ReactNode;
  pageTitle?: string;
  breadcrumb?: string;
}

function DashboardLayout({ children, pageTitle, breadcrumb }: DashboardLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex overflow-x-hidden">
      <Sidebar 
        collapsed={collapsed} 
        onToggle={() => setCollapsed((c) => !c)} 
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 w-full
          ${collapsed ? 'lg:ml-16' : 'lg:ml-64'}
          ml-0
        `}
      >
        {/* Sticky top header */}
        <header className="sticky top-0 z-30 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 px-4 sm:px-6 py-3.5 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            {/* Mobile Toggle */}
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-gray-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div className="hidden sm:block">
              {breadcrumb && (
                <p className="text-xs text-slate-400 dark:text-slate-500 mb-0.5">{breadcrumb}</p>
              )}
              {pageTitle && (
                <h1 className="text-base font-semibold text-slate-800 dark:text-white">{pageTitle}</h1>
              )}
            </div>
            {/* Mobile simple title */}
            <div className="sm:hidden font-semibold text-slate-800 dark:text-white text-sm">
              {pageTitle}
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Theme toggle */}
            <ThemeToggle />

        

            {/* Date */}
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-slate-500 dark:text-slate-400 text-xs">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;

