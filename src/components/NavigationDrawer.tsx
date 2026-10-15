import React, { useEffect } from 'react';
import { BrandMark } from './BrandMark';
import { motion, AnimatePresence } from 'motion/react';
import { useContent } from '../context/ContentContext';

interface NavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeView: string;
  onNavigate: (view: string, categoryFilter?: string) => void;
  selectedCategory?: string;
}

export const NavigationDrawer: React.FC<NavigationDrawerProps> = ({
  isOpen,
  onClose,
  activeView,
  onNavigate,
  selectedCategory,
}) => {
  const { content } = useContent();
  const { profile, categories } = content;
  // ESC key handler to close drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const primaryNav = [
    { id: 'home', label: 'HOME' },
    { id: 'gallery', label: 'GALLERY' },
    { id: 'services', label: 'SERVICES' },
    { id: 'about', label: 'ABOUT ME' },
    { id: 'contact', label: 'CONTACT' },
  ];


  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-40 cursor-pointer"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 bottom-0 w-full max-w-xl bg-[#080808] border-r border-[#292929] z-50 p-8 sm:p-12 flex flex-col justify-between overflow-y-auto"
          >
            {/* Top Bar inside Drawer */}
            <div className="flex items-center justify-between pb-8 border-b border-[#292929]">
              <BrandMark brand={profile.brand} className="font-syne text-xl font-bold tracking-tight text-white uppercase" />
              <button
                onClick={onClose}
                className="text-xs uppercase tracking-widest text-[#A1A1AA] hover:text-[#F59E0B] transition-colors"
              >
                [ CLOSE ESC ]
              </button>
            </div>

            {/* Main Nav Links */}
            <div className="my-auto py-8 space-y-8">
              <nav className="flex flex-col gap-4">
                {primaryNav.map((item) => {
                  const isActive = activeView === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onNavigate(item.id);
                        onClose();
                      }}
                      className={`text-left font-syne text-3xl sm:text-4xl font-extrabold uppercase tracking-tight transition-all duration-300 hover:translate-x-3 hover:text-[#F59E0B] ${
                        isActive ? 'text-[#F59E0B]' : 'text-white'
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </nav>

              {/* Sub-Category Filter List */}
              <div className="pt-8 border-t border-[#292929]">
                <span className="text-xs uppercase tracking-[0.2em] text-[#A1A1AA] mb-4 block">
                  CATEGORIES / PORTFOLIO FILTERS
                </span>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => {
                    const isSelected = activeView === 'gallery' && selectedCategory === cat;
                    return (
                      <button
                        key={cat}
                        onClick={() => {
                          onNavigate('gallery', cat);
                          onClose();
                        }}
                        className={`px-3 py-1.5 text-xs uppercase font-medium tracking-wider rounded-md border transition-all ${
                          isSelected
                            ? 'bg-[#F59E0B] text-black border-[#F59E0B]'
                            : 'bg-[#121212] text-[#A1A1AA] border-[#292929] hover:border-[#F59E0B] hover:text-white'
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="pt-8 border-t border-[#292929] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs text-[#A1A1AA]">
              <div className="flex items-center gap-4">
                {profile.socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-[#F59E0B] transition-colors uppercase tracking-wider"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
              <span className="uppercase tracking-widest text-[10px]">
                {profile.brand} {new Date().getFullYear()} · BY {profile.name}
              </span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
