import {
  AlertOctagon,
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  GitFork,
  Info,
} from 'lucide-react';
import { useState } from 'react';
import type { InteractionCheckSummary, MatchedInteraction } from '../types/interaction';
import { DashboardSummary } from './DashboardSummary';
import { InteractionGraph } from './InteractionGraph';

interface ResultsPageProps {
  summary: InteractionCheckSummary | null;
  showExperimentalMl: boolean;
  onToggleExperimentalMl: () => void;
  onCheckAnotherCombination: () => void;
  onStartNewCheck: () => void;
}

export function ResultsPage({
  summary,
  showExperimentalMl,
  onToggleExperimentalMl,
  onCheckAnotherCombination,
  onStartNewCheck,
}: ResultsPageProps) {
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);

  if (!summary || summary.selectedMedicines.length < 2) {
    return (
      <div className="bg-white rounded-xl border border-[#DCE5EE] shadow-xs p-8 text-center space-y-4">
        <h1 className="font-display text-2xl font-bold text-[#263445]">
          Interaction Results
        </h1>
        <p className="text-sm text-[#52637A] max-w-md mx-auto">
          Select at least two medicines on the checker page to evaluate pairwise interactions.
        </p>
        <button
          type="button"
          onClick={onCheckAnotherCombination}
          className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-white bg-[#176B59] hover:bg-[#125647] rounded-xl transition-colors cursor-pointer"
        >
          Go to Medicine Checker
        </button>
      </div>
    );
  }

  const displayedMatches = showExperimentalMl
    ? summary.allMatches
    : summary.verifiedMatches;

  const getCardStyling = (match: MatchedInteraction) => {
    if (match.evidenceType === 'experimental_ml') {
      return {
        container: 'bg-[#EAF3FA] border-[#BFDBFE]',
        titleText: 'text-[#1E3A8A]',
        bodyText: 'text-[#1E40AF]',
        Icon: GitFork,
        typeLabel: 'Experimental ML Link Prediction',
      };
    }

    if (match.severity === 'Major') {
      return {
        container: 'bg-[#FCE8E8] border-[#F4BDBD]',
        titleText: 'text-[#7F1D1D]',
        bodyText: 'text-[#991B1B]',
        Icon: AlertOctagon,
        typeLabel: 'Verified Demo Dataset Record',
      };
    }

    return {
      container: 'bg-[#FFF0E5] border-[#F5CBB0]',
      titleText: 'text-[#7C2D12]',
      bodyText: 'text-[#9A3412]',
      Icon: AlertTriangle,
      typeLabel: 'Verified Demo Dataset Record',
    };
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#263445]">
            Interaction Results
          </h1>
          <p className="mt-1 text-sm text-[#52637A]">
            Selected combination:{' '}
            <span className="font-medium text-[#263445]">
              {summary.selectedMedicines.map((m) => m.name).join(' · ')}
            </span>
          </p>
        </div>

        <button
          type="button"
          onClick={onCheckAnotherCombination}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-[#176B59] hover:bg-[#125647] rounded-xl transition-colors duration-150 shadow-xs whitespace-nowrap shrink-0 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>Check Another Combination</span>
        </button>
      </div>

      {/* Dashboard Summary */}
      <DashboardSummary
        selectedCount={summary.totalSelected}
        matchingCount={displayedMatches.length}
        pairsCount={summary.totalPairsEvaluated}
        matchingLabel={
          showExperimentalMl ? 'Matching Records & ML Links' : 'Matching Interaction Records'
        }
        onStartNewCheck={onStartNewCheck}
        actionLabel="Start New Check"
      />

      {/* Interaction Result Cards */}
      <section aria-labelledby="interaction-cards-heading" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h2
            id="interaction-cards-heading"
            className="font-display text-lg font-semibold text-[#263445]"
          >
            Pairwise Findings
          </h2>
          <p className="text-xs text-[#52637A]">
            Showing {displayedMatches.length} of {summary.totalPairsEvaluated} evaluated pairs
          </p>
        </div>

        {displayedMatches.length === 0 ? (
          <div
            role="status"
            className="bg-white rounded-xl border border-[#DCE5EE] shadow-xs p-6 sm:p-7 flex items-start gap-4"
          >
            <div className="w-10 h-10 rounded-lg bg-[#EAF3FA] text-[#176B59] flex items-center justify-center shrink-0">
              <Info className="w-5 h-5" aria-hidden="true" />
            </div>
            <div className="space-y-1.5">
              <p className="font-display text-base font-semibold text-[#263445]">
                No interaction record was found in this dataset. This does not mean the combination is safe.
              </p>
              <p className="text-sm text-[#52637A]">
                All {summary.totalPairsEvaluated} medicine pair
                {summary.totalPairsEvaluated === 1 ? '' : 's'} were checked against the currently
                loaded fictional demo dataset. Always consult a qualified healthcare professional for
                clinical medication decisions.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {displayedMatches.map((match) => {
              const style = getCardStyling(match);
              const Icon = style.Icon;
              const isHighlighted = selectedMatchId === match.id;

              return (
                <article
                  key={match.id}
                  onClick={() =>
                    setSelectedMatchId(isHighlighted ? null : match.id)
                  }
                  className={`rounded-xl border p-5 sm:p-6 transition-shadow duration-150 cursor-pointer ${
                    style.container
                  } ${isHighlighted ? 'ring-2 ring-[#176B59]' : 'shadow-xs'}`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="flex items-start gap-3.5">
                      <div className="w-9 h-9 rounded-lg bg-white/85 flex items-center justify-center shrink-0 mt-0.5">
                        <Icon className={`w-5 h-5 ${style.bodyText}`} aria-hidden="true" />
                      </div>
                      <div className="space-y-1">
                        <p className={`text-xs font-medium ${style.bodyText}`}>
                          {style.typeLabel}
                          {match.severity ? ` · Severity: ${match.severity}` : ''}
                        </p>
                        <h3 className={`font-display text-lg font-bold ${style.titleText}`}>
                          {match.medicineA.name} + {match.medicineB.name}
                        </h3>
                      </div>
                    </div>

                    {/* Render severity explicitly ONLY when supported by the source dataset */}
                    {match.severity && (
                      <span
                        className={`self-start px-3 py-1 rounded-lg bg-white/85 text-xs font-semibold ${style.bodyText} whitespace-nowrap`}
                      >
                        Severity: {match.severity}
                      </span>
                    )}
                  </div>

                  <p className={`mt-3 text-sm leading-relaxed ${style.titleText}`}>
                    {match.description}
                  </p>

                  {match.source && (
                    <div className="mt-4 pt-3 border-t border-black/10 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <span className={style.bodyText}>
                        <strong>Source:</strong> {match.source}
                      </span>
                      {match.mlConfidenceNote && (
                        <span className={style.bodyText}>{match.mlConfidenceNote}</span>
                      )}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* Interactive Network Graph */}
      <InteractionGraph
        medicines={summary.selectedMedicines}
        matches={summary.allMatches}
        showExperimentalMl={showExperimentalMl}
        onToggleExperimentalMl={onToggleExperimentalMl}
        selectedMatchId={selectedMatchId}
        onSelectMatch={setSelectedMatchId}
      />

      {/* Evaluated Pairs Matrix */}
      <section
        aria-labelledby="evaluated-pairs-heading"
        className="bg-white rounded-xl border border-[#DCE5EE] shadow-xs p-5 sm:p-6 space-y-4"
      >
        <div>
          <h2
            id="evaluated-pairs-heading"
            className="font-display text-base font-semibold text-[#263445]"
          >
            All Evaluated Medicine Pairs
          </h2>
          <p className="text-xs text-[#52637A] mt-0.5">
            Complete list of unique pairs compared from your selection.
          </p>
        </div>

        <div className="divide-y divide-[#EEF3F8] border border-[#E5ECF3] rounded-xl overflow-hidden">
          {summary.evaluatedPairs.map((pair) => {
            const matchRecord = displayedMatches.find(
              (m) =>
                (m.medicineAId === pair.medicineA.id && m.medicineBId === pair.medicineB.id) ||
                (m.medicineAId === pair.medicineB.id && m.medicineBId === pair.medicineA.id)
            );
            return (
              <div
                key={`${pair.medicineA.id}-${pair.medicineB.id}`}
                className="px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm bg-white"
              >
                <span className="font-medium text-[#263445]">
                  {pair.medicineA.name} + {pair.medicineB.name}
                </span>

                {matchRecord ? (
                  <span
                    className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
                      matchRecord.evidenceType === 'experimental_ml'
                        ? 'text-[#1E40AF]'
                        : matchRecord.severity === 'Major'
                          ? 'text-[#991B1B]'
                          : 'text-[#9A3412]'
                    }`}
                  >
                    <AlertTriangle className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>
                      {matchRecord.evidenceType === 'experimental_ml'
                        ? 'Experimental ML Prediction'
                        : matchRecord.severity
                          ? `Record Found (${matchRecord.severity})`
                          : 'Record Found'}
                    </span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#52637A]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#176B59]" aria-hidden="true" />
                    <span>No record found in dataset</span>
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom Action Row */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        <button
          type="button"
          onClick={onCheckAnotherCombination}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-medium text-white bg-[#176B59] hover:bg-[#125647] rounded-xl transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>Check Another Combination</span>
        </button>

        <p className="text-xs text-[#52637A]">
          Educational prototype only · Fictional DemoDrug A–E records
        </p>
      </div>
    </div>
  );
}
