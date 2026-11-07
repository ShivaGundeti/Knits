export declare class CreateOrderDto {
    poNumber: string;
    buyerId: string;
    buyerName: string;
    buyerCountry: string;
    style: string;
    color: string;
    totalQuantity: number;
    unitAssigned: string;
    exFactoryDate: string;
    sizeBreakdown?: any[];
}
export declare class DailyLogDto {
    orderId: string;
    stage: string;
    quantityCompleted: number;
    supervisorName: string;
    supervisorUnit: string;
    photoUrl?: string;
    rawNoteTamil?: string;
}
export declare class UpdateCategoryDto {
    confirmedCategory: string;
    isConfirmedByMerchandiser?: boolean;
    visibleToBuyer?: boolean;
}
export declare class DateChangeDto {
    newDate: string;
    changedBy: string;
    reason: string;
}
