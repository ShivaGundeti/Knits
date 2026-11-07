export type ProductionStage = 
  | 'Knitting' 
  | 'Dyeing' 
  | 'Cutting' 
  | 'Printing' 
  | 'Stitching' 
  | 'Washing' 
  | 'Finishing' 
  | 'Inspection' 
  | 'Packed';

export type DelaySeverity = 'green' | 'amber' | 'red';

export type UserRole = 'merchandiser' | 'supervisor' | 'buyer';

export type DelayCategory = 
  | 'Machinery Breakdown'
  | 'Fabric / Material Shortage'
  | 'Worker Absenteeism'
  | 'Quality / Shade Defect'
  | 'Power Outage'
  | 'Subcontractor Delay'
  | 'Production Normal'
  | 'Other';

export interface TNAMilestone {
  stage: ProductionStage;
  targetDate: string; // YYYY-MM-DD
  targetQty: number;
  completedQty: number;
  status: DelaySeverity;
}

export interface DailyProductionLog {
  id: string;
  orderId: string;
  poNumber: string;
  date: string; // YYYY-MM-DD
  stage: ProductionStage;
  quantityCompleted: number;
  supervisorName: string;
  supervisorUnit: string;
  photoUrl?: string;
  rawNoteTamil?: string;
  englishTranslation?: string;
  aiSuggestedCategory?: DelayCategory;
  confirmedCategory?: DelayCategory;
  aiConfidence?: number;
  isConfirmedByMerchandiser: boolean;
  visibleToBuyer: boolean;
  createdAt: string;
}

export interface SizeBreakdown {
  size: 'S' | 'M' | 'L' | 'XL' | 'XXL';
  quantity: number;
}

export interface DateChangeAudit {
  id: string;
  changedAt: string;
  oldDate: string;
  newDate: string;
  changedBy: string;
  reason: string;
}

export interface Order {
  id: string;
  poNumber: string;
  buyerId: string;
  buyerName: string;
  buyerCountry: string;
  style: string;
  color: string;
  totalQuantity: number;
  sizeBreakdown: SizeBreakdown[];
  unitAssigned: string; // e.g. "Unit 1", "Unit 2", "Unit 3"
  currentStage: ProductionStage;
  stageQuantityCompleted: number;
  exFactoryDate: string; // YYYY-MM-DD
  createdAt: string;
  milestones: TNAMilestone[];
  logs: DailyProductionLog[];
  dateChangeHistory: DateChangeAudit[];
}

export interface RunRateCalculation {
  totalQuantity: number;
  stageDoneQty: number;
  remainingQty: number;
  calendarDaysLeft: number;
  workingDaysLeft: number;
  requiredDailyRunRate: number; // pieces needed per working day
  actualDailyRunRate: number;   // pieces actually produced per day (rolling avg)
  runRateDeficit: number;       // actual - required (negative if behind)
  projectedWorkingDaysNeeded: number;
  projectedCompletionDate: string;
  delayDays: number;            // positive if late
  severity: DelaySeverity;
  headlineExplanation: string;
  detailedFormula: {
    piecesLeft: number;
    daysLeft: number;
    reqDailyFormula: string;
    actualDailyFormula: string;
    speedComparison: string;
  };
}

export interface OfflineQueuedUpdate {
  tempId: string;
  orderId: string;
  poNumber: string;
  stage: ProductionStage;
  quantity: number;
  supervisorName: string;
  supervisorUnit: string;
  rawNoteTamil: string;
  photoDataUrl?: string;
  timestamp: number;
}

