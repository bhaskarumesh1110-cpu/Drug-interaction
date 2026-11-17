import {
  ArrowRight,
  Cpu,
  Database,
  GitFork,
  Layers,
  ShieldAlert,
} from 'lucide-react';
import { DATA_LAYER_CONFIG } from '../services/interactionService';
import type { PageView } from '../types/interaction';

interface AboutPageProps {
  onNavigate: (page: PageView) => void;
}

export function AboutPage({ onNavigate }: AboutPageProps) {
  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <section className="bg-white rounded-2xl border border-[#DCE5EE] shadow-xs p-6 sm:p-10">
        <p className="text-xs font-medium text-[#176B59] mb-2">
          Project Overview & Methodology
        </p>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#263445] [text-wrap:balance]">
          About Drug Interaction Checker
        </h1>
        <p className="mt-3 text-base text-[#52637A] leading-relaxed max-w-3xl">
          Drug Interaction Checker is an educational web application built for patients,
          pharmacy students, and healthcare educators to practice identifying potential
          pairwise interactions when multiple medicines are reviewed together.
        </p>
      </section>

      {/* Main Features & Pairwise Checking Explanation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-white rounded-xl border border-[#DCE5EE] shadow-xs p-6 space-y-4">
          <div className="w-10 h-10 rounded-lg bg-[#EAF3FA] text-[#176B59] flex items-center justify-center">
            <Layers className="w-5 h-5" aria-hidden="true" />
          </div>
          <h2 className="font-display text-xl font-semibold text-[#263445]">
            How Medicine Pairs Are Checked
          </h2>
          <p className="text-sm text-[#52637A] leading-relaxed">
            When you select <span className="font-mono text-[#263445]">n</span> medicines,
            the checker generates every unique unordered pair using combinations{' '}
            <span className="font-mono text-[#263445]">n × (n − 1) / 2</span>. For example,
            selecting 4 medicines produces 6 unique pairs.
          </p>
          <ul className="space-y-2 text-sm text-[#263445] pt-1">
            <li>1. Each unique pair is queried symmetrically (A + B matches B + A).</li>
            <li>2. Severity is displayed strictly when supported by the source dataset.</li>
            <li>3. Missing records trigger an explicit caution that absence of a record does not imply safety.</li>
          </ul>
        </section>

        <section className="bg-white rounded-xl border border-[#DCE5EE] shadow-xs p-6 space-y-4">
          <div className="w-10 h-10 rounded-lg bg-[#EAF3FA] text-[#176B59] flex items-center justify-center">
            <Database className="w-5 h-5" aria-hidden="true" />
          </div>
          <h2 className="font-display text-xl font-semibold text-[#263445]">
            Technology & Backend-Ready Architecture
          </h2>
          <p className="text-sm text-[#52637A] leading-relaxed">
            The frontend is implemented with React, TypeScript, and Tailwind CSS, using a
            cleanly separated data service layer so a future Python Flask API can be
            connected without rewriting UI components.
          </p>
          <div className="bg-[#F4F7FA] rounded-lg border border-[#DCE5EE] p-4 space-y-1.5 text-xs font-mono text-[#263445]">
            <p>Data Layer Endpoints Prepared:</p>
            <p className="text-[#176B59]">{DATA_LAYER_CONFIG.endpoints.listMedicines}</p>
            <p className="text-[#176B59]">{DATA_LAYER_CONFIG.endpoints.checkInteractions}</p>
          </div>
        </section>
      </div>

      {/* Future Scope: Graph ML */}
      <section className="bg-white rounded-xl border border-[#DCE5EE] shadow-xs p-6 sm:p-8 space-y-4">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-xl bg-[#EAF3FA] text-[#176B59] flex items-center justify-center shrink-0">
            <Cpu className="w-5 h-5" aria-hidden="true" />
          </div>
          <div className="space-y-3">
            <h2 className="font-display text-xl font-semibold text-[#263445]">
              Future Scope: Graph-Based Machine Learning & Link Prediction
            </h2>
            <p className="text-sm text-[#52637A] leading-relaxed max-w-3xl">
              Known clinical drug interaction databases cannot cover every possible multi-drug
              combination. In future iterations, drug interaction networks can be modeled as a
              graph where medicines are nodes and documented interactions are edges.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-[#F4F7FA] border border-[#DCE5EE] space-y-1.5">
                <p className="text-sm font-semibold text-[#263445] flex items-center gap-2">
                  <GitFork className="w-4 h-4 text-[#176B59]" aria-hidden="true" />
                  <span>Graph Link Prediction</span>
                </p>
                <p className="text-xs text-[#52637A] leading-relaxed">
                  Graph Neural Networks (GNNs) and structural similarity embeddings can score
                  untested drug pairs to prioritize candidate interactions for pharmacological research.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-[#F4F7FA] border border-[#DCE5EE] space-y-1.5">
                <p className="text-sm font-semibold text-[#263445] flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-[#2563EB]" aria-hidden="true" />
                  <span>Clear Visual Separation</span>
                </p>
                <p className="text-xs text-[#52637A] leading-relaxed">
                  In the Interaction Graph, verified dataset records always render as solid lines,
                  while experimental ML predictions render as dashed lines so users never confuse
                  predictions with established clinical records.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#EAF3FA] rounded-xl border border-[#C6DDF0] p-6">
        <div>
          <h3 className="font-display text-lg font-semibold text-[#263445]">
            Ready to test the demo dataset?
          </h3>
          <p className="text-sm text-[#52637A]">
            Try selecting DemoDrug A, DemoDrug B, DemoDrug C, DemoDrug D, or DemoDrug E.
          </p>
        </div>
        <button
          type="button"
          onClick={() => onNavigate('checker')}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-[#176B59] hover:bg-[#125647] rounded-xl transition-colors cursor-pointer whitespace-nowrap"
        >
          <span>Open Checker</span>
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
