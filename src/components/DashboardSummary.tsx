import { RotateCcw } from 'lucide-react';

interface DashboardSummaryProps {
  selectedCount: number;
  matchingCount: number;
  pairsCount: number;
  matchingLabel?: string;
  onStartNewCheck: () => void;
  actionLabel?: string;
}

export function DashboardSummary({
  selectedCount,
  matchingCount,
  pairsCount,
  matchingLabel = 'Matching Interaction Records',
  onStartNewCheck,
  actionLabel = 'Start New Check',
}: DashboardSummaryProps) {
  return (
    <section
      aria-label="Interaction check summary"
      className="bg-white rounded-xl border border-[#DCE5EE] shadow-xs p-4 sm:p-5"
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-0 sm:divide-x sm:divide-[#E5ECF3] flex-1">
          <div className="sm:pr-6">
            <p className="text-xs font-medium text-[#52637A]">Total Selected Medicines</p>
            <p className="mt-1 font-display text-2xl font-bold text-[#263445] tabular-nums">
              {selectedCount}
            </p>
          </div>

          <div className="sm:px-6">
            <p className="text-xs font-medium text-[#52637A]">{matchingLabel}</p>
            <p
              className={`mt-1 font-display text-2xl font-bold tabular-nums ${
                matchingCount > 0 ? 'text-[#9A3412]' : 'text-[#176B59]'
              }`}
            >
              {matchingCount}
            </p>
          </div>

          <div className="sm:pl-6">
            <p className="text-xs font-medium text-[#52637A]">Unique Pairs Evaluated</p>
            <p className="mt-1 font-display text-2xl font-bold text-[#263445] tabular-nums">
              {pairsCount}
            </p>
          </div>
        </div>

        <div className="pt-2 lg:pt-0 lg:pl-6 lg:border-l lg:border-[#E5ECF3] shrink-0">
          <button
            type="button"
            onClick={onStartNewCheck}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-[#176B59] bg-[#EAF3FA] hover:bg-[#dcebf7] rounded-lg transition-colors duration-150 whitespace-nowrap cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" aria-hidden="true" />
            <span>{actionLabel}</span>
          </button>
        </div>
      </div>
    </section>
  );
}
