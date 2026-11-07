import { Order } from './order.model';
import { CreateOrderDto, DailyLogDto, UpdateCategoryDto, DateChangeDto } from './order.dto';
export declare class OrdersService {
    private orders;
    findAll(buyerFilter?: string): any[];
    findOne(id: string, requesterBuyerId?: string): any;
    create(dto: CreateOrderDto): Order;
    addDailyLog(dto: DailyLogDto): Order;
    updateCategory(orderId: string, logId: string, dto: UpdateCategoryDto): Order;
    updateExFactoryDate(orderId: string, dto: DateChangeDto): Order;
}
