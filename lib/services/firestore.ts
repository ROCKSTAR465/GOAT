import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  Timestamp,
  serverTimestamp,
  DocumentData,
  QueryConstraint,
  writeBatch,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import {
  User,
  Task,
  Shoot,
  Lead,
  Invoice,
  Client,
  Notification,
  Script,
  EditingTask,
  Revenue,
  Expense,
  FAQItem,
} from '@/lib/types/models';

// Generic CRUD operations
export class FirestoreService {
  // Create document
  static async create<T extends DocumentData>(
    collectionName: string,
    data: Omit<T, 'id' | 'created_at' | 'updated_at'>
  ): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error(`Error creating document in ${collectionName}:`, error);
      throw error;
    }
  }

  // Read single document
  static async getById<T>(collectionName: string, id: string): Promise<T | null> {
    try {
      const docRef = doc(db, collectionName, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as T;
      }
      return null;
    } catch (error) {
      console.error(`Error getting document from ${collectionName}:`, error);
      throw error;
    }
  }

  // Read multiple documents with filters
  static async getMany<T>(
    collectionName: string,
    constraints: QueryConstraint[] = []
  ): Promise<T[]> {
    try {
      const q = query(collection(db, collectionName), ...constraints);
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as T[];
    } catch (error) {
      console.error(`Error getting documents from ${collectionName}:`, error);
      throw error;
    }
  }

  // Update document
  static async update<T extends DocumentData>(
    collectionName: string,
    id: string,
    data: Partial<T>
  ): Promise<void> {
    try {
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, {
        ...data,
        updated_at: serverTimestamp(),
      });
    } catch (error) {
      console.error(`Error updating document in ${collectionName}:`, error);
      throw error;
    }
  }

  // Delete document
  static async delete(collectionName: string, id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, collectionName, id));
    } catch (error) {
      console.error(`Error deleting document from ${collectionName}:`, error);
      throw error;
    }
  }
}

// Task-specific operations
export class TaskService {
  static async createTask(task: Omit<Task, 'id' | 'created_at' | 'updated_at'>): Promise<string> {
    return FirestoreService.create('tasks', task);
  }

  static async getTasksByUser(userId: string): Promise<Task[]> {
    return FirestoreService.getMany<Task>('tasks', [
      where('assigned_to', 'array-contains', userId),
      orderBy('deadline', 'asc'),
    ]);
  }

  static async getTasksByStatus(status: string): Promise<Task[]> {
    return FirestoreService.getMany<Task>('tasks', [
      where('status', '==', status),
      orderBy('created_at', 'desc'),
    ]);
  }

  static async updateTaskStatus(taskId: string, status: string): Promise<void> {
    return FirestoreService.update('tasks', taskId, { status });
  }

  static async getUpcomingTasks(days: number = 7): Promise<Task[]> {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);
    
    return FirestoreService.getMany<Task>('tasks', [
      where('deadline', '<=', Timestamp.fromDate(futureDate)),
      where('status', 'in', ['pending', 'in_progress']),
      orderBy('deadline', 'asc'),
    ]);
  }
}

// Shoot-specific operations
export class ShootService {
  static async createShoot(shoot: Omit<Shoot, 'id' | 'created_at' | 'updated_at'>): Promise<string> {
    return FirestoreService.create('shoots', shoot);
  }

  static async getUpcomingShoots(): Promise<Shoot[]> {
    return FirestoreService.getMany<Shoot>('shoots', [
      where('date', '>=', Timestamp.now()),
      orderBy('date', 'asc'),
    ]);
  }

  static async getShootsByClient(clientId: string): Promise<Shoot[]> {
    return FirestoreService.getMany<Shoot>('shoots', [
      where('clientId', '==', clientId),
      orderBy('date', 'desc'),
    ]);
  }

  static async assignEmployeeToShoot(shootId: string, userId: string, role: string): Promise<void> {
    const assignmentData = {
      shootId,
      userId,
      role,
      assigned_at: serverTimestamp(),
    };
    await addDoc(collection(db, 'shoots', shootId, 'assignments'), assignmentData);
  }
}

// Lead-specific operations
export class LeadService {
  static async createLead(lead: Omit<Lead, 'id' | 'created_at' | 'updated_at'>): Promise<string> {
    return FirestoreService.create('leads', lead);
  }

  static async getNewLeads(): Promise<Lead[]> {
    return FirestoreService.getMany<Lead>('leads', [
      where('status', '==', 'new'),
      orderBy('created_at', 'desc'),
    ]);
  }

  static async updateLeadStatus(leadId: string, status: string, reason?: string): Promise<void> {
    const updateData: any = { status };
    if (reason) updateData.reason = reason;
    return FirestoreService.update('leads', leadId, updateData);
  }

