import { useState } from 'react';
import { AboutPage } from './components/AboutPage';
import { CheckerPage } from './components/CheckerPage';
import { HomePage } from './components/HomePage';
import { Navbar } from './components/Navbar';
import { ResultsPage } from './components/ResultsPage';
import { checkMedicineInteractions } from './services/interactionService';
import type { InteractionCheckSummary, PageView } from './types/interaction';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageView>('home');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [checkSummary, setCheckSummary] = useState<InteractionCheckSummary | null>(null);
  const [showExperimentalMl, setShowExperimentalMl] = useState(true);

  const handleNavigate = (page: PageView) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRunCheck = async () => {
    if (selectedIds.length < 2) return;
    const summary = await checkMedicineInteractions(selectedIds, {
      includeExperimentalMl: true,
    });
    setCheckSummary(summary);
    setCurrentPage('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearAll = () => {
    setSelectedIds([]);
    setCheckSummary(null);
  };

  const handleStartNewCheck = () => {
    setSelectedIds([]);
    setCheckSummary(null);
    setCurrentPage('checker');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F7FA] text-[#263445]">
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onStartNewCheck={handleStartNewCheck}
      />

      <main className="flex-1 w-full max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12">
        {currentPage === 'home' && <HomePage onNavigate={handleNavigate} />}

        {currentPage === 'checker' && (
          <CheckerPage
            selectedIds={selectedIds}
            onChangeSelectedIds={setSelectedIds}
            onCheckInteractions={handleRunCheck}
            onClearAll={handleClearAll}
          />
        )}

        {currentPage === 'results' && (
          <ResultsPage
            summary={checkSummary}
            showExperimentalMl={showExperimentalMl}
            onToggleExperimentalMl={() => setShowExperimentalMl((prev) => !prev)}
            onCheckAnotherCombination={() => handleNavigate('checker')}
            onStartNewCheck={handleStartNewCheck}
          />
        )}

        {currentPage === 'about' && <AboutPage onNavigate={handleNavigate} />}
      </main>

      <footer className="bg-white border-t border-[#DCE5EE] py-6">
        <div className="max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#52637A]">
          <p>
            Drug Interaction Checker · Educational Prototype (Fictional Demo Dataset Only)
          </p>
          <div className="flex items-center gap-5">
            <button
              type="button"
              onClick={() => handleNavigate('home')}
              className="hover:text-[#176B59] transition-colors cursor-pointer"
            >
              Home
            </button>
            <button
              type="button"
              onClick={() => handleNavigate('checker')}
              className="hover:text-[#176B59] transition-colors cursor-pointer"
            >
              Check Interactions
            </button>
            <button
              type="button"
              onClick={() => handleNavigate('about')}
              className="hover:text-[#176B59] transition-colors cursor-pointer"
            >
              About
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
