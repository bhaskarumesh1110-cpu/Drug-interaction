import type { InteractionRecord, Medicine } from '../types/interaction';

/**
 * Fictional Demo Dataset (Educational Prototype Only)
 * -------------------------------------------------
 * All medicine names and interaction entries below are strictly fictional
 * placeholder records created for testing the UI, pair-checking logic,
 * and interaction network visualization. They do not represent real
 * pharmaceuticals or real clinical advice.
 */

export const DEMO_MEDICINES: Medicine[] = [
  {
    id: 'demo-drug-a',
    name: 'DemoDrug A',
    fictionalClass: 'Fictional Analgesic Prototype',
    summary: 'Placeholder compound used to demonstrate major and moderate pair alerts.',
    datasetTag: 'Fictional Demo Entry',
  },
  {
    id: 'demo-drug-b',
    name: 'DemoDrug B',
    fictionalClass: 'Fictional Anticoagulant Prototype',
    summary: 'Placeholder compound linked to DemoDrug A (severity tier) and DemoDrug C (ungraded tier).',
    datasetTag: 'Fictional Demo Entry',
  },
  {
    id: 'demo-drug-c',
    name: 'DemoDrug C',
    fictionalClass: 'Fictional Antihypertensive Prototype',
    summary: 'Placeholder compound with an ungraded dataset link to DemoDrug B and an experimental ML edge to DemoDrug D.',
    datasetTag: 'Fictional Demo Entry',
  },
  {
    id: 'demo-drug-d',
    name: 'DemoDrug D',
    fictionalClass: 'Fictional Enzyme Modulator Prototype',
    summary: 'Placeholder compound demonstrating metabolic clearance alerts and ML graph link predictions.',
    datasetTag: 'Fictional Demo Entry',
  },
  {
    id: 'demo-drug-e',
    name: 'DemoDrug E',
    fictionalClass: 'Fictional Gastric Protector Prototype',
    summary: 'Placeholder compound with zero interaction records in this demo dataset (useful for testing empty results).',
    datasetTag: 'Fictional Demo Entry',
  },
];

export const DEMO_INTERACTION_RECORDS: InteractionRecord[] = [
  {
    id: 'demo-int-001',
    medicineAId: 'demo-drug-a',
    medicineBId: 'demo-drug-b',
    evidenceType: 'verified_dataset',
    severity: 'Major',
    description:
      'Fictional demo interaction: Simulated additive sensitivity between DemoDrug A and DemoDrug B resulting in an elevated risk warning in this educational test dataset.',
    source: 'Fictional Clinical Teaching Dataset (Demo Record #001)',
  },
  {
    id: 'demo-int-002',
    medicineAId: 'demo-drug-a',
    medicineBId: 'demo-drug-d',
    evidenceType: 'verified_dataset',
    severity: 'Moderate',
    description:
      'Fictional demo interaction: Simulated pathway overlap where DemoDrug D alters the clearance rate of DemoDrug A in a fictional laboratory model.',
    source: 'Fictional Pharmacology Workbook (Demo Record #002)',
  },
  {
    id: 'demo-int-003',
    medicineAId: 'demo-drug-b',
    medicineBId: 'demo-drug-c',
    evidenceType: 'verified_dataset',
    // Intentionally omits `severity` to demonstrate that severity is shown ONLY when supported by the source dataset.
    description:
      'Fictional demo interaction: Documented theoretical overlap between DemoDrug B and DemoDrug C in the fictional archive. No severity rating is assigned in the source record.',
    source: 'Fictional Student Case Archive (Demo Record #003)',
  },
  {
    id: 'demo-int-ml-004',
    medicineAId: 'demo-drug-c',
    medicineBId: 'demo-drug-d',
    evidenceType: 'experimental_ml',
    // Experimental ML predictions do not claim verified clinical severity
    description:
      'Fictional experimental ML link prediction: Graph topology similarity suggests a candidate relationship between DemoDrug C and DemoDrug D for future educational validation.',
    source: 'Experimental Graph Link Predictor (Simulated ML Demo)',
    mlConfidenceNote: 'Simulated link prediction — not a verified dataset record',
  },
];
