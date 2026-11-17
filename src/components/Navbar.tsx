import { Menu, ShieldPlus, X } from 'lucide-react';
import { useState } from 'react';
import type { PageView } from '../types/interaction';

interface NavbarProps {
  currentPage: PageView;
  onNavigate: (page: PageView) => void;
  onStartNewCheck: () => void;
}

export function Navbar({ currentPage, onNavigate, onStartNewCheck }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: Array<{ id: PageView; label: string }> = [
    { id: 'home', label: 'Home' },
    { id: 'checker', label: 'Check Interactions' },
    { id: 'about', label: 'About' },
  ];

  const handleNavClick = (page: PageView) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  const handlePrimaryAction = () => {
    setMobileMenuOpen(false);
    if (currentPage === 'results') {
      onStartNewCheck();
    } else {
      onNavigate('checker');
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-[#DCE5EE]">
      <div className="max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Logo + Single-line Wordmark */}
        <button
          type="button"
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-2.5 text-left whitespace-nowrap shrink-0 rounded-lg py-1 focus-visible:outline-2 focus-visible:outline-[#176B59]"
        >
          <span className="w-8 h-8 rounded-lg bg-[#176B59] text-white flex items-center justify-center shrink-0">
            <ShieldPlus className="w-4 h-4" aria-hidden="true" />
          </span>
          <span className="font-display text-base sm:text-lg font-bold tracking-tight text-[#263445] whitespace-nowrap">
            Drug Interaction Checker
          </span>
        </button>

        {/* Zone 2: Clean Single-line Nav Links */}
        <nav aria-label="Main navigation" className="hidden md:flex items-center gap-7">
          {navItems.map((item) => {
            const isActive =
              currentPage === item.id ||
              (item.id === 'checker' && currentPage === 'results');
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`relative py-1.5 text-sm font-medium whitespace-nowrap shrink-0 transition-colors duration-150 ${
                  isActive
                    ? 'text-[#176B59]'
                    : 'text-[#52637A] hover:text-[#263445]'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                {item.label}
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 -bottom-[19px] h-0.5 bg-[#176B59] rounded-full"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Single Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={handlePrimaryAction}
            className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-[#176B59] hover:bg-[#125647] rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 shadow-xs cursor-pointer"
          >
            {currentPage === 'results' ? 'New Check' : 'Start Checking'}
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg text-[#263445] hover:bg-[#EAF3FA] transition-colors"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#DCE5EE] bg-white px-4 py-3 space-y-1">
          {navItems.map((item) => {
            const isActive =
              currentPage === item.id ||
              (item.id === 'checker' && currentPage === 'results');
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[#EAF3FA] text-[#176B59]'
                    : 'text-[#263445] hover:bg-[#F4F7FA]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
          <div className="pt-2">
            <button
              type="button"
              onClick={handlePrimaryAction}
              className="w-full py-2.5 px-4 text-sm font-medium text-white bg-[#176B59] hover:bg-[#125647] rounded-lg transition-colors"
            >
              {currentPage === 'results' ? 'New Check' : 'Start Checking'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
