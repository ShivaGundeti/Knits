export type ProductionStage = 'Knitting' | 'Dyeing' | 'Cutting' | 'Printing' | 'Stitching' | 'Washing' | 'Finishing' | 'Inspection' | 'Packed';
export type DelaySeverity = 'green' | 'amber' | 'red';
export type DelayCategory = 'Machinery Breakdown' | 'Fabric / Material Shortage' | 'Worker Absenteeism' | 'Quality / Shade Defect' | 'Power Outage' | 'Subcontractor Delay' | 'Production Normal' | 'Other';
export interface TNAMilestone {
    stage: ProductionStage;
    targetDate: string;
    targetQty: number;
    completedQty: number;
    status: DelaySeverity;
}
export interface DailyProductionLog {
    id: string;
    orderId: string;
    poNumber: string;
    date: string;
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
    unitAssigned: string;
    currentStage: ProductionStage;
    stageQuantityCompleted: number;
    exFactoryDate: string;
    createdAt: string;
    milestones: TNAMilestone[];
    logs: DailyProductionLog[];
    dateChangeHistory: DateChangeAudit[];
}
