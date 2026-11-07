import { Order, DelaySeverity } from './order.model';
export declare function calculateWorkingDays(startDateStr: string, endDateStr: string): number;
export declare function computeRunRate(order: Order, asOfDate?: string): {
    totalQuantity: number;
    stageDoneQty: number;
    remainingQty: number;
    calendarDaysLeft: number;
    workingDaysLeft: number;
    requiredDailyRunRate: number;
    actualDailyRunRate: number;
    runRateDeficit: number;
    projectedWorkingDaysNeeded: number;
    projectedCompletionDate: string;
    delayDays: number;
    severity: DelaySeverity;
    headlineExplanation: string;
    detailedFormula: {
        piecesLeft: number;
        daysLeft: number;
        reqDailyFormula: string;
        actualDailyFormula: string;
        speedComparison: string;
    };
};
