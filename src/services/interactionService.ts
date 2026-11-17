import { DEMO_INTERACTION_RECORDS, DEMO_MEDICINES } from '../data/demoDataset';
import type {
  InteractionCheckSummary,
  MatchedInteraction,
  Medicine,
} from '../types/interaction';

/**
 * Data Access Layer (Backend-Ready Abstraction)
 * ---------------------------------------------
 * All medicine lookups and pairwise interaction checks go through this module.
 * Currently backed by the local fictional demo dataset so the app runs offline
 * without paid APIs. To connect a Python Flask backend later, set
 * `USE_FLASK_BACKEND = true` and point `FLASK_API_BASE_URL` to your server
 * (e.g. http://localhost:5000/api).
 */

export const DATA_LAYER_CONFIG = {
  useFlaskBackend: false,
  flaskApiBaseUrl: '/api',
  endpoints: {
    listMedicines: 'GET /api/medicines?q=<query>',
    checkInteractions: 'POST /api/interactions/check',
  },
} as const;

export function getAllMedicines(): Medicine[] {
  return [...DEMO_MEDICINES];
}

export function searchMedicines(query: string): Medicine[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return [...DEMO_MEDICINES];
  }

  return DEMO_MEDICINES.filter(
    (med) =>
      med.name.toLowerCase().includes(normalized) ||
      med.fictionalClass.toLowerCase().includes(normalized)
  );
}

export function calculatePairCount(medicineCount: number): number {
  if (medicineCount < 2) return 0;
  return (medicineCount * (medicineCount - 1)) / 2;
}

/**
 * Generates every unique unordered pair from the selected medicine list
 * and evaluates each pair against the interaction dataset.
 */
export async function checkMedicineInteractions(
  selectedMedicineIds: string[],
  options: { includeExperimentalMl?: boolean } = { includeExperimentalMl: true }
): Promise<InteractionCheckSummary> {
  if (DATA_LAYER_CONFIG.useFlaskBackend) {
    const response = await fetch(`${DATA_LAYER_CONFIG.flaskApiBaseUrl}/interactions/check`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        medicineIds: selectedMedicineIds,
        includeExperimentalMl: options.includeExperimentalMl ?? true,
      }),
    });
    if (!response.ok) {
      throw new Error('Failed to check interactions from backend service.');
    }
    return response.json();
  }

  const medicineMap = new Map(DEMO_MEDICINES.map((med) => [med.id, med]));
  const selectedMedicines = selectedMedicineIds
    .map((id) => medicineMap.get(id))
    .filter((med): med is Medicine => Boolean(med));

  const includeMl = options.includeExperimentalMl ?? true;
  const allMatches: MatchedInteraction[] = [];
  const evaluatedPairs: Array<{ medicineA: Medicine; medicineB: Medicine; hasMatch: boolean }> = [];

  for (let i = 0; i < selectedMedicines.length; i++) {
    for (let j = i + 1; j < selectedMedicines.length; j++) {
      const medA = selectedMedicines[i];
      const medB = selectedMedicines[j];

      const matchingRecords = DEMO_INTERACTION_RECORDS.filter((record) => {
        if (!includeMl && record.evidenceType === 'experimental_ml') {
          return false;
        }
        const directMatch = record.medicineAId === medA.id && record.medicineBId === medB.id;
        const reverseMatch = record.medicineAId === medB.id && record.medicineBId === medA.id;
        return directMatch || reverseMatch;
      });

      evaluatedPairs.push({
        medicineA: medA,
        medicineB: medB,
        hasMatch: matchingRecords.length > 0,
      });

      for (const record of matchingRecords) {
        allMatches.push({
          ...record,
          medicineA: medA,
          medicineB: medB,
        });
      }
    }
  }

  const verifiedMatches = allMatches.filter((m) => m.evidenceType === 'verified_dataset');
  const experimentalPredictions = allMatches.filter((m) => m.evidenceType === 'experimental_ml');

  return {
    selectedMedicines,
    totalSelected: selectedMedicines.length,
    totalPairsEvaluated: evaluatedPairs.length,
    verifiedMatches,
    experimentalPredictions,
    allMatches,
    evaluatedPairs,
    checkedAt: new Date().toISOString(),
    dataSourceMode: 'local-demo-dataset',
  };
}
