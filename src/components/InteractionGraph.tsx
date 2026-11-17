import { Info } from 'lucide-react';
import { useState } from 'react';
import type { MatchedInteraction, Medicine } from '../types/interaction';

interface InteractionGraphProps {
  medicines: Medicine[];
  matches: MatchedInteraction[];
  showExperimentalMl: boolean;
  onToggleExperimentalMl: () => void;
  selectedMatchId: string | null;
  onSelectMatch: (matchId: string | null) => void;
}

interface NodePosition {
  medicine: Medicine;
  x: number;
  y: number;
}

export function InteractionGraph({
  medicines,
  matches,
  showExperimentalMl,
  onToggleExperimentalMl,
  selectedMatchId,
  onSelectMatch,
}: InteractionGraphProps) {
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  const width = 720;
  const height = 400;
  const centerX = width / 2;
  const centerY = height / 2;

  // Arrange selected medicine nodes around a clean ellipse so labels never collide
  const radiusX = medicines.length <= 2 ? 175 : 210;
  const radiusY = medicines.length <= 2 ? 0 : 128;

  const nodePositions: NodePosition[] = medicines.map((medicine, index) => {
    const angleOffset = -Math.PI / 2;
    const angle = angleOffset + (2 * Math.PI * index) / Math.max(medicines.length, 1);
    return {
      medicine,
      x: centerX + radiusX * Math.cos(angle),
      y: centerY + radiusY * Math.sin(angle),
    };
  });

  const positionMap = new Map(nodePositions.map((pos) => [pos.medicine.id, pos]));

  const visibleMatches = showExperimentalMl
    ? matches
    : matches.filter((m) => m.evidenceType !== 'experimental_ml');

  const getEdgeStyle = (match: MatchedInteraction) => {
    if (match.evidenceType === 'experimental_ml') {
      return {
        stroke: '#2563EB',
        dashArray: '7 5',
        label: 'ML Prediction',
      };
    }
    if (match.severity === 'Major') {
      return {
        stroke: '#B91C1C',
        dashArray: undefined,
        label: 'Major (Verified)',
      };
    }
    if (match.severity === 'Moderate') {
      return {
        stroke: '#C2410C',
        dashArray: undefined,
        label: 'Moderate (Verified)',
      };
    }
    return {
      stroke: '#176B59',
      dashArray: undefined,
      label: 'Verified Record',
    };
  };

  const activeMatch = visibleMatches.find((m) => m.id === selectedMatchId) ?? null;

  return (
    <section
      aria-labelledby="graph-heading"
      className="bg-white rounded-xl border border-[#DCE5EE] shadow-xs overflow-hidden"
    >
      <div className="p-5 sm:p-6 border-b border-[#E5ECF3] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 id="graph-heading" className="font-display text-lg font-semibold text-[#263445]">
            Interaction Network Graph
          </h2>
          <p className="text-xs sm:text-sm text-[#52637A] mt-0.5">
            Nodes represent selected medicines. Click any connecting line to inspect its interaction record.
          </p>
        </div>

        <label className="inline-flex items-center gap-2.5 text-sm text-[#263445] cursor-pointer select-none shrink-0">
          <input
            type="checkbox"
            checked={showExperimentalMl}
            onChange={onToggleExperimentalMl}
            className="w-4 h-4 rounded accent-[#176B59] cursor-pointer"
          />
          <span className="font-medium">Show experimental ML predictions</span>
        </label>
      </div>

      {/* SVG Graph Canvas */}
      <div className="bg-[#F9FBFD] p-4 sm:p-6">
        <div className="w-full overflow-x-auto">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            role="img"
            aria-label={`Interaction graph showing ${medicines.length} selected medicines and ${visibleMatches.length} interaction connections`}
            className="w-full max-w-[720px] h-auto mx-auto block"
          >
            {/* Subtle background guide ring */}
            {medicines.length > 2 && (
              <ellipse
                cx={centerX}
                cy={centerY}
                rx={radiusX}
                ry={radiusY}
                fill="none"
                stroke="#E5ECF3"
                strokeWidth="1"
                strokeDasharray="3 4"
              />
            )}

            {/* Interaction Edges */}
            {visibleMatches.map((match) => {
              const posA = positionMap.get(match.medicineAId);
              const posB = positionMap.get(match.medicineBId);
              if (!posA || !posB) return null;

              const style = getEdgeStyle(match);
              const isSelected = selectedMatchId === match.id;
              const isConnectedToHovered =
                hoveredNodeId === match.medicineAId || hoveredNodeId === match.medicineBId;
              const dimmed =
                (hoveredNodeId !== null && !isConnectedToHovered) ||
                (selectedMatchId !== null && !isSelected);

              const midX = (posA.x + posB.x) / 2;
              const midY = (posA.y + posB.y) / 2;

              return (
                <g
                  key={match.id}
                  onClick={() => onSelectMatch(isSelected ? null : match.id)}
                  className="cursor-pointer"
                  style={{ opacity: dimmed ? 0.28 : 1, transition: 'opacity 150ms ease' }}
                >
                  {/* Wide transparent hit target for easier clicking */}
                  <line
                    x1={posA.x}
                    y1={posA.y}
                    x2={posB.x}
                    y2={posB.y}
                    stroke="transparent"
                    strokeWidth={18}
                  />
                  <line
                    x1={posA.x}
                    y1={posA.y}
                    x2={posB.x}
                    y2={posB.y}
                    stroke={style.stroke}
                    strokeWidth={isSelected ? 4.5 : 3}
                    strokeDasharray={style.dashArray}
                    strokeLinecap="round"
                  />
                  {/* Edge midpoint label */}
                  <g transform={`translate(${midX}, ${midY})`}>
                    <rect
                      x={-52}
                      y={-11}
                      width={104}
                      height={22}
                      rx={6}
                      fill="#FFFFFF"
                      stroke={style.stroke}
                      strokeWidth={1.25}
                    />
                    <text
                      x={0}
                      y={3.5}
                      textAnchor="middle"
                      fontSize="10.5"
                      fontWeight="600"
                      fill={style.stroke}
                      fontFamily="DM Sans, sans-serif"
                    >
                      {style.label}
                    </text>
                  </g>
                </g>
              );
            })}

            {/* Medicine Nodes */}
            {nodePositions.map(({ medicine, x, y }) => {
              const connectionCount = visibleMatches.filter(
                (m) => m.medicineAId === medicine.id || m.medicineBId === medicine.id
              ).length;
              const isHovered = hoveredNodeId === medicine.id;
              const hasInteraction = connectionCount > 0;

              return (
                <g
                  key={medicine.id}
                  transform={`translate(${x}, ${y})`}
                  onMouseEnter={() => setHoveredNodeId(medicine.id)}
                  onMouseLeave={() => setHoveredNodeId(null)}
                  className="cursor-pointer"
                >
                  <circle
                    r={isHovered ? 31 : 28}
                    fill={hasInteraction ? '#EAF3FA' : '#FFFFFF'}
                    stroke={hasInteraction ? '#176B59' : '#94A3B8'}
                    strokeWidth={isHovered ? 3 : 2}
                  />
                  <text
                    x={0}
                    y={-2}
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight="700"
                    fill="#263445"
                    fontFamily="Plus Jakarta Sans, sans-serif"
                  >
                    {medicine.name.replace('DemoDrug ', 'Drug ')}
                  </text>
                  <text
                    x={0}
                    y={12}
                    textAnchor="middle"
                    fontSize="9.5"
                    fontWeight="500"
                    fill="#52637A"
                    fontFamily="JetBrains Mono, monospace"
                  >
                    {connectionCount} {connectionCount === 1 ? 'link' : 'links'}
                  </text>

                  {/* Full name caption underneath node */}
                  <text
                    x={0}
                    y={46}
                    textAnchor="middle"
                    fontSize="12"
                    fontWeight="600"
                    fill="#263445"
                    fontFamily="DM Sans, sans-serif"
                  >
                    {medicine.name}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Selected Edge Details Callout */}
        {activeMatch && (
          <div className="mt-4 bg-white rounded-lg border border-[#DCE5EE] p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm">
            <div className="flex items-start gap-2.5">
              <Info className="w-4 h-4 text-[#176B59] mt-0.5 shrink-0" aria-hidden="true" />
              <div>
                <p className="font-semibold text-[#263445]">
                  {activeMatch.medicineA.name} + {activeMatch.medicineB.name}
                  {activeMatch.severity ? ` · Severity: ${activeMatch.severity}` : ''}
                </p>
                <p className="text-xs text-[#52637A] mt-0.5">{activeMatch.description}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onSelectMatch(null)}
              className="text-xs font-medium text-[#176B59] hover:underline shrink-0 self-start sm:self-center cursor-pointer"
            >
              Clear highlight
            </button>
          </div>
        )}
      </div>

      {/* Graph Legend */}
      <div className="px-5 py-4 bg-white border-t border-[#E5ECF3] flex flex-wrap items-center gap-x-6 gap-y-2.5 text-xs text-[#263445]">
        <span className="font-semibold text-[#52637A]">Graph Legend:</span>

        <div className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className="w-4 h-4 rounded-full bg-[#EAF3FA] border-2 border-[#176B59] inline-block"
          />
          <span>Selected Medicine Node</span>
        </div>

        <div className="flex items-center gap-2">
          <span aria-hidden="true" className="w-6 h-0.5 bg-[#176B59] inline-block" />
          <span>Verified Dataset Record (Solid Line)</span>
        </div>

        <div className="flex items-center gap-2">
          <span aria-hidden="true" className="w-6 h-0.5 bg-[#C2410C] inline-block" />
          <span>Moderate Dataset Alert</span>
        </div>

        <div className="flex items-center gap-2">
          <span aria-hidden="true" className="w-6 h-0.5 bg-[#B91C1C] inline-block" />
          <span>Major Dataset Alert</span>
        </div>

        <div className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className="w-6 border-t-2 border-dashed border-[#2563EB] inline-block"
          />
          <span>Experimental ML Prediction (Dashed Line)</span>
        </div>
      </div>
    </section>
  );
}
