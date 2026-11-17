import {
  AlertTriangle,
  ArrowRight,
  GitFork,
  Search,
  ShieldCheck,
} from 'lucide-react';
import { useState } from 'react';
import type { PageView } from '../types/interaction';

interface HomePageProps {
  onNavigate: (page: PageView) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const [imageError, setImageError] = useState(false);

  const features = [
    {
      title: 'Search Medicines',
      description:
        'Quickly look up medicines from the structured dataset, review suggestions, and build a multi-drug selection list.',
      icon: Search,
      actionLabel: 'Open Medicine Search',
      targetPage: 'checker' as PageView,
    },
    {
      title: 'Check Interactions',
      description:
        'Automatically compare every selected medicine pair against available records with clear severity and source details.',
      icon: ShieldCheck,
      actionLabel: 'Check Combinations',
      targetPage: 'checker' as PageView,
    },
    {
      title: 'Visualize Interaction Graph',
      description:
        'Explore selected medicines as connected nodes with distinct line styles for verified records and ML predictions.',
      icon: GitFork,
      actionLabel: 'Explore Methodology',
      targetPage: 'about' as PageView,
    },
  ];

  return (
    <div className="space-y-12 pb-8">
      {/* Hero Section */}
      <section className="bg-white rounded-2xl border border-[#DCE5EE] shadow-xs overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
          <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-center">
            <p className="text-xs font-medium text-[#176B59] mb-3">
              Educational Pharmacology Prototype · Fictional Demo Dataset
            </p>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-[42px] font-bold tracking-tight text-[#263445] leading-[1.15] [text-wrap:balance]">
              Check Your Medicine Combinations
            </h1>
            <p className="mt-4 text-base sm:text-lg text-[#52637A] leading-relaxed max-w-xl">
              Explore known medicine interaction records in one place. Designed to help
              patients and pharmacy students inspect multi-drug pairs clearly and responsibly.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => onNavigate('checker')}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm sm:text-base font-medium text-white bg-[#176B59] hover:bg-[#125647] rounded-xl transition-colors duration-150 shadow-xs cursor-pointer whitespace-nowrap"
              >
                <span>Start Checking</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate('about')}
                className="inline-flex items-center justify-center px-5 py-3 text-sm sm:text-base font-medium text-[#263445] bg-[#EAF3FA] hover:bg-[#dcebf7] rounded-xl transition-colors duration-150 cursor-pointer whitespace-nowrap"
              >
                How Pair Checking Works
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 bg-[#EAF3FA] min-h-[260px] lg:min-h-[380px] relative flex items-center justify-center border-t lg:border-t-0 lg:border-l border-[#DCE5EE]">
            {!imageError ? (
              <img
                src="/src/assets/images/hero_pharmacology_network_1794911571039.jpg"
                alt="Illustration of connected medicine nodes in a drug interaction network"
                referrerPolicy="no-referrer"
                onError={() => setImageError(true)}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="p-8 text-center flex flex-col items-center justify-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-white border border-[#DCE5EE] flex items-center justify-center text-[#176B59]">
                  <GitFork className="w-7 h-7" aria-hidden="true" />
                </div>
                <p className="text-sm font-medium text-[#263445]">
                  Pairwise Interaction Network
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section aria-labelledby="features-heading" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <h2
              id="features-heading"
              className="font-display text-2xl font-bold text-[#263445]"
            >
              Core Capabilities
            </h2>
            <p className="mt-1 text-sm text-[#52637A]">
              Three focused steps to build a medicine list, inspect records, and review network links.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="bg-white rounded-xl border border-[#DCE5EE] shadow-xs p-6 flex flex-col justify-between hover:border-[#176B59]/40 transition-colors duration-150"
              >
                <div>
                  <div className="w-11 h-11 rounded-xl bg-[#EAF3FA] text-[#176B59] flex items-center justify-center mb-5">
                    <Icon className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-[#263445]">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm text-[#52637A] leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#EEF3F8]">
                  <button
                    type="button"
                    onClick={() => onNavigate(feature.targetPage)}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-[#176B59] hover:text-[#125647] transition-colors cursor-pointer"
                  >
                    <span>{feature.actionLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Important Medical Safety Notice */}
      <section
        aria-labelledby="safety-notice-heading"
        className="bg-[#FFF0E5] rounded-xl border border-[#F5CBB0] p-6 sm:p-7"
      >
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-white/80 border border-[#F5CBB0] text-[#9A3412] flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" aria-hidden="true" />
          </div>
          <div className="space-y-2">
            <h2
              id="safety-notice-heading"
              className="font-display text-lg font-semibold text-[#7C2D12]"
            >
              Important Medical Safety Notice
            </h2>
            <p className="text-sm text-[#7C2D12]/90 leading-relaxed max-w-3xl">
              This application is an educational prototype designed for learning and user interface
              demonstration. It is not a medical device and does not replace advice from a licensed
              physician, pharmacist, or qualified healthcare provider.
            </p>
            <p className="text-xs font-medium text-[#9A3412]">
              Demonstration Dataset Notice: All medicine entries (DemoDrug A–E) and interaction
              records in this version are strictly fictional placeholders.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
