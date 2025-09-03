# Firebase Backend Manual - GOAT Media SaaS Platform

## Table of Contents
1. [Firebase Setup](#firebase-setup)
2. [Authentication Flow](#authentication-flow)
3. [Firestore Database Guide](#firestore-database-guide)
4. [Feature Walkthroughs](#feature-walkthroughs)
5. [Insights & Analytics Queries](#insights--analytics-queries)
6. [Seeding Database](#seeding-database)
7. [API Endpoints](#api-endpoints)
8. [Troubleshooting](#troubleshooting)

---

## Firebase Setup

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project" and follow the setup wizard
3. Name your project (e.g., "goat-media-saas")
4. Enable Google Analytics (optional)

### 2. Enable Required Services

#### Authentication
1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Enable **Email/Password** provider
3. Add authorized domains if deploying to production

#### Firestore Database
1. Go to **Firestore Database** → **Create database**
2. Start in **production mode** (we'll add security rules later)
3. Choose your preferred region (e.g., us-central1)

#### Storage
1. Go to **Storage** → **Get started**
2. Start in production mode
3. Choose the same region as Firestore

### 3. Get Configuration Keys

#### Client SDK Configuration
1. Go to **Project Settings** → **General**
2. Scroll to "Your apps" → Click "Web" icon
3. Register your app with a nickname
4. Copy the configuration object:

```javascript
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};
```

#### Admin SDK Configuration
1. Go to **Project Settings** → **Service accounts**
2. Click "Generate new private key"
3. Save the JSON file securely
4. Extract the required values for environment variables

### 4. Environment Variables Setup

Create a `.env.local` file in your project root:

```env
# Firebase Client SDK
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

# Firebase Admin SDK
FIREBASE_ADMIN_PROJECT_ID=your-project-id
FIREBASE_ADMIN_CLIENT_EMAIL=your-service-account-email
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
JWT_SECRET_KEY=generate-a-secure-32-char-minimum-secret-key
```

### 5. Firestore Security Rules

Add these rules in **Firestore Database** → **Rules**:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read their own profile
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && 
        (request.auth.uid == userId || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'executive');
    }
    
    // Tasks - employees can read/write their tasks, executives can manage all
    match /tasks/{taskId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null && 
        (resource.data.assigned_to.hasAny([request.auth.uid]) ||
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'executive');
      allow delete: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'executive';
    }
    
    // Leads - only executives can manage
    match /leads/{leadId} {
      allow read, write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'executive';
    }
    
    // Other collections - authenticated users can read, role-based write
    match /{collection}/{document=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

---

## Authentication Flow

### How It Works

1. **User Login/Signup**
   - User enters credentials on `/login` page
   - Firebase Authentication validates credentials
   - On success, Firebase returns an ID token
   - Client sends ID token to `/api/auth/login` endpoint

2. **JWT Token Creation**
   - Server verifies Firebase ID token using Admin SDK
   - Fetches user role from Firestore `users` collection
   - Creates JWT with user ID and role
   - Sets HTTP-only cookie with JWT

3. **Middleware Protection**
   - `middleware.ts` intercepts all requests
   - Verifies JWT from cookie
   - Enforces role-based access control (RBAC)
   - Redirects unauthorized users

4. **Role-Based Routing**
   - Employees: `/dashboard/employee/**`
   - Executives: `/dashboard/executive/**`
   - Automatic redirection based on role after login

### Login History Tracking
- Each successful login is logged in `users/{userId}/login_history`
- Tracks: device info, IP address, timestamp, status
- Useful for security auditing and user analytics

---

## Firestore Database Guide

### Collections Structure

#### 1. **users**
```typescript
{
  id: string (Firebase Auth UID)
  name: string
  email: string
  designation: string
  role: 'employee' | 'executive'
  avatar_url?: string
  created_at: Timestamp
  updated_at: Timestamp
}
```
**Subcollection:** `login_history`

#### 2. **clients**
```typescript
{
  id: string
  name: string
  email: string
  phone?: string
  company?: string
  address?: string
  notes?: string
  created_at: Timestamp
  updated_at: Timestamp
}
```

#### 3. **tasks**
```typescript
{
  id: string
  title: string
  description: string
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  deadline: Timestamp
  assigned_to: string[] // User IDs
  created_by: string
  project?: string
  tags?: string[]
  attachments?: string[]
  created_at: Timestamp
  updated_at: Timestamp
}
```

#### 4. **shoots**
```typescript
{
  id: string
  clientId: string
  title: string
  date: Timestamp
  location: string
  details: string
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'postponed'
  equipment?: string[]
  notes?: string
  created_by: string
  created_at: Timestamp
  updated_at: Timestamp
}
```
**Subcollection:** `assignments` (employee assignments to shoots)

#### 5. **leads**
```typescript
{
  id: string
  client_name: string
  company?: string
  contact_email: string
  contact_phone?: string
  status: 'new' | 'contacted' | 'qualified' | 'proposal_sent' | 'negotiation' | 'won' | 'lost'
  source?: string
  demands?: string
  budget?: number
  reason?: string // For rejection
  handled_by?: string // User ID
  notes?: string
  created_at: Timestamp
  updated_at: Timestamp
}
```

#### 6. **invoices**
```typescript
{
  id: string
  invoice_number: string
  clientId: string
  amount: number
  tax?: number
  total: number
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
  items: InvoiceItem[]
  issued_at: Timestamp
  due_date: Timestamp
  paid_at?: Timestamp
  payment_method?: string
  notes?: string
  created_at: Timestamp
  updated_at: Timestamp
}
```

#### 7. **notifications**
```typescript
{
  id: string
  userId: string
  type: 'task' | 'shoot' | 'lead' | 'invoice' | 'system' | 'approval' | 'urgent'
  title: string
  message: string
  read: boolean
  actionUrl?: string
  metadata?: object
  created_at: Timestamp
}
```

#### 8. **scripts**
```typescript
{
  id: string
  title: string
  content: string
  tone: 'professional' | 'casual' | 'humorous' | 'inspirational' | 'educational'
  target_audience?: string
  duration?: number // in seconds
  created_by: string
  tags?: string[]
  created_at: Timestamp
  updated_at: Timestamp
}
```
**Subcollection:** `versions` (different variations of scripts)

#### 9. **editing_tasks**
```typescript
{
  id: string
  shootId: string
  title: string
  description: string
  assigned_to?: string
  status: 'queued' | 'in_progress' | 'review' | 'approved' | 'revision_needed' | 'completed'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  deadline: Timestamp
  raw_footage_url?: string
  edited_video_url?: string
  notes?: string
  revision_count: number
  created_by: string
  created_at: Timestamp
  updated_at: Timestamp
}
```
**Subcollection:** `comments` (feedback on edits)

### Example Queries

```typescript
// Get all tasks assigned to a user
const tasks = await db.collection('tasks')
  .where('assigned_to', 'array-contains', userId)
  .orderBy('deadline', 'asc')
  .get();

// Get upcoming shoots
const shoots = await db.collection('shoots')
  .where('date', '>=', Timestamp.now())
  .orderBy('date', 'asc')
  .get();

// Get new leads for executives
const leads = await db.collection('leads')
  .where('status', '==', 'new')
  .orderBy('created_at', 'desc')
  .get();

// Get unpaid invoices
const invoices = await db.collection('invoices')
  .where('status', 'in', ['sent', 'overdue'])
  .orderBy('due_date', 'asc')
  .get();
```

---

## Feature Walkthroughs

### Employee Dashboard Features

#### 1. **Tasks Management**
- **View Tasks**: Displays all tasks assigned to the logged-in employee
- **Create Task**: Add new tasks with title, description, deadline, priority
- **Update Status**: Change task status (pending → in_progress → completed)
- **Filter & Sort**: Filter by status, priority, or deadline

#### 2. **Content Studio (AI-Powered)**
- **Script Generation**: Enter prompt, select tone and target audience
- **Multiple Variations**: Generates 3 variations with different approaches
- **Version History**: All generated scripts saved with versions
- **Export Options**: Download scripts in various formats

#### 3. **Shoot Planner**
- **Calendar View**: Visual calendar showing all scheduled shoots
- **Shoot Details**: View client, location, equipment, assigned team
- **Assignment Management**: See your assigned shoots and roles
- **Status Updates**: Update shoot status as work progresses

#### 4. **Editing Workflow**
- **Queue Management**: View all editing tasks in priority order
- **File Upload**: Upload raw footage to Firebase Storage
- **Progress Tracking**: Update editing status through stages
- **Comments**: Add timestamped feedback on edits

#### 5. **Notifications Center**
- **Real-time Updates**: Receive instant notifications for new tasks/shoots
- **Filter Options**: Filter by type, read/unread status
- **Mark as Read**: Individual or bulk marking
- **Action Links**: Direct navigation to related items

#### 6. **Help Centre**
- **FAQ Section**: Common questions and answers
- **Search Functionality**: Quick search through help articles
- **Category Organization**: Grouped by feature areas

### Executive Dashboard Features

#### 1. **Leads Management**
- **Lead Pipeline**: Visual pipeline showing lead stages
- **Accept/Reject**: Quick actions with reason tracking
- **Conversion Analytics**: Track win/loss rates
- **Lead Assignment**: Assign leads to team members

#### 2. **Team Performance**
- **Productivity Scores**: Individual employee performance metrics
- **Task Completion Rates**: Track on-time delivery
- **Workload Distribution**: Visual representation of team capacity
- **Performance Trends**: Historical performance data

#### 3. **Revenue Dashboard**
- **Revenue Charts**: Monthly/quarterly revenue trends
- **Client Breakdown**: Revenue by client analysis
- **Invoice Management**: Track paid/unpaid invoices
- **Profit Margins**: Revenue vs expenses analysis

#### 4. **Shoot Oversight**
- **Approval Queue**: Approve or reschedule shoot requests
- **Resource Allocation**: Manage equipment and team assignments
- **Client Communication**: Track shoot-related client interactions

#### 5. **Editing Oversight**
- **Quality Control**: Review and approve final edits
- **Revision Tracking**: Monitor revision requests and completions
- **Delivery Timeline**: Ensure on-time delivery to clients

---

## Insights & Analytics Queries

### 1. **Weekly Task Completion**
```typescript
// Get tasks completed in last 7 days
const weekAgo = new Date();
weekAgo.setDate(weekAgo.getDate() - 7);

const tasks = await db.collection('tasks')
  .where('status', '==', 'completed')
  .where('updated_at', '>=', Timestamp.fromDate(weekAgo))
  .get();

const completionRate = (tasks.size / totalTasks) * 100;
```

### 2. **Upcoming Workload**
```typescript
// Tasks due in next 7 days
const futureDate = new Date();
futureDate.setDate(futureDate.getDate() + 7);

const upcomingTasks = await db.collection('tasks')
  .where('deadline', '<=', Timestamp.fromDate(futureDate))
  .where('status', 'in', ['pending', 'in_progress'])
  .orderBy('deadline', 'asc')
  .get();
```

### 3. **Revenue by Client**
```typescript
// Aggregate paid invoices by client
const invoices = await db.collection('invoices')
  .where('status', '==', 'paid')
  .get();

const revenueByClient = {};
invoices.forEach(doc => {
  const data = doc.data();
  revenueByClient[data.clientId] = 
    (revenueByClient[data.clientId] || 0) + data.total;
});
```

### 4. **Revenue Growth**
```typescript
// Monthly revenue comparison
const getMonthlyRevenue = async (month) => {
  const startDate = new Date(`${month}-01`);
  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + 1);

  const invoices = await db.collection('invoices')
    .where('status', '==', 'paid')
    .where('paid_at', '>=', Timestamp.fromDate(startDate))
    .where('paid_at', '<', Timestamp.fromDate(endDate))
    .get();

  return invoices.docs.reduce((sum, doc) => 
    sum + doc.data().total, 0);
};
```

### 5. **Profit vs Expense**
```typescript
// Calculate profit margins
const revenue = await getMonthlyRevenue(currentMonth);
const expenses = await db.collection('expenses')
  .where('month', '==', currentMonth)
  .get();

const totalExpenses = expenses.docs.reduce((sum, doc) => 
  sum + doc.data().amount, 0);

const profit = revenue - totalExpenses;
const profitMargin = (profit / revenue) * 100;
```

### 6. **Team Workload Distribution**
```typescript
// Open tasks per employee
const tasks = await db.collection('tasks')
  .where('status', 'in', ['pending', 'in_progress'])
  .get();

const workload = new Map();
tasks.forEach(doc => {
  const task = doc.data();
  task.assigned_to.forEach(userId => {
    workload.set(userId, (workload.get(userId) || 0) + 1);
  });
});
```

### 7. **Productivity Score Calculation**
```typescript
// Individual productivity (last 30 days)
const thirtyDaysAgo = new Date();
thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

const userTasks = await db.collection('tasks')
  .where('assigned_to', 'array-contains', userId)
  .where('created_at', '>=', Timestamp.fromDate(thirtyDaysAgo))
  .get();

const completed = userTasks.docs.filter(doc => 
  doc.data().status === 'completed').length;

const onTime = userTasks.docs.filter(doc => {
  const data = doc.data();
  return data.status === 'completed' && 
         data.updated_at <= data.deadline;
}).length;

const productivityScore = 
  (completed / userTasks.size * 50) + 
  (onTime / userTasks.size * 50);
```

### 8. **Lead Conversion Rate**
```typescript
// Calculate lead conversion
const allLeads = await db.collection('leads').get();
const wonLeads = allLeads.docs.filter(doc => 
  doc.data().status === 'won');

const conversionRate = 
  (wonLeads.length / allLeads.size) * 100;
```

---

## Seeding Database

### Prerequisites
1. Firebase project configured
2. Environment variables set in `.env.local`
3. Dependencies installed (`npm install`)

### Running the Seed Script

```bash
npm run seed
```

This will:
1. Clear existing data (optional)
2. Create demo users with Firebase Auth
3. Populate all collections with realistic data
4. Set up relationships between documents
5. Generate 6 months of historical data

### Demo Accounts Created

| Role | Email | Password | Access |
|------|-------|----------|--------|
| Employee | alex.employee@goat.media | password123 | Employee Dashboard |
| Executive | mia.exec@goat.media | password123 | Executive Dashboard |
| Employee | john.employee@goat.media | password123 | Employee Dashboard |
| Employee | sarah.employee@goat.media | password123 | Employee Dashboard |
| Executive | mike.exec@goat.media | password123 | Executive Dashboard |

### Seed Data Overview
- **50 Tasks**: Various statuses and priorities
- **30 Shoots**: Past, present, and future dates
- **25 Leads**: Different pipeline stages
- **40 Invoices**: Mix of paid/unpaid
- **5 Clients**: With associated data
- **Notifications**: 5-15 per user
- **Financial Data**: 6 months of revenue/expenses
- **FAQ Items**: Common help topics

---

## API Endpoints

### Authentication

#### POST `/api/auth/login`
```typescript
// Request
{
  idToken: string // Firebase ID token
}

// Response
{
  success: true,
  user: {
    id: string,
    email: string,
    name: string,
    role: string,
    designation: string
  },
  redirectUrl: string
}
```

#### POST `/api/auth/logout`
```typescript
// Response
{
  success: true,
  message: "Logged out successfully"
}
```

### Tasks

#### GET `/api/tasks`
Query params:
- `status`: Filter by task status
- `assignedTo`: Filter by assigned user

#### POST `/api/tasks`
```typescript
// Request
{
  title: string,
  description: string,
  deadline: string,
  priority: 'low' | 'medium' | 'high' | 'urgent',
  assigned_to: string[]
}
```

#### PATCH `/api/tasks/[id]`
Update task fields

#### DELETE `/api/tasks/[id]`
Delete task (executives only)

### Shoots

#### GET `/api/shoots`
Query params:
- `clientId`: Filter by client
- `upcoming`: Get only upcoming shoots

#### POST `/api/shoots`
```typescript
// Request
{
  clientId: string,
  title: string,
  date: string,
  location: string,
  details: string,
  equipment: string[]
}
```

### Leads

#### GET `/api/leads`
Query params:
- `status`: Filter by lead status

#### POST `/api/leads`
```typescript
// Request
{
  client_name: string,
  contact_email: string,
  contact_phone?: string,
  company?: string,
  demands?: string,
  budget?: number
}
```

### Content Studio

#### POST `/api/content-studio/generate`
```typescript
// Request
{
  prompt: string,
  tone: 'professional' | 'casual' | 'humorous' | 'inspirational' | 'educational',
  target_audience?: string,
  duration?: number
}

// Response
{
  success: true,
  data: {
    scriptId: string,
    variations: Array<{
      version: number,
      content: string,
      tone: string
    }>
  }
}
```

### Analytics

#### GET `/api/analytics/insights`
Query params:
- `type`: Specific insight type
  - `weekly-tasks`
  - `team-workload`
  - `revenue-growth`
  - `productivity-score`
  - `lead-conversion`
  - `monthly-revenue`
- `userId`: For user-specific metrics
- `months`: Number of months for trends

---

## Troubleshooting

### Common Issues and Solutions

#### 1. Authentication Errors

**Problem**: "Authentication required" error
**Solution**: 
- Check if Firebase ID token is being sent correctly
- Verify JWT_SECRET_KEY is set in environment variables
- Ensure cookies are enabled in browser

**Problem**: "Invalid authentication token"
**Solution**:
- Token may be expired, try logging in again
- Check if JWT_SECRET_KEY matches between deploys

#### 2. Firestore Errors

**Problem**: "Permission denied" when accessing Firestore
**Solution**:
- Check Firestore security rules
- Verify user role in database matches required permissions
- Ensure Firebase project ID is correct

**Problem**: "Document not found"
**Solution**:
- Run seed script to populate initial data
- Check if document ID is correct
- Verify collection name spelling

#### 3. Storage Issues

**Problem**: Cannot upload files
**Solution**:
- Check Firebase Storage rules
- Verify storage bucket URL in environment variables
- Ensure file size is within limits (default 5MB)

**Problem**: "CORS error" when accessing storage
**Solution**:
- Configure CORS in Firebase Storage:
```json
[
  {
    "origin": ["http://localhost:3000", "https://yourdomain.com"],
    "method": ["GET", "POST", "PUT", "DELETE"],
    "maxAgeSeconds": 3600
  }
]
```

#### 4. Middleware Issues

**Problem**: Infinite redirect loop
**Solution**:
- Check middleware matcher configuration
- Verify public paths are excluded
- Clear browser cookies and try again

**Problem**: Role-based routing not working
**Solution**:
- Check user role in Firestore database
- Verify middleware is reading headers correctly
- Ensure JWT contains role information

#### 5. Development Tips

**Local Development**:
```bash
# Start development server
npm run dev

# Run seed script
npm run seed

# Check for TypeScript errors
npm run build
```

**Environment Variables**:
- Never commit `.env.local` to version control
- Use different Firebase projects for dev/staging/production
- Rotate JWT_SECRET_KEY periodically in production

**Performance Optimization**:
- Enable Firestore offline persistence for better UX
- Implement pagination for large data sets
- Use Firestore compound indexes for complex queries
- Cache frequently accessed data with React Query

**Security Best Practices**:
- Always validate input on both client and server
- Use Firestore security rules as additional layer
- Implement rate limiting on API routes
- Regular security audits of Firebase rules
- Enable Firebase App Check for production

---

## Support & Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Firestore Best Practices](https://firebase.google.com/docs/firestore/best-practices)
- [Firebase Security Rules Guide](https://firebase.google.com/docs/rules)

For issues specific to this implementation, check:
1. Environment variables are correctly set
2. Firebase project configuration matches code
3. All required Firebase services are enabled
4. Security rules are properly configured

---

*Last Updated: December 2024*
*Version: 1.0.0*
*Powered by SNR Automations*
