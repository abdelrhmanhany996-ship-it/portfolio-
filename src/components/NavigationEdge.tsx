import React from 'react';

interface NavigationEdgeProps {
  activeView: string;
  onNavigate: (view: string) => void;
}

export const NavigationEdge: React.FC<NavigationEdgeProps> = ({ activeView, onNavigate }) => {
  const navItems = [
    { id: 'home', label: 'PORTFOLIO' },
    { id: 'services', label: 'SERVICES' },
    { id: 'about', label: 'ABOUT ME' },
    { id: 'contact', label: 'CONTACT' },
  ];

  return (
    <aside
      aria-label="Side Navigation"
      className="hidden lg:flex fixed top-0 right-0 h-screen w-16 z-40 bg-[#080808]/90 border-l border-[#292929] flex-col items-center justify-center backdrop-blur-md transition-all duration-300"
    >
      <div className="flex flex-col items-center gap-12 py-8 h-full justify-center">
        {navItems.map((item) => {
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`writing-mode-vertical text-xs font-semibold uppercase tracking-[0.2em] transition-all duration-300 transform rotate-180 hover:text-[#F59E0B] py-2 relative group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#F59E0B] ${
                isActive ? 'text-[#F59E0B]' : 'text-[#A1A1AA]'
              }`}
            >
              {item.label}
              {isActive && (
                <span className="absolute -left-3 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-[#F59E0B] shadow-[0_0_8px_#F59E0B]" />
              )}
            </button>
          );
        })}
      </div>
    </aside>
  );
};
