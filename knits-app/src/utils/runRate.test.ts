import { describe, it, expect } from 'vitest';
import { calculateWorkingDays, calculateRunRate } from './runRate';
import { Order } from '../types';

describe('Run-Rate Delay Projection Engine', () => {
  it('correctly calculates working days excluding Sundays', () => {
    // 2026-11-06 (Friday) to 2026-11-20 (Friday) is 14 calendar days, with 2 Sundays (Nov 8, Nov 15)
    // Working days should be 12 days
    const workingDays = calculateWorkingDays('2026-11-06', '2026-11-20');
    expect(workingDays).toBe(12);
  });

  it('triggers critical RED status when actual floor pace is significantly behind required pace', () => {
    const mockOrder: Order = {
      id: 'test-order-1',
      poNumber: 'B-PO-88213',
      buyerId: 'buyer-uk-b',
      buyerName: 'Company B (UK)',
      buyerCountry: 'UK',
      style: "Men's crew neck tee",
      color: 'Navy',
      totalQuantity: 12000,
      sizeBreakdown: [],
      unitAssigned: 'Unit 1',
      currentStage: 'Stitching',
      stageQuantityCompleted: 6800, // 5,200 remaining
      exFactoryDate: '2026-11-20',
      createdAt: '2026-10-15',
      milestones: [],
      logs: [
        {
          id: 'l1',
          orderId: 'test-order-1',
          poNumber: 'B-PO-88213',
          date: '2026-11-05',
          stage: 'Stitching',
          quantityCompleted: 200, // actual pace only 200/day
          supervisorName: 'Murugan',
          supervisorUnit: 'Unit 1',
          isConfirmedByMerchandiser: true,
          visibleToBuyer: true,
          createdAt: '2026-11-05'
        }
      ],
      dateChangeHistory: []
    };

    const result = calculateRunRate(mockOrder, '2026-11-06');
    expect(result.remainingQty).toBe(5200);
    // Required pace is 5200 / 12 = 434 pcs/day, but doing only 200 pcs/day
    expect(result.requiredDailyRunRate).toBeGreaterThan(400);
    expect(result.actualDailyRunRate).toBe(200);
    expect(result.severity).toBe('red');
    expect(result.delayDays).toBeGreaterThan(0);
  });

  it('calculates GREEN status when factory floor pace meets or exceeds requirement', () => {
    const mockOrder: Order = {
      id: 'test-order-2',
      poNumber: 'C-PO-0488',
      buyerId: 'buyer-de-c',
      buyerName: 'Company C (Germany)',
      buyerCountry: 'Germany',
      style: 'Kids printed tee',
      color: 'Yellow',
      totalQuantity: 10000,
      sizeBreakdown: [],
      unitAssigned: 'Unit 3',
      currentStage: 'Printing',
      stageQuantityCompleted: 3100,
      exFactoryDate: '2026-11-28',
      createdAt: '2026-10-25',
      milestones: [],
      logs: [
        {
          id: 'l2',
          orderId: 'test-order-2',
          poNumber: 'C-PO-0488',
          date: '2026-11-05',
          stage: 'Printing',
          quantityCompleted: 600, // actual pace 600 pcs/day
          supervisorName: 'Muthuvel',
          supervisorUnit: 'Unit 3',
          isConfirmedByMerchandiser: true,
          visibleToBuyer: true,
          createdAt: '2026-11-05'
        }
      ],
      dateChangeHistory: []
    };

    const result = calculateRunRate(mockOrder, '2026-11-06');
    expect(result.severity).toBe('green');
    expect(result.delayDays).toBe(0);
  });
});

