import React from 'react';
import { Menu, X } from 'lucide-react';

interface HeaderBarProps {
  isMenuOpen: boolean;
  onToggleMenu: () => void;
  activeView: string;
  contextTitle?: string;
  onNavigateHome: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  isMenuOpen,
  onToggleMenu,
  activeView,
  contextTitle,
  onNavigateHome,
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 lg:right-16 z-50 h-20 px-6 lg:px-10 flex items-center justify-between bg-gradient-to-b from-[#080808]/90 via-[#080808]/50 to-transparent backdrop-blur-xs pointer-events-auto">
      {/* Brand Zone */}
      <div className="flex items-center gap-4">
        <button
          onClick={onNavigateHome}
          className="text-left group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#F59E0B] rounded-sm"
        >
          <span className="font-syne text-xl lg:text-2xl font-extrabold tracking-tight text-white group-hover:text-[#F59E0B] transition-colors uppercase">
            labib<span className="text-[#F59E0B]">.</span>studio
          </span>
        </button>
      </div>

      {/* Center Contextual Indicator */}
      <div className="hidden sm:flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#A1A1AA]">
        <span className="text-[#F59E0B] font-semibold">●</span>
        <span>
          {contextTitle || (activeView === 'home' ? 'WELCOME' : activeView.toUpperCase())}
        </span>
      </div>

      {/* Right Controls: Hamburger / Drawer Toggle */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleMenu}
          aria-label={isMenuOpen ? 'Close Menu' : 'Open Menu'}
          className="flex items-center gap-2 px-4 py-2 bg-[#121212]/80 hover:bg-[#292929] border border-[#292929] rounded-full text-xs font-semibold tracking-widest text-white uppercase transition-all hover:border-[#F59E0B] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#F59E0B]"
        >
          {isMenuOpen ? (
            <>
              <span>CLOSE</span>
              <X className="w-4 h-4 text-[#F59E0B]" />
            </>
          ) : (
            <>
              <span className="hidden xs:inline">MENU</span>
              <Menu className="w-4 h-4 text-[#F59E0B]" />
            </>
          )}
        </button>
      </div>
    </header>
  );
};
