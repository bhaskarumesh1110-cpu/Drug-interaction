import {
  AlertCircle,
  Check,
  Plus,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  calculatePairCount,
  checkMedicineInteractions,
  getAllMedicines,
  searchMedicines,
} from '../services/interactionService';
import type { Medicine } from '../types/interaction';
import { DashboardSummary } from './DashboardSummary';

interface CheckerPageProps {
  selectedIds: string[];
  onChangeSelectedIds: (ids: string[]) => void;
  onCheckInteractions: () => void;
  onClearAll: () => void;
}

export function CheckerPage({
  selectedIds,
  onChangeSelectedIds,
  onCheckInteractions,
  onClearAll,
}: CheckerPageProps) {
  const [query, setQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [liveMatchCount, setLiveMatchCount] = useState(0);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const allMedicines = useMemo(() => getAllMedicines(), []);
  const medicineMap = useMemo(
    () => new Map(allMedicines.map((med) => [med.id, med])),
    [allMedicines]
  );

  const selectedMedicines = useMemo(
    () =>
      selectedIds
        .map((id) => medicineMap.get(id))
        .filter((med): med is Medicine => Boolean(med)),
    [selectedIds, medicineMap]
  );

  const suggestions = useMemo(() => searchMedicines(query), [query]);

  useEffect(() => {
    setHighlightedIndex(0);
  }, [query, suggestions.length]);

  useEffect(() => {
    let active = true;
    if (selectedIds.length < 2) {
      setLiveMatchCount(0);
      return;
    }
    checkMedicineInteractions(selectedIds, { includeExperimentalMl: true }).then((res) => {
      if (active) {
        setLiveMatchCount(res.verifiedMatches.length);
      }
    });
    return () => {
      active = false;
    };
  }, [selectedIds]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMedicine = (medicineId: string) => {
    if (selectedIds.includes(medicineId)) {
      onChangeSelectedIds(selectedIds.filter((id) => id !== medicineId));
    } else {
      onChangeSelectedIds([...selectedIds, medicineId]);
    }
  };

  const removeMedicine = (medicineId: string) => {
    onChangeSelectedIds(selectedIds.filter((id) => id !== medicineId));
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isDropdownOpen && (event.key === 'ArrowDown' || event.key === 'Enter')) {
      setIsDropdownOpen(true);
      return;
    }

    if (event.key === 'Escape') {
      setIsDropdownOpen(false);
      return;
    }

    if (!suggestions.length) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setHighlightedIndex((prev) => (prev + 1) % suggestions.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setHighlightedIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
    } else if (event.key === 'Enter' && isDropdownOpen) {
      event.preventDefault();
      const chosen = suggestions[highlightedIndex];
      if (chosen) {
        toggleMedicine(chosen.id);
      }
    }
  };

  const canCheck = selectedMedicines.length >= 2;
  const pairCount = calculatePairCount(selectedMedicines.length);

  const presets = [
    {
      label: 'DemoDrug A + B + D',
      ids: ['demo-drug-a', 'demo-drug-b', 'demo-drug-d'],
    },
    {
      label: 'DemoDrug B + C + D',
      ids: ['demo-drug-b', 'demo-drug-c', 'demo-drug-d'],
    },
    {
      label: 'DemoDrug C + E (No Record)',
      ids: ['demo-drug-c', 'demo-drug-e'],
    },
  ];

  return (
    <div className="space-y-6 pb-8">
      <div className="space-y-1">
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#263445]">
          Medicine Interaction Checker
        </h1>
        <p className="text-sm sm:text-base text-[#52637A]">
          Search and select two or more fictional demo medicines to compare all pairs against the dataset.
        </p>
      </div>

      {/* Dashboard Summary */}
      <DashboardSummary
        selectedCount={selectedMedicines.length}
        matchingCount={liveMatchCount}
        pairsCount={pairCount}
        matchingLabel="Verified Dataset Matches"
        onStartNewCheck={onClearAll}
        actionLabel="Start New Check"
      />

      {/* Main Checker Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Search & Suggestions */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-[#DCE5EE] shadow-xs p-5 sm:p-6 space-y-5">
          <div>
            <label
              htmlFor="medicine-search-input"
              className="block text-sm font-semibold text-[#263445] mb-2"
            >
              Search Medicines
            </label>

            <div ref={searchContainerRef} className="relative">
              <div className="relative flex items-center">
                <Search
                  className="w-4 h-4 text-[#52637A] absolute left-3.5 pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  id="medicine-search-input"
                  type="text"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setIsDropdownOpen(true);
                  }}
                  onFocus={() => setIsDropdownOpen(true)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search medicine name..."
                  role="combobox"
                  aria-expanded={isDropdownOpen}
                  aria-controls="medicine-suggestions-list"
                  aria-autocomplete="list"
                  className="w-full pl-10 pr-10 py-3 text-sm bg-[#F9FBFD] border border-[#CBD8E6] rounded-xl text-[#263445] placeholder:text-[#6B7E95] focus:bg-white focus:border-[#176B59] transition-colors"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    aria-label="Clear search query"
                    className="absolute right-3 p-1 rounded-md text-[#52637A] hover:text-[#263445] hover:bg-[#EAF3FA] cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Search Suggestions Dropdown */}
              {isDropdownOpen && (
                <ul
                  id="medicine-suggestions-list"
                  role="listbox"
                  aria-label="Medicine suggestions"
                  className="absolute z-20 mt-2 w-full bg-white rounded-xl border border-[#DCE5EE] shadow-md max-h-72 overflow-y-auto divide-y divide-[#EEF3F8]"
                >
                  {suggestions.length === 0 ? (
                    <li className="px-4 py-4 text-sm text-[#52637A]">
                      No demo medicines matched "{query}". Try searching "DemoDrug".
                    </li>
                  ) : (
                    suggestions.map((medicine, idx) => {
                      const isSelected = selectedIds.includes(medicine.id);
                      const isHighlighted = idx === highlightedIndex;
                      return (
                        <li key={medicine.id} role="option" aria-selected={isSelected}>
                          <button
                            type="button"
                            onClick={() => toggleMedicine(medicine.id)}
                            className={`w-full text-left px-4 py-3 flex items-center justify-between gap-3 transition-colors cursor-pointer ${
                              isHighlighted ? 'bg-[#EAF3FA]/70' : 'hover:bg-[#F4F7FA]'
                            }`}
                          >
                            <div>
                              <p className="text-sm font-semibold text-[#263445]">
                                {medicine.name}
                              </p>
                              <p className="text-xs text-[#52637A]">
                                {medicine.fictionalClass} · {medicine.datasetTag}
                              </p>
                            </div>
                            <span
                              className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg shrink-0 ${
                                isSelected
                                  ? 'bg-[#176B59] text-white'
                                  : 'bg-[#EAF3FA] text-[#176B59]'
                              }`}
                            >
                              {isSelected ? (
                                <>
                                  <Check className="w-3.5 h-3.5" aria-hidden="true" />
                                  <span>Selected</span>
                                </>
                              ) : (
                                <>
                                  <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                                  <span>Add</span>
                                </>
                              )}
                            </span>
                          </button>
                        </li>
                      );
                    })
                  )}
                </ul>
              )}
            </div>
          </div>

          {/* Available Fictional Demo Medicines Quick Catalog */}
          <div className="pt-2 border-t border-[#EEF3F8] space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-sm font-semibold text-[#263445]">
                Available Demo Medicines
              </h2>
              <span className="text-xs text-[#52637A] tabular-nums">
                {allMedicines.length} fictional entries
              </span>
            </div>

            <div className="divide-y divide-[#EEF3F8] border border-[#E5ECF3] rounded-xl overflow-hidden">
              {allMedicines.map((medicine) => {
                const isSelected = selectedIds.includes(medicine.id);
                return (
                  <div
                    key={medicine.id}
                    className={`px-4 py-3 flex items-center justify-between gap-4 transition-colors ${
                      isSelected ? 'bg-[#EAF3FA]/55' : 'bg-white'
                    }`}
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#263445] truncate">
                        {medicine.name}
                      </p>
                      <p className="text-xs text-[#52637A] truncate">
                        {medicine.fictionalClass}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleMedicine(medicine.id)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors shrink-0 whitespace-nowrap cursor-pointer ${
                        isSelected
                          ? 'bg-[#176B59] text-white hover:bg-[#125647]'
                          : 'bg-[#F4F7FA] text-[#263445] hover:bg-[#EAF3FA] border border-[#DCE5EE]'
                      }`}
                    >
                      {isSelected ? 'Selected' : 'Select'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Selected Medicines & Actions */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-[#DCE5EE] shadow-xs p-5 sm:p-6 space-y-5">
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-display text-lg font-semibold text-[#263445]">
              Selected Medicines
            </h2>
            <span className="text-xs font-medium text-[#52637A] tabular-nums">
              {selectedMedicines.length} selected
            </span>
          </div>

          {/* Removable Chips */}
          {selectedMedicines.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[#CBD8E6] bg-[#F9FBFD] p-6 text-center space-y-1.5">
              <p className="text-sm font-medium text-[#263445]">
                No medicines selected yet
              </p>
              <p className="text-xs text-[#52637A]">
                Search by name or select at least 2 medicines from the demo list to run an interaction check.
              </p>
            </div>
          ) : (
            <div
              aria-label="Selected medicines list"
              className="flex flex-wrap gap-2.5"
            >
              {selectedMedicines.map((medicine) => (
                <div
                  key={medicine.id}
                  className="inline-flex items-center gap-2 pl-3.5 pr-2 py-2 rounded-lg bg-[#EAF3FA] border border-[#C6DDF0] text-sm font-medium text-[#263445]"
                >
                  <span>{medicine.name}</span>
                  <button
                    type="button"
                    onClick={() => removeMedicine(medicine.id)}
                    aria-label={`Remove ${medicine.name}`}
                    title={`Remove ${medicine.name}`}
                    className="w-6 h-6 rounded-md inline-flex items-center justify-center text-[#52637A] hover:text-[#991B1B] hover:bg-white/80 transition-colors cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Validation Guard */}
          {!canCheck && (
            <div
              role="status"
              className="flex items-start gap-2.5 p-3.5 rounded-lg bg-[#FFF0E5] border border-[#F5CBB0] text-xs text-[#7C2D12]"
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#9A3412]" aria-hidden="true" />
              <span>
                Select at least <strong>2 medicines</strong> to check interactions.{' '}
                {selectedMedicines.length === 1
                  ? 'Add 1 more medicine to form a pair.'
                  : 'Currently 0 medicines selected.'}
              </span>
            </div>
          )}

          {/* Primary & Clear Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-1">
            <button
              type="button"
              disabled={!canCheck}
              onClick={onCheckInteractions}
              className={`flex-1 inline-flex items-center justify-center px-5 py-3 text-sm font-medium rounded-xl transition-colors duration-150 whitespace-nowrap ${
                canCheck
                  ? 'bg-[#176B59] hover:bg-[#125647] text-white shadow-xs cursor-pointer'
                  : 'bg-[#E2E8F0] text-[#64748B] cursor-not-allowed'
              }`}
            >
              Check Interactions
            </button>

            <button
              type="button"
              disabled={selectedMedicines.length === 0}
              onClick={onClearAll}
              className={`inline-flex items-center justify-center gap-1.5 px-4 py-3 text-sm font-medium rounded-xl border transition-colors duration-150 whitespace-nowrap ${
                selectedMedicines.length > 0
                  ? 'border-[#DCE5EE] text-[#263445] bg-white hover:bg-[#FCE8E8] hover:text-[#991B1B] hover:border-[#F5C2C2] cursor-pointer'
                  : 'border-[#E5ECF3] text-[#94A3B8] bg-[#F9FBFD] cursor-not-allowed'
              }`}
            >
              <Trash2 className="w-4 h-4" aria-hidden="true" />
              <span>Clear All</span>
            </button>
          </div>

          {/* Quick Educational Presets */}
          <div className="pt-4 border-t border-[#EEF3F8] space-y-2.5">
            <p className="text-xs font-medium text-[#52637A]">
              Quick Test Combinations
            </p>
            <div className="flex flex-wrap gap-2">
              {presets.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => onChangeSelectedIds(preset.ids)}
                  className="px-3 py-1.5 text-xs font-medium text-[#176B59] bg-[#F4F7FA] hover:bg-[#EAF3FA] border border-[#DCE5EE] rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
