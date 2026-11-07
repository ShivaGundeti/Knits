import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import type { ProductionStage, DelayCategory } from './order.model';

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  poNumber: string;

  @IsString()
  @IsNotEmpty()
  buyerId: string;

  @IsString()
  @IsNotEmpty()
  buyerName: string;

  @IsString()
  @IsNotEmpty()
  buyerCountry: string;

  @IsString()
  @IsNotEmpty()
  style: string;

  @IsString()
  @IsNotEmpty()
  color: string;

  @IsNumber()
  totalQuantity: number;

  @IsString()
  unitAssigned: string;

  @IsString()
  exFactoryDate: string;

  @IsOptional()
  sizeBreakdown?: any[];
}

export class DailyLogDto {
  @IsString()
  @IsNotEmpty()
  orderId: string;

  @IsString()
  @IsNotEmpty()
  stage: string;

  @IsNumber()
  quantityCompleted: number;

  @IsString()
  supervisorName: string;

  @IsString()
  supervisorUnit: string;

  @IsOptional()
  photoUrl?: string;

  @IsOptional()
  rawNoteTamil?: string;
}

export class UpdateCategoryDto {
  @IsString()
  confirmedCategory: string;

  @IsOptional()
  isConfirmedByMerchandiser?: boolean;

  @IsOptional()
  visibleToBuyer?: boolean;
}

export class DateChangeDto {
  @IsString()
  newDate: string;

  @IsString()
  changedBy: string;

  @IsString()
  reason: string;
}
