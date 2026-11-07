import { 
  Controller, 
  Get, 
  Post, 
  Patch, 
  Param, 
  Query, 
  Body, 
  Headers 
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto, DailyLogDto, UpdateCategoryDto, DateChangeDto } from './order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  getAllOrders(@Query('buyerId') buyerId?: string) {
    return {
      status: 'success',
      data: this.ordersService.findAll(buyerId)
    };
  }

  @Get(':id')
  getOrderById(
    @Param('id') id: string,
    @Headers('x-buyer-tenant-id') tenantBuyerId?: string
  ) {
    return {
      status: 'success',
      data: this.ordersService.findOne(id, tenantBuyerId)
    };
  }

  @Post()
  createOrder(@Body() dto: CreateOrderDto) {
    const created = this.ordersService.create(dto);
    return {
      status: 'success',
      message: 'Order created with automated TNA milestones',
      data: created
    };
  }

  @Post('log')
  submitDailyLog(@Body() dto: DailyLogDto) {
    const updated = this.ordersService.addDailyLog(dto);
    return {
      status: 'success',
      message: 'Daily production log processed and AI categorized',
      data: updated
    };
  }

  @Patch(':orderId/logs/:logId/category')
  updateLogCategory(
    @Param('orderId') orderId: string,
    @Param('logId') logId: string,
    @Body() dto: UpdateCategoryDto
  ) {
    const updated = this.ordersService.updateCategory(orderId, logId, dto);
    return {
      status: 'success',
      message: 'Log category verified by merchandiser',
      data: updated
    };
  }

  @Patch(':orderId/ex-factory-date')
  updateExFactoryDate(
    @Param('orderId') orderId: string,
    @Body() dto: DateChangeDto
  ) {
    const updated = this.ordersService.updateExFactoryDate(orderId, dto);
    return {
      status: 'success',
      message: 'Ex-factory date updated and compliance audit entry appended',
      data: updated
    };
  }
}

