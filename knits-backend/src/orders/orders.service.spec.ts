import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { computeRunRate, calculateWorkingDays } from './run-rate.engine';
import { parseTamilFloorNote } from './ai-translator.service';
import { Order } from './order.model';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

describe('OrdersService & Business Logic Engine', () => {
  let service: OrdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrdersService],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
  });

  describe('Run-Rate Mathematical Projection', () => {
    it('accurately excludes non-working factory Sundays', () => {
      // 14 calendar days from Friday Nov 6 to Friday Nov 20 includes 2 Sundays (Nov 8, 15)
      const workDays = calculateWorkingDays('2026-11-06', '2026-11-20');
      expect(workDays).toBe(12);
    });

    it('triggers critical RED status when floor speed falls below 80% of required pace', () => {
      const sampleOrder: Order = {
        id: 'ord-88213',
        poNumber: 'B-PO-88213',
        buyerId: 'buyer-uk-b',
        buyerName: 'Company B (UK)',
        buyerCountry: 'United Kingdom',
        style: "Men's crew neck tee, navy",
        color: 'Navy Blue #191970',
        totalQuantity: 12000,
        sizeBreakdown: [],
        unitAssigned: 'Unit 1',
        currentStage: 'Stitching',
        stageQuantityCompleted: 6800,
        exFactoryDate: '2026-11-20',
        createdAt: '2026-10-15',
        milestones: [],
        logs: [
          {
            id: 'l1',
            orderId: 'ord-88213',
            poNumber: 'B-PO-88213',
            date: '2026-11-05',
            stage: 'Stitching',
            quantityCompleted: 200,
            supervisorName: 'Murugan',
            supervisorUnit: 'Unit 1',
            isConfirmedByMerchandiser: true,
            visibleToBuyer: true,
            createdAt: '2026-11-05',
          },
        ],
        dateChangeHistory: [],
      };

      const result = computeRunRate(sampleOrder, '2026-11-06');
      expect(result.remainingQty).toBe(5200);
      expect(result.requiredDailyRunRate).toBe(434);
      expect(result.actualDailyRunRate).toBe(200);
      expect(result.severity).toBe('red');
      expect(result.delayDays).toBeGreaterThan(0);
    });
  });

  describe('AI Tamil NLP Parsing & Intent Categorization', () => {
    it('classifies needle breakdowns as Machinery Breakdown with high confidence', () => {
      const res = parseTamilFloorNote('ஊசி உடைந்துவிட்டது, மிஷின் ஓடவில்லை');
      expect(res.suggestedCategory).toBe('Machinery Breakdown');
      expect(res.confidence).toBeGreaterThan(0.75);
    });

    it('classifies yarn shortages as Fabric / Material Shortage', () => {
      const res = parseTamilFloorNote('நேவி ப்ளூ நூல் வரவில்லை');
      expect(res.suggestedCategory).toBe('Fabric / Material Shortage');
      expect(res.confidence).toBeGreaterThan(0.75);
    });

    it('degrades gracefully to Other for unusual unstructured input', () => {
      const res = parseTamilFloorNote('எதிர்பாராத புதிய குழப்பம் ஏற்பட்டது');
      expect(res.suggestedCategory).toBe('Other');
      expect(res.confidence).toBeLessThan(0.7);
    });
  });

  describe('Multi-Tenant Buyer Isolation Security', () => {
    it('permits Company B to access its own orders', () => {
      const order = service.findOne('ord-88213', 'buyer-uk-b');
      expect(order.poNumber).toBe('B-PO-88213');
    });

    it('throws ForbiddenException when Company C attempts to access Company B orders', () => {
      expect(() => {
        service.findOne('ord-88213', 'buyer-de-c');
      }).toThrow(ForbiddenException);
    });
  });
});
