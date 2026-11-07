import { Order, DailyProductionLog } from '@/types';
import { INITIAL_ORDERS } from '@/data/sampleOrders';
import { calculateRunRate } from '@/utils/runRate';

const STORAGE_KEY = 'knits_production_orders_v1';
const OFFLINE_QUEUE_KEY = 'knits_offline_queue_v1';
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

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

    // Asynchronously notify NestJS backend if running
    fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newOrder)
    }).catch(() => {
      // Graceful offline fallback
    });

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

    if (order.currentStage === log.stage) {
      order.stageQuantityCompleted += log.quantityCompleted;
    }

    const milestone = order.milestones.find(m => m.stage === log.stage);
    if (milestone) {
      milestone.completedQty = Math.min(order.totalQuantity, milestone.completedQty + log.quantityCompleted);
    }

    order.logs.unshift(newLog);

    const rr = calculateRunRate(order);
    if (milestone) {
      milestone.status = rr.severity;
    }

    orders[orderIndex] = order;
    this.saveOrders(orders);

    // Sync to NestJS backend
    fetch(`${API_BASE}/orders/log`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId: order.id,
        stage: log.stage,
        quantityCompleted: log.quantityCompleted,
        supervisorName: log.supervisorName,
        supervisorUnit: log.supervisorUnit,
        photoUrl: log.photoUrl,
        rawNoteTamil: log.rawNoteTamil
      })
    }).catch(() => {});

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

      fetch(`${API_BASE}/orders/${orderId}/logs/${logId}/category`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          confirmedCategory: category,
          isConfirmedByMerchandiser: isConfirmed,
          visibleToBuyer
        })
      }).catch(() => {});
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

    fetch(`${API_BASE}/orders/${orderId}/ex-factory-date`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        newDate,
        changedBy,
        reason
      })
    }).catch(() => {});

    return order;
  }

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
