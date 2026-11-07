import { Order, DelaySeverity } from './order.model';

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
    if (current.getDay() !== 0) { // Exclude Sundays
      workingDays++;
    }
  }
  
  return Math.max(1, workingDays);
}

export function computeRunRate(order: Order, asOfDate: string = '2026-11-06') {
  const remainingQty = Math.max(0, order.totalQuantity - order.stageQuantityCompleted);
  const workingDaysLeft = calculateWorkingDays(asOfDate, order.exFactoryDate);
  const calStart = new Date(asOfDate);
  const calEnd = new Date(order.exFactoryDate);
  const calendarDaysLeft = Math.max(0, Math.ceil((calEnd.getTime() - calStart.getTime()) / (1000 * 60 * 60 * 24)));

  const requiredDailyRunRate = workingDaysLeft > 0 
    ? Math.ceil(remainingQty / workingDaysLeft) 
    : remainingQty;

  let actualDailyRunRate = 0;
  if (order.logs && order.logs.length > 0) {
    const recentLogs = [...order.logs]
      .filter(l => l.quantityCompleted > 0)
      .slice(-4);
      
    if (recentLogs.length > 0) {
      const sum = recentLogs.reduce((acc, curr) => acc + curr.quantityCompleted, 0);
      actualDailyRunRate = Math.round(sum / recentLogs.length);
    }
  }

  if (actualDailyRunRate === 0) {
    actualDailyRunRate = Math.round(requiredDailyRunRate * 0.75);
  }

  const projectedWorkingDaysNeeded = actualDailyRunRate > 0 
    ? Math.ceil(remainingQty / actualDailyRunRate) 
    : 999;

  const projectedDate = new Date(asOfDate);
  let daysAdded = 0;
  let workCount = 0;
  while (workCount < projectedWorkingDaysNeeded && daysAdded < 300) {
    projectedDate.setDate(projectedDate.getDate() + 1);
    daysAdded++;
    if (projectedDate.getDay() !== 0) {
      workCount++;
    }
  }
  const projectedCompletionDate = projectedDate.toISOString().split('T')[0];

  const targetDateObj = new Date(order.exFactoryDate);
  const delayDays = Math.ceil((projectedDate.getTime() - targetDateObj.getTime()) / (1000 * 60 * 60 * 24));
  const runRateDeficit = actualDailyRunRate - requiredDailyRunRate;

  let severity: DelaySeverity = 'green';
  let headlineExplanation = '';

  if (remainingQty === 0) {
    severity = 'green';
    headlineExplanation = 'Completed on schedule.';
  } else if (actualDailyRunRate >= requiredDailyRunRate && delayDays <= 0) {
    severity = 'green';
    headlineExplanation = `On track. Floor pace (${actualDailyRunRate} pcs/day) meets requirement (${requiredDailyRunRate} pcs/day).`;
  } else if (actualDailyRunRate >= requiredDailyRunRate * 0.8 && delayDays <= 3) {
    severity = 'amber';
    headlineExplanation = `Tight schedule. Operating at ${actualDailyRunRate} pcs/day vs ${requiredDailyRunRate} pcs/day needed. Est. delay: +${Math.max(1, delayDays)} days.`;
  } else {
    severity = 'red';
    headlineExplanation = `CRITICAL DELAY: Deficit of ${Math.abs(runRateDeficit)} pcs/day. At current pace (${actualDailyRunRate}/day), order finishes ${delayDays > 0 ? `+${delayDays} days late on ${projectedCompletionDate}` : 'late'}. Action required 2 weeks early.`;
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

