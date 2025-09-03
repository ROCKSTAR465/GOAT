import { Timestamp } from 'firebase/firestore';

// User types
export type UserRole = 'employee' | 'executive';

export interface User {
  id: string;
  name: string;
  email: string;
  designation: string;
  role: UserRole;
  avatar_url?: string;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface LoginHistory {
  id: string;
  userId: string;
  device: string;
  ip: string;
  timestamp: Timestamp;
  status: 'success' | 'failed';
}

// Client types
export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  address?: string;
  notes?: string;
  created_at: Timestamp;
  updated_at: Timestamp;
}

// Task types
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  deadline: Timestamp;
  assigned_to: string[]; // Array of user IDs
  created_by: string;
  project?: string;
  tags?: string[];
  attachments?: string[];
  created_at: Timestamp;
  updated_at: Timestamp;
}

// Shoot types
export type ShootStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'postponed';

export interface Shoot {
  id: string;
  clientId: string;
  title: string;
  date: Timestamp;
  location: string;
  details: string;
  status: ShootStatus;
  equipment?: string[];
  notes?: string;
  created_by: string;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface ShootAssignment {
  id: string;
  shootId: string;
  userId: string;
  role: string; // e.g., 'photographer', 'videographer', 'assistant'
  assigned_at: Timestamp;
}

// Lead types
export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'proposal_sent' | 'negotiation' | 'won' | 'lost';

export interface Lead {
  id: string;
  client_name: string;
  company?: string;
  contact_email: string;
  contact_phone?: string;
  status: LeadStatus;
  source?: string;
  demands?: string;
  budget?: number;
  reason?: string; // For rejection
  handled_by?: string; // User ID
  notes?: string;
  created_at: Timestamp;
  updated_at: Timestamp;
}

// Invoice types
export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';

export interface Invoice {
  id: string;
  invoice_number: string;
  clientId: string;
  amount: number;
  tax?: number;
  total: number;
  status: InvoiceStatus;
  items: InvoiceItem[];
  issued_at: Timestamp;
  due_date: Timestamp;
  paid_at?: Timestamp;
  payment_method?: string;
  notes?: string;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

// Notification types
export type NotificationType = 'task' | 'shoot' | 'lead' | 'invoice' | 'system' | 'approval' | 'urgent';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  actionUrl?: string;
  metadata?: Record<string, any>;
  created_at: Timestamp;
}

// Script types
export type ScriptTone = 'professional' | 'casual' | 'humorous' | 'inspirational' | 'educational';

export interface Script {
  id: string;
  title: string;
  content: string;
  tone: ScriptTone;
  target_audience?: string;
  duration?: number; // in seconds
  created_by: string;
  tags?: string[];
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface ScriptVersion {
  id: string;
  scriptId: string;
  version_number: number;
  content: string;
  changes_summary?: string;
  created_by: string;
  created_at: Timestamp;
}

// Editing types
export type EditingStatus = 'queued' | 'in_progress' | 'review' | 'approved' | 'revision_needed' | 'completed';

export interface EditingTask {
  id: string;
  shootId: string;
  title: string;
  description: string;
  assigned_to?: string;
  status: EditingStatus;
  priority: TaskPriority;
  deadline: Timestamp;
  raw_footage_url?: string;
  edited_video_url?: string;
  notes?: string;
  revision_count: number;
  created_by: string;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface EditingComment {
  id: string;
  editingTaskId: string;
  userId: string;
  comment: string;
  timestamp_in_video?: number; // in seconds
  attachments?: string[];
  created_at: Timestamp;
}

// Financial types
export interface Revenue {
  id: string;
  month: string; // Format: 'YYYY-MM'
  amount: number;
  sources: RevenueSource[];
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface RevenueSource {
  clientId: string;
  amount: number;
  invoiceIds: string[];
}

export interface Expense {
  id: string;
  month: string; // Format: 'YYYY-MM'
  category: string;
  description: string;
  amount: number;
  vendor?: string;
  receipt_url?: string;
  approved_by?: string;
  created_at: Timestamp;
  updated_at: Timestamp;
}

// Help Centre types
export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  created_at: Timestamp;
  updated_at: Timestamp;
}

// Team Performance types
export interface PerformanceMetrics {
  userId: string;
  period: string; // Format: 'YYYY-MM'
  tasks_completed: number;
  tasks_assigned: number;
  shoots_completed: number;
  average_task_completion_time: number; // in hours
  productivity_score: number; // 0-100
  created_at: Timestamp;
}
