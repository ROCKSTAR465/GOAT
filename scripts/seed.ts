import * as admin from 'firebase-admin';
import { faker } from '@faker-js/faker';

// Initialize Firebase Admin using Vercel environment variables
if (!admin.apps.length) {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!projectId || !clientEmail || !privateKey) {
    console.error('❌ Missing Firebase Admin credentials in Vercel environment variables');
    console.error('Required Vercel environment variables:');
    console.error('- NEXT_PUBLIC_FIREBASE_PROJECT_ID');
    console.error('- FIREBASE_ADMIN_CLIENT_EMAIL');
    console.error('- FIREBASE_ADMIN_PRIVATE_KEY');
    process.exit(1);
  }

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  });
  
  console.log('✅ Firebase Admin initialized with Vercel environment variables');
}

const auth = admin.auth();
const db = admin.firestore();

// Helper function to create dates
const randomDate = (start: Date, end: Date) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

async function clearCollections() {
  console.log('🗑️  Clearing existing data...');
  const collections = ['users', 'tasks', 'shoots', 'leads', 'invoices', 'clients', 
                       'notifications', 'scripts', 'editing_tasks', 'revenue', 'expenses', 'faq'];
  
  for (const collectionName of collections) {
    const collection = db.collection(collectionName);
    const snapshot = await collection.get();
    const batch = db.batch();
    snapshot.docs.forEach(doc => batch.delete(doc.ref));
    await batch.commit();
    console.log(`   Cleared ${collectionName}`);
  }
}

