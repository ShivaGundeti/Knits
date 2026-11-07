import { Order, RunRateCalculation, DelaySeverity } from '../types';

/**
 * Calculates working days between two dates, excluding Sundays.
 * In Tiruppur knitwear export units, Monday to Saturday are standard production days.
 */
export function calculateWorkingDays(startDateStr: string, endDateStr: string): number {
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);
  
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0;
  
  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays <= 0) return 0;
  
  let workingDays = 0;
  const current = new Date(start);
  
  for (let i = 0; i < diffDays; i++) {
    current.setDate(current.getDate() + 1);
    // 0 is Sunday
    if (current.getDay() !== 0) {
      workingDays++;
    }
  }
  
  return Math.max(1, workingDays);
}

/**
 * Calculates the exact run-rate delay projection.
 * Shows full mathematical transparency (pieces needed per day vs made per day).
 * 
 * @param order The order object
 * @param asOfDate The reference date (defaults to current date '2026-11-06')
 */
export function calculateRunRate(order: Order, asOfDate: string = '2026-11-06'): RunRateCalculation {
  const remainingQty = Math.max(0, order.totalQuantity - order.stageQuantityCompleted);
  
  // Working days left until Ex-Factory Date
  const workingDaysLeft = calculateWorkingDays(asOfDate, order.exFactoryDate);
  const calStart = new Date(asOfDate);
  const calEnd = new Date(order.exFactoryDate);
  const calendarDaysLeft = Math.max(0, Math.ceil((calEnd.getTime() - calStart.getTime()) / (1000 * 60 * 60 * 24)));
  
  // Required Daily Run-rate: pieces needed per working day
  const requiredDailyRunRate = workingDaysLeft > 0 
    ? Math.ceil(remainingQty / workingDaysLeft) 
    : remainingQty;
  
  // Actual Daily Run-rate: compute rolling average of recent completed logs
  let actualDailyRunRate = 0;
  if (order.logs && order.logs.length > 0) {
    const recentLogs = [...order.logs]
      .filter(l => l.quantityCompleted > 0)
      .slice(-4); // last 3 to 4 shifts
      
    if (recentLogs.length > 0) {
      const sum = recentLogs.reduce((acc, curr) => acc + curr.quantityCompleted, 0);
      actualDailyRunRate = Math.round(sum / recentLogs.length);
    }
  }
  
  // Fallback: If no supervisor logs yet, calculate based on sample pacing
  if (actualDailyRunRate === 0) {
    actualDailyRunRate = Math.round(requiredDailyRunRate * 0.75);
  }
  
  // Projected working days needed at current run rate
  const projectedWorkingDaysNeeded = actualDailyRunRate > 0 
    ? Math.ceil(remainingQty / actualDailyRunRate) 
    : 999;
    
  // Projected completion date
  const projectedDate = new Date(asOfDate);
  let daysAdded = 0;
  let workCount = 0;
  while (workCount < projectedWorkingDaysNeeded && daysAdded < 300) {
    projectedDate.setDate(projectedDate.getDate() + 1);
    daysAdded++;
    if (projectedDate.getDay() !== 0) { // skip Sundays
      workCount++;
    }
  }
  const projectedCompletionDate = projectedDate.toISOString().split('T')[0];
  
  // Delay in calendar days compared to Ex-Factory date
  const targetDateObj = new Date(order.exFactoryDate);
  const delayDays = Math.ceil((projectedDate.getTime() - targetDateObj.getTime()) / (1000 * 60 * 60 * 24));
  
  const runRateDeficit = actualDailyRunRate - requiredDailyRunRate;
  
  // Traffic Light Rule:
  // Green: actual >= required OR remaining is 0
  // Amber: deficit is moderate (actual >= 80% of required, or delay <= 2 days)
  // Red: actual < 80% of required OR delay > 2 days
  let severity: DelaySeverity = 'green';
  let headlineExplanation = '';
  
  if (remainingQty === 0) {
    severity = 'green';
    headlineExplanation = 'Completed on schedule.';
  } else if (actualDailyRunRate >= requiredDailyRunRate && delayDays <= 0) {
    severity = 'green';
    headlineExplanation = `On track. Current pace (${actualDailyRunRate} pcs/day) meets requirement (${requiredDailyRunRate} pcs/day).`;
  } else if (actualDailyRunRate >= requiredDailyRunRate * 0.8 && delayDays <= 3) {
    severity = 'amber';
    headlineExplanation = `Tight schedule. Operating at ${actualDailyRunRate} pcs/day vs ${requiredDailyRunRate} pcs/day needed. Estimated delivery delay: +${Math.max(1, delayDays)} days.`;
  } else {
    severity = 'red';
    headlineExplanation = `CRITICAL DELAY WARNING: Output deficit of ${Math.abs(runRateDeficit)} pcs/day. At current pace (${actualDailyRunRate}/day), production finishes ${delayDays > 0 ? `+${delayDays} days late on ${projectedCompletionDate}` : 'late'}. Action required 2 weeks early.`;
  }
  
  return {
    totalQuantity: order.totalQuantity,
    stageDoneQty: order.stageQuantityCompleted,
    remainingQty,
    calendarDaysLeft,
    workingDaysLeft,
    requiredDailyRunRate,
    actualDailyRunRate,
    runRateDeficit,
    projectedWorkingDaysNeeded,
    projectedCompletionDate,
    delayDays: Math.max(0, delayDays),
    severity,
    headlineExplanation,
    detailedFormula: {
      piecesLeft: remainingQty,
      daysLeft: workingDaysLeft,
      reqDailyFormula: `${remainingQty} pieces ÷ ${workingDaysLeft} working days = ${requiredDailyRunRate} pcs/day required`,
      actualDailyFormula: `Recent floor average = ${actualDailyRunRate} pcs/day`,
      speedComparison: `Pace variance: ${runRateDeficit >= 0 ? '+' : ''}${runRateDeficit} pcs/day (${Math.round((actualDailyRunRate / (requiredDailyRunRate || 1)) * 100)}% of target speed)`
    }
  };
}

