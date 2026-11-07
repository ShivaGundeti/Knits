import { OrdersService } from './orders.service';
import { CreateOrderDto, DailyLogDto, UpdateCategoryDto, DateChangeDto } from './order.dto';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    getAllOrders(buyerId?: string): {
        status: string;
        data: any[];
    };
    getOrderById(id: string, tenantBuyerId?: string): {
        status: string;
        data: any;
    };
    createOrder(dto: CreateOrderDto): {
        status: string;
        message: string;
        data: import("./order.model").Order;
    };
    submitDailyLog(dto: DailyLogDto): {
        status: string;
        message: string;
        data: import("./order.model").Order;
    };
    updateLogCategory(orderId: string, logId: string, dto: UpdateCategoryDto): {
        status: string;
        message: string;
        data: import("./order.model").Order;
    };
    updateExFactoryDate(orderId: string, dto: DateChangeDto): {
        status: string;
        message: string;
        data: import("./order.model").Order;
    };
}
