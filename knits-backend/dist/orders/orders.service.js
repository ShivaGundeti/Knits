"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const run_rate_engine_1 = require("./run-rate.engine");
const ai_translator_service_1 = require("./ai-translator.service");
let OrdersService = class OrdersService {
    orders = [
        {
            id: 'ord-88213',
            poNumber: 'B-PO-88213',
            buyerId: 'buyer-uk-b',
            buyerName: 'Company B (UK)',
            buyerCountry: 'United Kingdom',
            style: "Men's crew neck tee, navy",
            color: 'Navy Blue #191970',
            totalQuantity: 12000,
            sizeBreakdown: [
                { size: 'S', quantity: 2400 },
                { size: 'M', quantity: 3600 },
                { size: 'L', quantity: 3600 },
                { size: 'XL', quantity: 2400 }
            ],
            unitAssigned: 'Unit 1 (Avinashi Road)',
            currentStage: 'Stitching',
            stageQuantityCompleted: 6800,
            exFactoryDate: '2026-11-20',
            createdAt: '2026-10-15',
            milestones: [
                { stage: 'Cutting', targetDate: '2026-10-28', targetQty: 12000, completedQty: 12000, status: 'green' },
                { stage: 'Printing', targetDate: '2026-11-04', targetQty: 12000, completedQty: 12000, status: 'green' },
                { stage: 'Stitching', targetDate: '2026-11-14', targetQty: 12000, completedQty: 6800, status: 'red' },
                { stage: 'Finishing', targetDate: '2026-11-18', targetQty: 12000, completedQty: 0, status: 'amber' },
                { stage: 'Packed', targetDate: '2026-11-20', targetQty: 12000, completedQty: 0, status: 'amber' }
            ],
            logs: [
                {
                    id: 'log-101',
                    orderId: 'ord-88213',
                    poNumber: 'B-PO-88213',
                    date: '2026-11-04',
                    stage: 'Stitching',
                    quantityCompleted: 220,
                    supervisorName: 'Murugan K.',
                    supervisorUnit: 'Unit 1',
                    photoUrl: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=600&auto=format&fit=crop&q=80',
                    rawNoteTamil: 'ஊசி உடைந்துவிட்டது, மிஷின் 2 மணி நேரம் ஓடவில்லை',
                    englishTranslation: 'Sewing needle broken, stitching line idle for 2 hours.',
                    aiSuggestedCategory: 'Machinery Breakdown',
                    confirmedCategory: 'Machinery Breakdown',
                    aiConfidence: 0.94,
                    isConfirmedByMerchandiser: true,
                    visibleToBuyer: true,
                    createdAt: '2026-11-04T18:30:00Z'
                },
                {
                    id: 'log-102',
                    orderId: 'ord-88213',
                    poNumber: 'B-PO-88213',
                    date: '2026-11-05',
                    stage: 'Stitching',
                    quantityCompleted: 210,
                    supervisorName: 'Murugan K.',
                    supervisorUnit: 'Unit 1',
                    photoUrl: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&auto=format&fit=crop&q=80',
                    rawNoteTamil: 'நேவி ப்ளூ நூல் வரவில்லை, சப்ளையர் தாமதம்',
                    englishTranslation: 'Navy blue thread did not arrive, supplier dispatch delayed.',
                    aiSuggestedCategory: 'Fabric / Material Shortage',
                    confirmedCategory: 'Fabric / Material Shortage',
                    aiConfidence: 0.92,
                    isConfirmedByMerchandiser: true,
                    visibleToBuyer: true,
                    createdAt: '2026-11-05T18:45:00Z'
                }
            ],
            dateChangeHistory: [
                {
                    id: 'aud-1',
                    changedAt: '2026-10-25',
                    oldDate: '2026-11-18',
                    newDate: '2026-11-20',
                    changedBy: 'Karthik S. (Senior Merchandiser)',
                    reason: 'Buyer approved 2-day ocean schedule adjustment for container booking at Chennai Port.'
                }
            ]
        },
        {
            id: 'ord-88240',
            poNumber: 'B-PO-88240',
            buyerId: 'buyer-uk-b',
            buyerName: 'Company B (UK)',
            buyerCountry: 'United Kingdom',
            style: "Men's polo, white",
            color: 'Optic White #FFFFFF',
            totalQuantity: 8000,
            sizeBreakdown: [
                { size: 'S', quantity: 1500 },
                { size: 'M', quantity: 2500 },
                { size: 'L', quantity: 2500 },
                { size: 'XL', quantity: 1500 }
            ],
            unitAssigned: 'Unit 2 (Palladam)',
            currentStage: 'Finishing',
            stageQuantityCompleted: 5200,
            exFactoryDate: '2026-11-12',
            createdAt: '2026-10-10',
            milestones: [
                { stage: 'Cutting', targetDate: '2026-10-22', targetQty: 8000, completedQty: 8000, status: 'green' },
                { stage: 'Stitching', targetDate: '2026-11-02', targetQty: 8000, completedQty: 8000, status: 'green' },
                { stage: 'Finishing', targetDate: '2026-11-10', targetQty: 8000, completedQty: 5200, status: 'amber' },
                { stage: 'Packed', targetDate: '2026-11-12', targetQty: 8000, completedQty: 0, status: 'amber' }
            ],
            logs: [],
            dateChangeHistory: []
        },
        {
            id: 'ord-0488',
            poNumber: 'C-PO-0488',
            buyerId: 'buyer-de-c',
            buyerName: 'Company C (Germany)',
            buyerCountry: 'Germany',
            style: 'Kids printed tee, yellow',
            color: 'Sunflower Yellow #FFDA03',
            totalQuantity: 10000,
            sizeBreakdown: [],
            unitAssigned: 'Unit 3 (Tiruppur City)',
            currentStage: 'Printing',
            stageQuantityCompleted: 3100,
            exFactoryDate: '2026-11-28',
            createdAt: '2026-10-25',
            milestones: [
                { stage: 'Cutting', targetDate: '2026-11-02', targetQty: 10000, completedQty: 10000, status: 'green' },
                { stage: 'Printing', targetDate: '2026-11-12', targetQty: 10000, completedQty: 3100, status: 'green' }
            ],
            logs: [],
            dateChangeHistory: []
        }
    ];
    findAll(buyerFilter) {
        const list = buyerFilter ? this.orders.filter(o => o.buyerId === buyerFilter) : this.orders;
        return list.map(order => ({
            ...order,
            runRate: (0, run_rate_engine_1.computeRunRate)(order)
        }));
    }
    findOne(id, requesterBuyerId) {
        const order = this.orders.find(o => o.id === id || o.poNumber === id);
        if (!order)
            throw new common_1.NotFoundException(`Order ${id} not found`);
        if (requesterBuyerId && order.buyerId !== requesterBuyerId) {
            throw new common_1.ForbiddenException(`Access denied: Tenant isolation policy prevents viewing other buyer orders.`);
        }
        return {
            ...order,
            runRate: (0, run_rate_engine_1.computeRunRate)(order)
        };
    }
    create(dto) {
        const defaultMilestones = [
            { stage: 'Cutting', targetDate: '2026-11-18', targetQty: dto.totalQuantity, completedQty: 0, status: 'green' },
            { stage: 'Printing', targetDate: '2026-11-24', targetQty: dto.totalQuantity, completedQty: 0, status: 'green' },
            { stage: 'Stitching', targetDate: '2026-12-02', targetQty: dto.totalQuantity, completedQty: 0, status: 'green' },
            { stage: 'Finishing', targetDate: '2026-12-07', targetQty: dto.totalQuantity, completedQty: 0, status: 'green' },
            { stage: 'Packed', targetDate: dto.exFactoryDate, targetQty: dto.totalQuantity, completedQty: 0, status: 'green' }
        ];
        const newOrder = {
            id: `ord-${Date.now()}`,
            poNumber: dto.poNumber,
            buyerId: dto.buyerId,
            buyerName: dto.buyerName,
            buyerCountry: dto.buyerCountry,
            style: dto.style,
            color: dto.color,
            totalQuantity: dto.totalQuantity,
            sizeBreakdown: dto.sizeBreakdown || [],
            unitAssigned: dto.unitAssigned,
            currentStage: 'Cutting',
            stageQuantityCompleted: 0,
            exFactoryDate: dto.exFactoryDate,
            createdAt: new Date().toISOString().split('T')[0],
            milestones: defaultMilestones,
            logs: [],
            dateChangeHistory: []
        };
        this.orders.unshift(newOrder);
        return newOrder;
    }
    addDailyLog(dto) {
        const order = this.orders.find(o => o.id === dto.orderId || o.poNumber === dto.orderId);
        if (!order)
            throw new common_1.NotFoundException(`Order ${dto.orderId} not found`);
        const aiResult = (0, ai_translator_service_1.parseTamilFloorNote)(dto.rawNoteTamil || '');
        const log = {
            id: `log-${Date.now()}`,
            orderId: order.id,
            poNumber: order.poNumber,
            date: new Date().toISOString().split('T')[0],
            stage: dto.stage,
            quantityCompleted: dto.quantityCompleted,
            supervisorName: dto.supervisorName,
            supervisorUnit: dto.supervisorUnit,
            photoUrl: dto.photoUrl,
            rawNoteTamil: dto.rawNoteTamil,
            englishTranslation: aiResult.englishTranslation,
            aiSuggestedCategory: aiResult.suggestedCategory,
            confirmedCategory: aiResult.suggestedCategory,
            aiConfidence: aiResult.confidence,
            isConfirmedByMerchandiser: false,
            visibleToBuyer: false,
            createdAt: new Date().toISOString()
        };
        if (order.currentStage === dto.stage) {
            order.stageQuantityCompleted += dto.quantityCompleted;
        }
        const milestone = order.milestones.find(m => m.stage === dto.stage);
        if (milestone) {
            milestone.completedQty = Math.min(order.totalQuantity, milestone.completedQty + dto.quantityCompleted);
        }
        order.logs.unshift(log);
        return order;
    }
    updateCategory(orderId, logId, dto) {
        const order = this.orders.find(o => o.id === orderId);
        if (!order)
            throw new common_1.NotFoundException(`Order ${orderId} not found`);
        const log = order.logs.find(l => l.id === logId);
        if (!log)
            throw new common_1.NotFoundException(`Log ${logId} not found`);
        log.confirmedCategory = dto.confirmedCategory;
        if (dto.isConfirmedByMerchandiser !== undefined) {
            log.isConfirmedByMerchandiser = dto.isConfirmedByMerchandiser;
        }
        if (dto.visibleToBuyer !== undefined) {
            log.visibleToBuyer = dto.visibleToBuyer;
        }
        return order;
    }
    updateExFactoryDate(orderId, dto) {
        const order = this.orders.find(o => o.id === orderId);
        if (!order)
            throw new common_1.NotFoundException(`Order ${orderId} not found`);
        const oldDate = order.exFactoryDate;
        order.exFactoryDate = dto.newDate;
        order.dateChangeHistory.unshift({
            id: `aud-${Date.now()}`,
            changedAt: new Date().toISOString().split('T')[0],
            oldDate,
            newDate: dto.newDate,
            changedBy: dto.changedBy,
            reason: dto.reason
        });
        return order;
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)()
], OrdersService);
//# sourceMappingURL=orders.service.js.map