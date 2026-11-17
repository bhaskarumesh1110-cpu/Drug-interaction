export type PageView = 'home' | 'checker' | 'results' | 'about';

export type InteractionSeverity = 'Moderate' | 'Major' | 'Minor';

export type RecordEvidenceType = 'verified_dataset' | 'experimental_ml';

export interface Medicine {
  id: string;
  name: string;
  fictionalClass: string;
  summary: string;
  datasetTag: string;
}

export interface InteractionRecord {
  id: string;
  medicineAId: string;
  medicineBId: string;
  evidenceType: RecordEvidenceType;
  /**
   * Severity is optional and ONLY displayed in the UI when explicitly
   * supported by the underlying dataset record.
   */
  severity?: InteractionSeverity;
  description: string;
  source?: string;
  mlConfidenceNote?: string;
}

export interface MatchedInteraction extends InteractionRecord {
  medicineA: Medicine;
  medicineB: Medicine;
}

export interface InteractionCheckSummary {
  selectedMedicines: Medicine[];
  totalSelected: number;
  totalPairsEvaluated: number;
  verifiedMatches: MatchedInteraction[];
  experimentalPredictions: MatchedInteraction[];
  allMatches: MatchedInteraction[];
  evaluatedPairs: Array<{ medicineA: Medicine; medicineB: Medicine; hasMatch: boolean }>;
  checkedAt: string;
  dataSourceMode: 'local-demo-dataset' | 'flask-api';
}
