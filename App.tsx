import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DocContent } from './components/DocContent';
import { MOCK_DOCS, NAV_STRUCTURE } from './constants';

function App() {
  // Navigation State
  const [activeSlug, setActiveSlug] = useState('introduction');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Theme State - default to dark
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) return savedTheme;
    }
    return 'dark';
  });

  // Apply theme class to document
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Derived State
  const activePage = MOCK_DOCS.find(doc => doc.slug === activeSlug) || MOCK_DOCS[0];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors duration-200">
      <Header
        onMenuClick={() => setIsMobileMenuOpen(true)}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <div className="flex pt-14">
        {/* Left Sidebar */}
        <Sidebar
          navItems={NAV_STRUCTURE}
          activeSlug={activeSlug}
          onNavigate={setActiveSlug}
          isOpenMobile={isMobileMenuOpen}
          setIsOpenMobile={setIsMobileMenuOpen}
        />

        {/* Main Content Area */}
        <div className="flex-1 min-w-0 bg-white dark:bg-slate-900 lg:pl-0 transition-colors duration-200">
          <DocContent page={activePage} />
        </div>

        {/* Right Table of Contents */}
        <aside className="hidden xl:block w-64 top-14 sticky h-[calc(100vh-3.5rem)] overflow-y-auto border-l border-slate-100 dark:border-slate-800 p-6 transition-colors duration-200">
           <h5 className="text-sm font-semibold text-slate-900 dark:text-slate-200 mb-4">On this page</h5>
           <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400">
             {/* Simulating TOC extraction from markdown content */}
             {activePage.content.split('\n').filter(line => line.startsWith('## ')).map((header, idx) => (
               <li key={idx}>
                 <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors block leading-snug">
                   {header.replace('## ', '')}
                 </a>
               </li>
             ))}
           </ul>
        </aside>
      </div>
    </div>
  );
}

export default App;