  static async getLeadConversionRate(): Promise<number> {
    const allLeads = await FirestoreService.getMany<Lead>('leads');
    const wonLeads = allLeads.filter(lead => lead.status === 'won');
    return allLeads.length > 0 ? (wonLeads.length / allLeads.length) * 100 : 0;
  }
}

// Invoice-specific operations
export class InvoiceService {
  static async createInvoice(invoice: Omit<Invoice, 'id' | 'created_at' | 'updated_at'>): Promise<string> {
    return FirestoreService.create('invoices', invoice);
  }

  static async getUnpaidInvoices(): Promise<Invoice[]> {
    return FirestoreService.getMany<Invoice>('invoices', [
      where('status', 'in', ['sent', 'overdue']),
      orderBy('due_date', 'asc'),
    ]);
  }

  static async getInvoicesByClient(clientId: string): Promise<Invoice[]> {
    return FirestoreService.getMany<Invoice>('invoices', [
      where('clientId', '==', clientId),
      orderBy('issued_at', 'desc'),
    ]);
  }

  static async markInvoiceAsPaid(invoiceId: string, paymentMethod: string): Promise<void> {
    return FirestoreService.update('invoices', invoiceId, {
      status: 'paid',
      paid_at: serverTimestamp(),
      payment_method: paymentMethod,
    });
  }

  static async getRevenueByMonth(month: string): Promise<number> {
    const startDate = new Date(`${month}-01`);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    const invoices = await FirestoreService.getMany<Invoice>('invoices', [
      where('status', '==', 'paid'),
      where('paid_at', '>=', Timestamp.fromDate(startDate)),
      where('paid_at', '<', Timestamp.fromDate(endDate)),
    ]);

    return invoices.reduce((sum, invoice) => sum + invoice.total, 0);
  }
}

// Notification-specific operations
export class NotificationService {
  static async createNotification(
    userId: string,
    notification: Omit<Notification, 'id' | 'userId' | 'created_at' | 'read'>
  ): Promise<string> {
    return FirestoreService.create('notifications', {
      ...notification,
      userId,
      read: false,
    });
  }

  static async getUserNotifications(userId: string, unreadOnly: boolean = false): Promise<Notification[]> {
    const constraints: QueryConstraint[] = [
      where('userId', '==', userId),
      orderBy('created_at', 'desc'),
      limit(50),
    ];

    if (unreadOnly) {
      constraints.unshift(where('read', '==', false));
    }

    return FirestoreService.getMany<Notification>('notifications', constraints);
  }

  static async markAsRead(notificationId: string): Promise<void> {
    return FirestoreService.update('notifications', notificationId, { read: true });
  }

  static async markAllAsRead(userId: string): Promise<void> {
    const batch = writeBatch(db);
    const notifications = await this.getUserNotifications(userId, true);
    
    notifications.forEach(notification => {
      const docRef = doc(db, 'notifications', notification.id);
      batch.update(docRef, { read: true });
    });

    await batch.commit();
  }
}

// Analytics and Insights
export class AnalyticsService {
  static async getWeeklyTaskCompletion(): Promise<{ completed: number; total: number }> {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const tasks = await FirestoreService.getMany<Task>('tasks', [
      where('created_at', '>=', Timestamp.fromDate(weekAgo)),
    ]);

    const completed = tasks.filter(task => task.status === 'completed').length;
    return { completed, total: tasks.length };
  }

  static async getTeamWorkload(): Promise<Map<string, number>> {
    const tasks = await FirestoreService.getMany<Task>('tasks', [
      where('status', 'in', ['pending', 'in_progress']),
    ]);

    const workload = new Map<string, number>();
    tasks.forEach(task => {
      task.assigned_to.forEach(userId => {
        workload.set(userId, (workload.get(userId) || 0) + 1);
      });
    });

    return workload;
  }

  static async getRevenueGrowth(months: number = 6): Promise<Array<{ month: string; revenue: number }>> {
    const results = [];
    const currentDate = new Date();

    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(currentDate);
      date.setMonth(date.getMonth() - i);
      const month = date.toISOString().slice(0, 7);
      
      const revenue = await InvoiceService.getRevenueByMonth(month);
      results.push({ month, revenue });
    }

    return results;
  }

  static async getProductivityScore(userId: string): Promise<number> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const tasks = await FirestoreService.getMany<Task>('tasks', [
      where('assigned_to', 'array-contains', userId),
      where('created_at', '>=', Timestamp.fromDate(thirtyDaysAgo)),
    ]);

    if (tasks.length === 0) return 0;

    const completed = tasks.filter(task => task.status === 'completed').length;
    const onTime = tasks.filter(task => 
      task.status === 'completed' && 
      task.updated_at <= task.deadline
    ).length;

    const completionRate = (completed / tasks.length) * 50;
    const timelinessRate = (onTime / tasks.length) * 50;

    return Math.round(completionRate + timelinessRate);
  }
}
