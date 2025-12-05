import React from 'react';
import { Menu, Search, Github, Twitter, Sun, Moon } from 'lucide-react';
import { DOC_NAME } from '../constants';

interface HeaderProps {
  onMenuClick: () => void;
  onSearchClick: () => void;
  theme: string;
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick, onSearchClick, theme, onToggleTheme }) => {
  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 z-50 px-4 flex items-center justify-between transition-colors duration-200">
      <div className="flex items-center gap-3">
        <button 
          onClick={onMenuClick}
          className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md lg:hidden text-slate-600 dark:text-slate-400"
        >
          <Menu size={20} />
        </button>
        <div className="flex items-center gap-2 font-bold text-lg tracking-tight text-slate-900 dark:text-white">
           <div className="w-6 h-6 bg-orange-500 rounded-md flex items-center justify-center text-white text-xs font-bold">x</div>
           {DOC_NAME}
        </div>
        <span className="hidden sm:inline-block px-2 py-0.5 text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full border border-slate-200 dark:border-slate-700 ml-2">v1.0.2</span>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {/* Search Bar Trigger */}
        <button 
          onClick={onSearchClick}
          className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-700 dark:hover:text-slate-200 transition-all w-36 sm:w-64 group"
        >
          <Search size={14} className="group-hover:text-blue-500 transition-colors" />
          <span className="text-sm">Ask AI...</span>
          <span className="hidden sm:inline text-xs text-slate-400 dark:text-slate-500 ml-auto border border-slate-200 dark:border-slate-700 px-1 rounded">⌘K</span>
        </button>

        <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block"></div>

        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
           <button 
             onClick={onToggleTheme}
             className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
             aria-label="Toggle theme"
           >
             {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
           </button>
           <a href="#" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors hidden sm:block">
             <Github size={18} />
           </a>
           <a href="#" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors hidden sm:block">
             <Twitter size={18} />
           </a>
        </div>
      </div>
    </header>
  );
};