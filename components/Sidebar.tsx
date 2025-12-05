import React, { useState } from 'react';
import { NavItem } from '../types';
import { ChevronRight, ChevronDown, FileText } from 'lucide-react';

interface SidebarProps {
  navItems: NavItem[];
  activeSlug: string;
  onNavigate: (slug: string) => void;
  isOpenMobile: boolean;
  setIsOpenMobile: (open: boolean) => void;
}

const NavGroup: React.FC<{
  item: NavItem;
  activeSlug: string;
  onNavigate: (slug: string) => void;
  level?: number;
}> = ({ item, activeSlug, onNavigate, level = 0 }) => {
  const [isOpen, setIsOpen] = useState(true);
  
  const hasChildren = item.children && item.children.length > 0;
  const isActive = item.slug === activeSlug;

  const handleClick = () => {
    if (hasChildren) {
      setIsOpen(!isOpen);
    } else if (item.slug) {
      onNavigate(item.slug);
    }
  };

  return (
    <div className="mb-1">
      <button
        onClick={handleClick}
        className={`w-full flex items-center justify-between px-3 py-1.5 text-sm rounded-md transition-colors duration-200
          ${isActive 
            ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 font-medium' 
            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }
        `}
        style={{ paddingLeft: `${level * 12 + 12}px` }}
      >
        <div className="flex items-center gap-2">
           {/* Only show icon for leaf nodes or if desired */}
           {!hasChildren && <FileText size={14} className={isActive ? 'text-blue-500 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'} />}
           <span>{item.title}</span>
        </div>
        
        {hasChildren && (
          <span className="text-slate-400 dark:text-slate-500">
            {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </span>
        )}
      </button>

      {hasChildren && isOpen && (
        <div className="mt-1">
          {item.children!.map((child) => (
            <NavGroup
              key={child.id}
              item={child}
              activeSlug={activeSlug}
              onNavigate={onNavigate}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({ navItems, activeSlug, onNavigate, isOpenMobile, setIsOpenMobile }) => {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpenMobile && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpenMobile(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`
          fixed top-14 left-0 bottom-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:h-[calc(100vh-3.5rem)]
          ${isOpenMobile ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="h-full overflow-y-auto custom-scrollbar p-4">
          <div className="mb-6 px-3">
             <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Documentation</p>
          </div>
          <nav>
            {navItems.map((item) => (
              <NavGroup
                key={item.id}
                item={item}
                activeSlug={activeSlug}
                onNavigate={(slug) => {
                  onNavigate(slug);
                  setIsOpenMobile(false);
                }}
              />
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
};