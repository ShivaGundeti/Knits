import { Order, DailyProductionLog } from '@/types';
import { INITIAL_ORDERS } from '@/data/sampleOrders';
import { calculateRunRate } from '@/utils/runRate';

const STORAGE_KEY = 'knits_production_orders_v1';
const OFFLINE_QUEUE_KEY = 'knits_offline_queue_v1';

export class OrderStore {
  static getOrders(): Order[] {
    if (typeof window === 'undefined') return INITIAL_ORDERS;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_ORDERS));
        return INITIAL_ORDERS;
      }
      return JSON.parse(stored);
    } catch {
      return INITIAL_ORDERS;
    }
  }

  static saveOrders(orders: Order[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
    } catch (e) {
      console.error('Failed to persist orders', e);
    }
  }

  static getOrderById(id: string): Order | undefined {
    return this.getOrders().find(o => o.id === id || o.poNumber === id);
  }

  static createOrder(newOrder: Omit<Order, 'id' | 'createdAt' | 'logs' | 'dateChangeHistory'>): Order {
    const orders = this.getOrders();
    const createdOrder: Order = {
      ...newOrder,
      id: `ord-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      logs: [],
      dateChangeHistory: []
    };
    orders.unshift(createdOrder);
    this.saveOrders(orders);
    return createdOrder;
  }

  static addDailyLog(orderId: string, log: Omit<DailyProductionLog, 'id' | 'createdAt'>): Order | null {
    const orders = this.getOrders();
    const orderIndex = orders.findIndex(o => o.id === orderId || o.poNumber === orderId);
    if (orderIndex === -1) return null;

    const order = orders[orderIndex];
    const newLog: DailyProductionLog = {
      ...log,
      id: `log-${Date.now()}`,
      createdAt: new Date().toISOString()
    };

    // Update cumulative completed count for the current stage
    if (order.currentStage === log.stage) {
      order.stageQuantityCompleted += log.quantityCompleted;
    }

    // Update milestone
    const milestone = order.milestones.find(m => m.stage === log.stage);
    if (milestone) {
      milestone.completedQty = Math.min(order.totalQuantity, milestone.completedQty + log.quantityCompleted);
    }

    order.logs.unshift(newLog);

    // Recompute severity status
    const rr = calculateRunRate(order);
    if (milestone) {
      milestone.status = rr.severity;
    }

    orders[orderIndex] = order;
    this.saveOrders(orders);
    return order;
  }

  static updateLogCategory(orderId: string, logId: string, category: any, isConfirmed: boolean, visibleToBuyer: boolean): void {
    const orders = this.getOrders();
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    const log = order.logs.find(l => l.id === logId);
    if (log) {
      log.confirmedCategory = category;
      log.isConfirmedByMerchandiser = isConfirmed;
      log.visibleToBuyer = visibleToBuyer;
      this.saveOrders(orders);
    }
  }

  static updateExFactoryDate(orderId: string, newDate: string, changedBy: string, reason: string): Order | null {
    const orders = this.getOrders();
    const order = orders.find(o => o.id === orderId);
    if (!order) return null;

    const oldDate = order.exFactoryDate;
    order.exFactoryDate = newDate;
    order.dateChangeHistory.unshift({
      id: `aud-${Date.now()}`,
      changedAt: new Date().toISOString().split('T')[0],
      oldDate,
      newDate,
      changedBy,
      reason
    });

    this.saveOrders(orders);
    return order;
  }

  // Offline queue methods for Supervisor devices
  static getOfflineQueue(): any[] {
    if (typeof window === 'undefined') return [];
    try {
      const q = localStorage.getItem(OFFLINE_QUEUE_KEY);
      return q ? JSON.parse(q) : [];
    } catch {
      return [];
    }
  }

  static enqueueOfflineLog(item: any): void {
    if (typeof window === 'undefined') return;
    const queue = this.getOfflineQueue();
    queue.push(item);
    localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
  }

  static clearOfflineQueue(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(OFFLINE_QUEUE_KEY);
  }
}

