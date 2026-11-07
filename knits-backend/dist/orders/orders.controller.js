"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersController = void 0;
const common_1 = require("@nestjs/common");
const orders_service_1 = require("./orders.service");
const order_dto_1 = require("./order.dto");
let OrdersController = class OrdersController {
    ordersService;
    constructor(ordersService) {
        this.ordersService = ordersService;
    }
    getAllOrders(buyerId) {
        return {
            status: 'success',
            data: this.ordersService.findAll(buyerId)
        };
    }
    getOrderById(id, tenantBuyerId) {
        return {
            status: 'success',
            data: this.ordersService.findOne(id, tenantBuyerId)
        };
    }
    createOrder(dto) {
        const created = this.ordersService.create(dto);
        return {
            status: 'success',
            message: 'Order created with automated TNA milestones',
            data: created
        };
    }
    submitDailyLog(dto) {
        const updated = this.ordersService.addDailyLog(dto);
        return {
            status: 'success',
            message: 'Daily production log processed and AI categorized',
            data: updated
        };
    }
    updateLogCategory(orderId, logId, dto) {
        const updated = this.ordersService.updateCategory(orderId, logId, dto);
        return {
            status: 'success',
            message: 'Log category verified by merchandiser',
            data: updated
        };
    }
    updateExFactoryDate(orderId, dto) {
        const updated = this.ordersService.updateExFactoryDate(orderId, dto);
        return {
            status: 'success',
            message: 'Ex-factory date updated and compliance audit entry appended',
            data: updated
        };
    }
};
exports.OrdersController = OrdersController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('buyerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "getAllOrders", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Headers)('x-buyer-tenant-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "getOrderById", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [order_dto_1.CreateOrderDto]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "createOrder", null);
__decorate([
    (0, common_1.Post)('log'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [order_dto_1.DailyLogDto]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "submitDailyLog", null);
__decorate([
    (0, common_1.Patch)(':orderId/logs/:logId/category'),
    __param(0, (0, common_1.Param)('orderId')),
    __param(1, (0, common_1.Param)('logId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, order_dto_1.UpdateCategoryDto]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "updateLogCategory", null);
__decorate([
    (0, common_1.Patch)(':orderId/ex-factory-date'),
    __param(0, (0, common_1.Param)('orderId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, order_dto_1.DateChangeDto]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "updateExFactoryDate", null);
exports.OrdersController = OrdersController = __decorate([
    (0, common_1.Controller)('orders'),
    __metadata("design:paramtypes", [orders_service_1.OrdersService])
], OrdersController);
//# sourceMappingURL=orders.controller.js.map