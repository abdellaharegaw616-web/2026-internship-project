const User = require('./models/User');
const Project = require('./models/Project');
const ProjectTemplate = require('./models/ProjectTemplate');
const Task = require('./models/Task');
const mongoose = require('mongoose');
require('dotenv').config();

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URL);
  console.log('Connected to MongoDB for seeding...');

  // Clear existing data
  await User.deleteMany({});
  await Project.deleteMany({});
  await ProjectTemplate.deleteMany({});
  await Task.deleteMany({});

  // Create users for SMART IT
  const admin = await User.create({
    name: 'SMART IT Admin',
    email: 'admin@smartit.com',
    password: 'admin123',
    role: 'Admin',
    department: 'Management',
    phone: '+1-555-0001',
  });

  const pm = await User.create({
    name: 'Ahmed Mohamed',
    email: 'ahmed@smartit.com',
    password: 'admin123',
    role: 'ProjectManager',
    department: 'Development',
    phone: '+1-555-0002',
  });

  const dev1 = await User.create({
    name: 'Abdellah Hassan',
    email: 'abdellah@smartit.com',
    password: 'admin123',
    role: 'TeamMember',
    department: 'Frontend Development',
    phone: '+1-555-0003',
  });

  const dev2 = await User.create({
    name: 'Sara Ali',
    email: 'sara@smartit.com',
    password: 'admin123',
    role: 'TeamMember',
    department: 'Backend Development',
    phone: '+1-555-0004',
  });

  const designer = await User.create({
    name: 'Omar Khalid',
    email: 'omar@smartit.com',
    password: 'admin123',
    role: 'TeamMember',
    department: 'UI/UX Design',
    phone: '+1-555-0005',
  });

  // Create project templates for SMART IT
  await ProjectTemplate.insertMany([
    {
      name: 'Web Application Development',
      description: 'Standard web application project for SMART IT clients.',
      category: 'Software',
      defaultStatus: 'Planning',
      defaultPriority: 'High',
      defaultDurationDays: 60,
      estimatedBudget: 50000,
      isSystem: true,
      defaultMilestones: [
        { title: 'Requirements Complete', daysOffset: 7 },
        { title: 'MVP Ready', daysOffset: 30 },
        { title: 'Production Launch', daysOffset: 55 },
      ],
      defaultTasks: [
        { title: 'Gather Requirements', description: 'Document functional and non-functional requirements', priority: 'High', daysOffset: 5 },
        { title: 'System Architecture Design', description: 'Create technical architecture and database schema', priority: 'High', daysOffset: 10 },
        { title: 'Core Development', description: 'Implement main features', priority: 'High', daysOffset: 25 },
        { title: 'QA Testing', description: 'Run test cases and fix bugs', priority: 'Medium', daysOffset: 45 },
        { title: 'Deployment', description: 'Deploy to production environment', priority: 'High', daysOffset: 55 },
      ],
    },
    {
      name: 'Mobile App Development',
      description: 'Mobile application development for iOS and Android.',
      category: 'Software',
      defaultStatus: 'Planning',
      defaultPriority: 'High',
      defaultDurationDays: 90,
      estimatedBudget: 75000,
      isSystem: true,
      defaultMilestones: [
        { title: 'Design Complete', daysOffset: 15 },
        { title: 'Beta Release', daysOffset: 60 },
        { title: 'App Store Launch', daysOffset: 85 },
      ],
      defaultTasks: [
        { title: 'UI/UX Design', description: 'Design all app screens', priority: 'High', daysOffset: 12 },
        { title: 'Frontend Development', description: 'Build React Native app', priority: 'High', daysOffset: 45 },
        { title: 'Backend API Integration', description: 'Connect to server APIs', priority: 'High', daysOffset: 55 },
        { title: 'Testing & Bug Fixes', description: 'QA testing and fixes', priority: 'Medium', daysOffset: 75 },
        { title: 'App Store Submission', description: 'Submit to Apple and Google stores', priority: 'High', daysOffset: 85 },
      ],
    },
    {
      name: 'IT Infrastructure Setup',
      description: 'Server and network infrastructure setup for clients.',
      category: 'General',
      defaultStatus: 'Planning',
      defaultPriority: 'Critical',
      defaultDurationDays: 30,
      estimatedBudget: 25000,
      isSystem: true,
      defaultMilestones: [
        { title: 'Hardware Procurement', daysOffset: 7 },
        { title: 'Network Configuration', daysOffset: 20 },
        { title: 'Go Live', daysOffset: 28 },
      ],
      defaultTasks: [
        { title: 'Hardware Assessment', description: 'Assess client hardware needs', priority: 'Urgent', daysOffset: 3 },
        { title: 'Server Setup', description: 'Configure servers and networking', priority: 'High', daysOffset: 15 },
        { title: 'Security Configuration', description: 'Setup firewalls and security protocols', priority: 'Urgent', daysOffset: 20 },
        { title: 'Testing & Validation', description: 'Test all systems', priority: 'High', daysOffset: 25 },
      ],
    },
  ]);

  // Create projects for SMART IT
  const project1 = await Project.create({
    title: 'Corporate Website Development',
    description: 'Develop a modern corporate website for a local business client with CMS integration.',
    status: 'Active',
    priority: 'High',
    startDate: new Date('2026-06-01'),
    endDate: new Date('2026-07-31'),
    members: [dev1._id, dev2._id, designer._id],
    createdBy: admin._id,
    estimatedBudget: 45000,
    actualCost: 12500,
    costEntries: [
      { description: 'Design tools subscription', amount: 500, category: 'Software', date: new Date('2026-06-05'), createdBy: pm._id },
      { description: 'Cloud hosting setup', amount: 12000, category: 'Infrastructure', date: new Date('2026-06-10'), createdBy: admin._id },
    ],
    milestones: [
      { title: 'Design Phase Complete', dueDate: new Date('2026-06-20'), completed: true, completedAt: new Date('2026-06-18') },
      { title: 'Backend API Ready', dueDate: new Date('2026-07-01'), completed: true, completedAt: new Date('2026-06-28') },
      { title: 'Beta Launch', dueDate: new Date('2026-07-20'), completed: false },
      { title: 'Production Release', dueDate: new Date('2026-07-31'), completed: false },
    ],
    activities: [{ action: 'Project created', user: admin._id }],
  });

  const project2 = await Project.create({
    title: 'Inventory Management System',
    description: 'Build a comprehensive inventory management system for a retail client.',
    status: 'Planning',
    priority: 'Critical',
    startDate: new Date('2026-07-01'),
    endDate: new Date('2026-09-30'),
    members: [dev1._id, pm._id],
    createdBy: pm._id,
    estimatedBudget: 60000,
    actualCost: 2500,
    milestones: [
      { title: 'Wireframes Approved', dueDate: new Date('2026-07-15'), completed: false },
      { title: 'MVP Complete', dueDate: new Date('2026-08-30'), completed: false },
    ],
    activities: [{ action: 'Project created', user: pm._id }],
  });

  const project3 = await Project.create({
    title: 'Client Portal Migration',
    description: 'Migrated legacy client portal to new cloud infrastructure.',
    status: 'Completed',
    priority: 'Medium',
    startDate: new Date('2026-01-01'),
    endDate: new Date('2026-03-31'),
    members: [dev2._id, pm._id],
    createdBy: admin._id,
    estimatedBudget: 20000,
    actualCost: 18500,
    isArchived: true,
    archivedAt: new Date('2026-04-01'),
    milestones: [
      { title: 'Data Migration', dueDate: new Date('2026-02-15'), completed: true, completedAt: new Date('2026-02-14') },
      { title: 'User Training', dueDate: new Date('2026-03-15'), completed: true, completedAt: new Date('2026-03-10') },
    ],
    activities: [
      { action: 'Project created', user: admin._id },
      { action: 'Project archived', user: admin._id },
    ],
  });

  // Create tasks for SMART IT projects
  const tasks = [
    { 
      title: 'Design Homepage UI', 
      description: 'Create wireframes and final designs for the corporate website homepage.', 
      status: 'Done', 
      priority: 'High', 
      dueDate: new Date('2026-06-20'), 
      assignedTo: designer._id, 
      project: project1._id, 
      createdBy: pm._id,
      comments: []
    },
    { 
      title: 'Build Authentication API', 
      description: 'Implement JWT-based login and register endpoints for the website CMS.', 
      status: 'Done', 
      priority: 'High', 
      dueDate: new Date('2026-06-25'), 
      assignedTo: dev2._id, 
      project: project1._id, 
      createdBy: pm._id,
      comments: []
    },
    { 
      title: 'Frontend - Product Listing Page', 
      description: 'Build the product catalog with filtering and search functionality.', 
      status: 'In Progress', 
      priority: 'High', 
      dueDate: new Date('2026-07-05'), 
      assignedTo: dev1._id, 
      project: project1._id, 
      createdBy: pm._id,
      comments: [
        { text: 'Please make sure the filters work with pagination. Priority task!', user: pm._id, createdAt: new Date(), updatedAt: new Date() },
        { text: 'Working on it. Will be done by EOD tomorrow.', user: dev1._id, createdAt: new Date(), updatedAt: new Date() }
      ]
    },
    { 
      title: 'Payment Gateway Integration', 
      description: 'Integrate payment gateway for the website.', 
      status: 'Todo', 
      priority: 'Urgent', 
      dueDate: new Date('2026-07-15'), 
      assignedTo: dev2._id, 
      project: project1._id, 
      createdBy: pm._id,
      comments: []
    },
    { 
      title: 'User Testing & Bug Fixes', 
      description: 'QA testing and fix reported bugs before beta launch.', 
      status: 'Todo', 
      priority: 'Medium', 
      dueDate: new Date('2026-07-25'), 
      assignedTo: dev1._id, 
      project: project1._id, 
      createdBy: pm._id,
      comments: []
    },
    { 
      title: 'Inventory System Wireframes', 
      description: 'Design wireframes for all inventory management system screens.', 
      status: 'In Progress', 
      priority: 'High', 
      dueDate: new Date('2026-07-10'), 
      assignedTo: designer._id, 
      project: project2._id, 
      createdBy: pm._id,
      comments: []
    },
    { 
      title: 'Setup React Project Structure', 
      description: 'Initialize project with navigation and state management for inventory system.', 
      status: 'Todo', 
      priority: 'Medium', 
      dueDate: new Date('2026-07-20'), 
      assignedTo: dev1._id, 
      project: project2._id, 
      createdBy: pm._id,
      comments: []
    },
  ];

  const createdTasks = await Task.insertMany(tasks.map(t => ({
    ...t,
    activities: [{ action: 'Task created', user: t.createdBy }],
  })));

  console.log('✅ Database seeded successfully!');
  console.log('');
  console.log('🔑 SMART IT Test Credentials:');
  console.log('   Admin:           admin@smartit.com    / admin123');
  console.log('   Project Manager: ahmed@smartit.com    / admin123');
  console.log('   Team Member:     abdellah@smartit.com / admin123');
  console.log('   Team Member:     sara@smartit.com     / admin123');
  console.log('   Team Member:     omar@smartit.com     / admin123');
  console.log('');
  console.log('⚠️  IMPORTANT: Change default passwords after first login!');

  process.exit(0);
};

seed().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});