async function createUsers() {
  console.log('👤 Creating users...');
  
  const users = [
    {
      email: 'alex.employee@goat.media',
      password: 'password123',
      name: 'Alex Thompson',
      role: 'employee',
      designation: 'Content Creator',
    },
    {
      email: 'mia.exec@goat.media',
      password: 'password123',
      name: 'Mia Rodriguez',
      role: 'executive',
      designation: 'Creative Director',
    },
    {
      email: 'john.employee@goat.media',
      password: 'password123',
      name: 'John Smith',
      role: 'employee',
      designation: 'Video Editor',
    },
    {
      email: 'sarah.employee@goat.media',
      password: 'password123',
      name: 'Sarah Johnson',
      role: 'employee',
      designation: 'Photographer',
    },
    {
      email: 'mike.exec@goat.media',
      password: 'password123',
      name: 'Mike Chen',
      role: 'executive',
      designation: 'Operations Manager',
    },
  ];

  const createdUsers: any[] = [];

  for (const userData of users) {
    try {
      // Create Firebase Auth user
      const userRecord = await auth.createUser({
        email: userData.email,
        password: userData.password,
        displayName: userData.name,
      });

      // Create Firestore user document
      await db.collection('users').doc(userRecord.uid).set({
        name: userData.name,
        email: userData.email,
        role: userData.role,
        designation: userData.designation,
        avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.name}`,
        created_at: admin.firestore.FieldValue.serverTimestamp(),
        updated_at: admin.firestore.FieldValue.serverTimestamp(),
      });

      createdUsers.push({ ...userData, id: userRecord.uid });
      console.log(`   Created user: ${userData.name} (${userData.email})`);
    } catch (error: any) {
      if (error.code === 'auth/email-already-exists') {
        // Get existing user
        const existingUser = await auth.getUserByEmail(userData.email);
        createdUsers.push({ ...userData, id: existingUser.uid });
        console.log(`   User already exists: ${userData.name}`);
      } else {
        console.error(`   Error creating user ${userData.email}:`, error.message);
      }
    }
  }

  return createdUsers;
}

async function createClients() {
  console.log('🏢 Creating clients...');
  
  const clients = [
    { name: 'TechCorp Solutions', email: 'contact@techcorp.com', company: 'TechCorp', phone: '+1234567890' },
    { name: 'Creative Studios', email: 'info@creativestudios.com', company: 'Creative Studios', phone: '+1234567891' },
    { name: 'Digital Marketing Pro', email: 'hello@dmPro.com', company: 'DM Pro', phone: '+1234567892' },
    { name: 'StartUp Innovations', email: 'team@startup.io', company: 'StartUp Inc', phone: '+1234567893' },
    { name: 'Global Enterprises', email: 'business@global.com', company: 'Global Ent', phone: '+1234567894' },
  ];

  const createdClients: any[] = [];

  for (const client of clients) {
    const docRef = await db.collection('clients').add({
      ...client,
      address: faker.location.streetAddress(),
      notes: faker.lorem.sentence(),
      created_at: admin.firestore.FieldValue.serverTimestamp(),
      updated_at: admin.firestore.FieldValue.serverTimestamp(),
    });
    createdClients.push({ ...client, id: docRef.id });
    console.log(`   Created client: ${client.name}`);
  }

  return createdClients;
}

async function createTasks(users: any[]) {
  console.log('📋 Creating tasks...');
  
  const employees = users.filter(u => u.role === 'employee');
  const statuses = ['pending', 'in_progress', 'completed', 'cancelled'];
  const priorities = ['low', 'medium', 'high', 'urgent'];
  
  for (let i = 0; i < 50; i++) {
    const assignedTo = faker.helpers.arrayElements(employees, faker.number.int({ min: 1, max: 3 }));
    const status = faker.helpers.arrayElement(statuses);
    const createdDate = randomDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), new Date());
    
    await db.collection('tasks').add({
      title: faker.company.catchPhrase(),
      description: faker.lorem.paragraph(),
      status,
      priority: faker.helpers.arrayElement(priorities),
      deadline: admin.firestore.Timestamp.fromDate(
        randomDate(new Date(), new Date(Date.now() + 30 * 24 * 60 * 60 * 1000))
      ),
      assigned_to: assignedTo.map(u => u.id),
      created_by: faker.helpers.arrayElement(users).id,
      project: faker.company.name(),
      tags: faker.helpers.arrayElements(['urgent', 'client-request', 'internal', 'review', 'production'], 2),
      created_at: admin.firestore.Timestamp.fromDate(createdDate),
      updated_at: admin.firestore.Timestamp.fromDate(
        status === 'completed' ? randomDate(createdDate, new Date()) : createdDate
      ),
    });
  }
  
  console.log('   Created 50 tasks');
}

async function createShoots(users: any[], clients: any[]) {
  console.log('📸 Creating shoots...');
  
  const statuses = ['scheduled', 'in_progress', 'completed', 'cancelled', 'postponed'];
  
  for (let i = 0; i < 30; i++) {
    const shootDate = randomDate(
      new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    );
    
    const shootRef = await db.collection('shoots').add({
      clientId: faker.helpers.arrayElement(clients).id,
      title: `${faker.company.buzzAdjective()} ${faker.company.buzzNoun()} Shoot`,
      date: admin.firestore.Timestamp.fromDate(shootDate),
      location: faker.location.city() + ', ' + faker.location.state(),
      details: faker.lorem.paragraph(),
      status: faker.helpers.arrayElement(statuses),
      equipment: faker.helpers.arrayElements(['Camera A', 'Camera B', 'Drone', 'Lights', 'Microphones'], 3),
      notes: faker.lorem.sentence(),
      created_by: faker.helpers.arrayElement(users).id,
      created_at: admin.firestore.FieldValue.serverTimestamp(),
      updated_at: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Add shoot assignments
    const assignedEmployees = faker.helpers.arrayElements(
      users.filter(u => u.role === 'employee'),
      faker.number.int({ min: 1, max: 3 })
    );
    
    for (const employee of assignedEmployees) {
      await db.collection('shoots').doc(shootRef.id).collection('assignments').add({
        shootId: shootRef.id,
        userId: employee.id,
        role: faker.helpers.arrayElement(['photographer', 'videographer', 'assistant', 'editor']),
        assigned_at: admin.firestore.FieldValue.serverTimestamp(),
      });
    }
  }
  
  console.log('   Created 30 shoots with assignments');
}

async function createLeads(users: any[]) {
  console.log('💼 Creating leads...');
  
  const statuses = ['new', 'contacted', 'qualified', 'proposal_sent', 'negotiation', 'won', 'lost'];
  const sources = ['website', 'referral', 'social_media', 'email', 'phone', 'event'];
  
  for (let i = 0; i < 25; i++) {
    const status = faker.helpers.arrayElement(statuses);
    await db.collection('leads').add({
      client_name: faker.person.fullName(),
      company: faker.company.name(),
      contact_email: faker.internet.email(),
      contact_phone: faker.phone.number(),
      status,
      source: faker.helpers.arrayElement(sources),
      demands: faker.lorem.paragraph(),
      budget: faker.number.int({ min: 5000, max: 50000 }),
      reason: status === 'lost' ? faker.lorem.sentence() : undefined,
      handled_by: faker.helpers.arrayElement(users.filter(u => u.role === 'executive')).id,
      notes: faker.lorem.sentence(),
      created_at: admin.firestore.Timestamp.fromDate(
        randomDate(new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), new Date())
      ),
      updated_at: admin.firestore.FieldValue.serverTimestamp(),
    });
  }
  
  console.log('   Created 25 leads');
}

async function createInvoices(clients: any[]) {
  console.log('💰 Creating invoices...');
  
  const statuses = ['draft', 'sent', 'paid', 'overdue', 'cancelled'];
  const paymentMethods = ['credit_card', 'bank_transfer', 'paypal', 'check'];
  
  for (let i = 0; i < 40; i++) {
    const status = faker.helpers.arrayElement(statuses);
    const issuedDate = randomDate(
      new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
      new Date()
    );
    const dueDate = new Date(issuedDate);
    dueDate.setDate(dueDate.getDate() + 30);
    
    const items = Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () => ({
      description: faker.commerce.productName(),
      quantity: faker.number.int({ min: 1, max: 10 }),
      rate: faker.number.float({ min: 100, max: 5000, fractionDigits: 2 }),
      amount: 0, // Will be calculated
    }));
    
    items.forEach(item => {
      item.amount = item.quantity * item.rate;
    });
    
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + tax;
    
    await db.collection('invoices').add({
      invoice_number: `INV-${Date.now()}-${i}`,
      clientId: faker.helpers.arrayElement(clients).id,
      amount: subtotal,
      tax,
      total,
      status,
      items,
      issued_at: admin.firestore.Timestamp.fromDate(issuedDate),
      due_date: admin.firestore.Timestamp.fromDate(dueDate),
      paid_at: status === 'paid' 
        ? admin.firestore.Timestamp.fromDate(randomDate(issuedDate, new Date()))
        : undefined,
      payment_method: status === 'paid' ? faker.helpers.arrayElement(paymentMethods) : undefined,
      notes: faker.lorem.sentence(),
      created_at: admin.firestore.Timestamp.fromDate(issuedDate),
      updated_at: admin.firestore.FieldValue.serverTimestamp(),
    });
  }
  
  console.log('   Created 40 invoices');
}

async function createNotifications(users: any[]) {
  console.log('🔔 Creating notifications...');
  
  const types = ['task', 'shoot', 'lead', 'invoice', 'system', 'approval', 'urgent'];
  const messages = {
    task: ['New task assigned', 'Task deadline approaching', 'Task completed'],
    shoot: ['New shoot scheduled', 'Shoot location changed', 'Shoot completed'],
    lead: ['New lead received', 'Lead status updated', 'Lead converted'],
    invoice: ['Invoice sent', 'Payment received', 'Invoice overdue'],
    system: ['System maintenance', 'New feature available', 'Security update'],
    approval: ['Approval required', 'Request approved', 'Request rejected'],
    urgent: ['Urgent: Client request', 'Urgent: Deadline today', 'Urgent: Action required'],
  };
  
  for (const user of users) {
    const notificationCount = faker.number.int({ min: 5, max: 15 });
    
    for (let i = 0; i < notificationCount; i++) {
      const type = faker.helpers.arrayElement(types) as keyof typeof messages;
      await db.collection('notifications').add({
        userId: user.id,
        type,
        title: faker.helpers.arrayElement(messages[type]),
        message: faker.lorem.sentence(),
        read: faker.datatype.boolean(),
        actionUrl: `/dashboard/${user.role}/${type}s`,
        metadata: {
          priority: faker.helpers.arrayElement(['low', 'medium', 'high']),
        },
        created_at: admin.firestore.Timestamp.fromDate(
          randomDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), new Date())
        ),
      });
    }
  }
  
  console.log(`   Created notifications for ${users.length} users`);
}

async function createFinancialData() {
  console.log('📊 Creating financial data...');
  
  // Create revenue data for the last 6 months
  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const month = date.toISOString().slice(0, 7);
    
    await db.collection('revenue').doc(month).set({
      month,
      amount: faker.number.int({ min: 50000, max: 150000 }),
      sources: [], // Would be populated from invoices in production
      created_at: admin.firestore.FieldValue.serverTimestamp(),
      updated_at: admin.firestore.FieldValue.serverTimestamp(),
    });
  }
  
  // Create expense data for the last 6 months
  const categories = ['Equipment', 'Software', 'Marketing', 'Salaries', 'Office', 'Travel'];
  
  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const month = date.toISOString().slice(0, 7);
    
    for (let j = 0; j < faker.number.int({ min: 5, max: 10 }); j++) {
      await db.collection('expenses').add({
        month,
        category: faker.helpers.arrayElement(categories),
        description: faker.commerce.productDescription(),
        amount: faker.number.int({ min: 500, max: 10000 }),
        vendor: faker.company.name(),
        receipt_url: faker.image.url(),
        approved_by: 'exec-user-id',
        created_at: admin.firestore.FieldValue.serverTimestamp(),
        updated_at: admin.firestore.FieldValue.serverTimestamp(),
      });
    }
  }
  
  console.log('   Created revenue and expense data for 6 months');
}

async function createFAQ() {
  console.log('❓ Creating FAQ items...');
  
  const faqs = [
    {
      question: 'How do I create a new task?',
      answer: 'Navigate to the Tasks section and click the "New Task" button. Fill in the required details and assign team members.',
      category: 'Tasks',
      order: 1,
    },
    {
      question: 'How do I schedule a shoot?',
      answer: 'Go to the Shoot Planner, click "Schedule Shoot", select the client, date, and location, then assign team members.',
      category: 'Shoots',
      order: 2,
    },
    {
      question: 'How do I generate content with AI?',
      answer: 'Visit the Content Studio, enter your prompt, select the tone and target audience, then click "Generate".',
      category: 'Content',
      order: 3,
    },
    {
      question: 'How do I track revenue?',
      answer: 'The Revenue dashboard shows all financial metrics. You can filter by date range and export reports.',
      category: 'Finance',
      order: 4,
    },
    {
      question: 'How do I manage team performance?',
      answer: 'The Team Performance section provides insights on productivity, task completion rates, and workload distribution.',
      category: 'Team',
      order: 5,
    },
  ];
  
  for (const faq of faqs) {
    await db.collection('faq').add({
      ...faq,
      created_at: admin.firestore.FieldValue.serverTimestamp(),
      updated_at: admin.firestore.FieldValue.serverTimestamp(),
    });
  }
  
  console.log('   Created FAQ items');
}

async function main() {
  try {
    console.log('🚀 Starting Firebase seeding...\n');
    
    // Clear existing data
    await clearCollections();
    
    // Create seed data
    const users = await createUsers();
    const clients = await createClients();
    
    await Promise.all([
      createTasks(users),
      createShoots(users, clients),
      createLeads(users),
      createInvoices(clients),
      createNotifications(users),
      createFinancialData(),
      createFAQ(),
    ]);
    
    console.log('\n✅ Seeding completed successfully!');
    console.log('\n📧 Test accounts:');
    console.log('   Employee: alex.employee@goat.media / password123');
    console.log('   Executive: mia.exec@goat.media / password123');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Seeding failed:', error);
    process.exit(1);
  }
}

// Run the seeding script
main();
