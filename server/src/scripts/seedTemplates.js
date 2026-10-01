const mongoose = require('mongoose');
const ProjectTemplate = require('../models/ProjectTemplate');
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

const seedTemplates = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URL || 'mongodb://localhost:27017/taskflow');
    console.log('✅ Connected to MongoDB');

    const templates = [
      {
        name: 'E-Commerce Website',
        description: 'Standard template for building an e-commerce website with product catalog, cart, and checkout.',
        category: 'Software',
        defaultStatus: 'Planning',
        defaultPriority: 'High',
        defaultDurationDays: 45,
        estimatedBudget: 5000,
        isSystem: true,
        defaultTasks: [
          { title: 'Requirements Gathering', description: 'Collect client requirements.', priority: 'High', daysOffset: 0 },
          { title: 'UI/UX Design', description: 'Create mockups and wireframes.', priority: 'Medium', daysOffset: 5 },
          { title: 'Frontend Development', description: 'Develop UI components.', priority: 'High', daysOffset: 12 },
          { title: 'Backend Integration', description: 'Integrate payment gateways and APIs.', priority: 'High', daysOffset: 20 },
          { title: 'Testing & QA', description: 'Perform end-to-end testing.', priority: 'High', daysOffset: 35 },
          { title: 'Deployment', description: 'Deploy to production environment.', priority: 'Urgent', daysOffset: 42 }
        ],
        defaultMilestones: [
          { title: 'Design Approval', daysOffset: 10 },
          { title: 'Beta Release', daysOffset: 30 },
          { title: 'Go Live', daysOffset: 45 }
        ]
      },
      {
        name: 'Marketing Campaign',
        description: 'Template for launching a new digital marketing campaign across social media and email channels.',
        category: 'Marketing',
        defaultStatus: 'Planning',
        defaultPriority: 'Medium',
        defaultDurationDays: 30,
        estimatedBudget: 2000,
        isSystem: true,
        defaultTasks: [
          { title: 'Campaign Strategy', description: 'Define target audience and goals.', priority: 'High', daysOffset: 0 },
          { title: 'Content Creation', description: 'Write copy and design graphics.', priority: 'Medium', daysOffset: 5 },
          { title: 'Email Setup', description: 'Setup email workflows.', priority: 'Medium', daysOffset: 10 },
          { title: 'Ad Creation', description: 'Setup social media ads.', priority: 'High', daysOffset: 15 },
          { title: 'Launch', description: 'Start the campaign.', priority: 'Urgent', daysOffset: 20 },
          { title: 'Performance Review', description: 'Analyze metrics and adjust.', priority: 'Medium', daysOffset: 30 }
        ],
        defaultMilestones: [
          { title: 'Strategy Locked', daysOffset: 4 },
          { title: 'Assets Ready', daysOffset: 14 },
          { title: 'Campaign Live', daysOffset: 20 }
        ]
      },
      {
        name: 'Internal Event Planning',
        description: 'Template for organizing corporate events, offsites, or team-building activities.',
        category: 'Event',
        defaultStatus: 'Planning',
        defaultPriority: 'Low',
        defaultDurationDays: 60,
        estimatedBudget: 10000,
        isSystem: true,
        defaultTasks: [
          { title: 'Define Objective', description: 'Determine the goal of the event.', priority: 'Medium', daysOffset: 0 },
          { title: 'Venue Selection', description: 'Find and book a suitable venue.', priority: 'High', daysOffset: 5 },
          { title: 'Catering & Logistics', description: 'Arrange food and transportation.', priority: 'Medium', daysOffset: 20 },
          { title: 'Send Invitations', description: 'Send out invites to team members.', priority: 'Medium', daysOffset: 30 },
          { title: 'Final Confirmations', description: 'Confirm all bookings and attendees.', priority: 'High', daysOffset: 50 },
          { title: 'Event Day Execution', description: 'Manage the event on the day.', priority: 'Urgent', daysOffset: 60 }
        ],
        defaultMilestones: [
          { title: 'Venue Booked', daysOffset: 15 },
          { title: 'Invites Sent', daysOffset: 35 },
          { title: 'Event Complete', daysOffset: 60 }
        ]
      }
    ];

    // Check existing system templates to avoid duplicates
    const existing = await ProjectTemplate.find({ isSystem: true });
    if (existing.length > 0) {
      console.log(`⚠️  Found ${existing.length} existing system templates. Skipping seed to prevent duplicates.`);
    } else {
      await ProjectTemplate.insertMany(templates);
      console.log('✅ Default project templates seeded successfully!');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding templates:', error.message);
    process.exit(1);
  }
};

seedTemplates();
