# Task Flow - Project Management System

**2026 Task Flow Internship Project Management System for SMART IT**

A comprehensive MERN stack project management system developed for SMART IT company to manage team collaboration, track projects, assign tasks, and monitor team performance efficiently.

## Project Objective

Task Flow helps SMART IT company:
- Manage team members efficiently
- Organize and track company projects
- Assign and monitor tasks across teams
- Monitor project progress in real-time
- Improve team collaboration and communication
- Track team performance and productivity

## Features

### Module 1: Team Management

**Purpose**: Manage employees and their responsibilities.

**Team List Features:**
- ✅ Add Member (with avatar upload)
- ✅ Edit Member (with avatar upload)
- ✅ Delete Member
- ✅ View Profile
- ✅ Search Member
- ✅ Role Filter
- ✅ Department Filter
- ✅ Status Filter
- ✅ Import/Export Users (Admin only)

**Member Profile:**
- Personal Information
- Fun Fact & Superpower (personality traits)
- Role
- Department
- Assigned Projects
- Assigned Tasks
- Completed Tasks
- Pending Tasks
- Performance Score
- Avatar Display

**Performance Calculation:**
```
Performance = (Completed Tasks ÷ Assigned Tasks) × 100

Example:
- Assigned: 20
- Completed: 18
- Performance: 90%
```

### Module 2: Project Management

**Purpose**: Manage company projects.

**Project List Features:**
- ✅ Create Project (with avatar upload)
- ✅ Edit Project (with avatar upload)
- ✅ Delete Project
- ✅ Assign Members
- ✅ Search Projects
- ✅ Filter by Status
- ✅ Filter by Priority
- ✅ Archive/Unarchive Projects
- ✅ Clone Projects
- ✅ Project Templates
- ✅ Milestone Tracking
- ✅ Budget/Cost Tracking
- ✅ File Attachments

**Project Status:**
- Planning
- Active
- On Hold
- Completed

**Project Priority:**
- Low
- Medium
- High
- Critical

**Project Progress:**
- Auto calculate: Completed Tasks / Total Tasks
- Example: 15 / 20 = 75%

### Module 3: Task Management

**Purpose**: Track daily work.

**Task List Features:**
- ✅ Create Task
- ✅ Edit Task
- ✅ Delete Task
- ✅ Assign Task
- ✅ Status Update
- ✅ Priority Update
- ✅ Due Date
- ✅ Comments
- ✅ File Attachments

**Task Workflow:**
- Todo → In Progress → Review → Done

**Task Priority:**
- Low
- Medium
- High
- Urgent

**Task Details Sections:**
- Description
- Assigned User
- Project
- Status
- Priority
- Due Date
- Comments

### Dashboard

**Statistics Cards:**
- Total Projects
- Total Tasks
- Completed Tasks
- Team Members

**Charts:**
- Tasks by Status (Todo, In Progress, Review, Done)
- Projects by Status (Planning, Active, On Hold, Completed)

**Recent Activities:**
- Task Created
- Task Completed
- Project Created
- Member Added

### Authentication & User Experience

**Registration Flow:**
- ✅ Multi-step registration (3 steps)
- ✅ Step 1: Account details (name, email, password, role, department, phone)
- ✅ Step 2: Personality collection (fun fact, superpower)
- ✅ Step 3: Theme preference (light/dark/system)
- ✅ Warm welcome messages
- ✅ Creative placeholder suggestions
- ✅ Progress indicator

**Login Experience:**
- ✅ Time-based greetings (Good morning/afternoon/evening)
- ✅ Random welcome messages
- ✅ Human-friendly error messages
- ✅ Demo account quick login
- ✅ Remember me functionality

**User Profile:**
- ✅ Avatar upload
- ✅ Fun Fact & Superpower display
- ✅ Theme preference (respected on login)
- ✅ Profile editing
- ✅ Password change
- ✅ Session management

### Role Permissions

**Quick Reference Card:**

| Action | Admin | Project Manager | Team Member |
|--------|-------|-----------------|-------------|
| View Dashboard | ✅ Full | ✅ Project | ✅ Personal |
| Manage Users | ✅ | ❌ | ❌ |
| Assign Roles | ✅ | ❌ | ❌ |
| Create Projects | ✅ | ✅ | ❌ |
| Edit Projects | ✅ | ✅ (Own) | ❌ |
| Delete Projects | ✅ | ✅ (Own) | ❌ |
| View All Projects | ✅ | ✅ (Assigned) | ✅ (Assigned) |
| Create Tasks | ✅ | ✅ | ❌ |
| Edit Tasks | ✅ | ✅ (Own) | ❌ |
| Delete Tasks | ✅ | ✅ (Own) | ❌ |
| Assign Tasks | ✅ | ✅ | ❌ |
| Update Task Status | ✅ | ✅ | ✅ (Own) |
| Add Comments | ✅ | ✅ | ✅ |
| View Team Members | ✅ | ✅ | ✅ (Limited) |
| View Reports | ✅ | ✅ | ❌ |
| System Settings | ✅ | ❌ | ❌ |
| Audit Logs | ✅ | ❌ | ❌ |
| Add Attachments | ✅ | ✅ | ✅ |

**Role Summary:**

| Role | Key Strength | Key Restriction |
|------|--------------|-----------------|
| Admin | Full system control | Responsible for entire system |
| Project Manager | Manage projects and teams | Cannot manage users or system settings |
| Team Member | Focus on assigned tasks | Cannot create/delete projects or tasks |

**Admin:**
- Full access to all features
- Manage users and assign roles
- System settings and audit logs
- View all projects, tasks, and reports

**Project Manager:**
- Create, edit, and delete own projects
- Create and assign tasks
- View assigned projects and team members
- Cannot manage users or access system settings

**Team Member:**
- View assigned tasks and projects
- Update status of own tasks
- Add comments and attachments
- Cannot create/delete projects or tasks

### Sidebar Navigation

**Core Modules (5 Only):**
- Dashboard - Main overview with analytics, charts, and statistics
- Projects - Project management - create, edit, delete, view projects
- Tasks - Task management - create, assign, track, update tasks
- Team - Team member management - add, edit, delete, view profiles
- Settings - System settings - profile, preferences, configurations

### Database Collections

**Users Collection:**
```javascript
{
  name: String,
  email: String,
  password: String,
  role: String, // Admin, ProjectManager, TeamMember
  department: String,
  phone: String,
  avatar: String,
  funFact: String, // Personality trait
  superpower: String, // Personality trait
  themePreference: String, // light, dark, system
  welcomeMessageShown: Boolean,
  isActive: Boolean,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  twoFactorEnabled: Boolean,
  twoFactorSecret: String,
  twoFactorOTP: String,
  twoFactorOTPExpires: Date,
  createdAt: Date,
  updatedAt: Date
}
```

**Departments Collection:**
```javascript
{
  name: String,
  description: String,
  head: ObjectId, // Reference to User
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

**Projects Collection:**
```javascript
{
  title: String,
  description: String,
  status: String, // Planning, Active, On Hold, Completed
  priority: String, // Low, Medium, High, Critical
  startDate: Date,
  endDate: Date,
  members: [ObjectId], // Array of User references
  createdBy: ObjectId,
  avatar: String, // Project avatar image
  activities: [{
    action: String,
    user: ObjectId,
    createdAt: Date
  }],
  milestones: [{
    title: String,
    dueDate: Date,
    completed: Boolean,
    completedAt: Date
  }],
  attachments: [{
    filename: String,
    originalName: String,
    mimetype: String,
    size: Number,
    uploadedBy: ObjectId,
    uploadedAt: Date
  }],
  estimatedBudget: Number,
  actualCost: Number,
  costEntries: [{
    description: String,
    amount: Number,
    category: String,
    date: Date,
    createdBy: ObjectId
  }],
  isArchived: Boolean,
  archivedAt: Date,
  templateId: ObjectId, // Reference to ProjectTemplate
  createdAt: Date,
  updatedAt: Date
}
```

**Tasks Collection:**
```javascript
{
  title: String,
  description: String,
  project: ObjectId,
  assignedTo: ObjectId,
  status: String, // Todo, In Progress, Review, Done
  priority: String, // Low, Medium, High, Urgent
  dueDate: Date,
  comments: [{
    text: String,
    user: ObjectId,
    createdAt: Date,
    updatedAt: Date
  }],
  attachments: [{
    filename: String,
    originalName: String,
    mimetype: String,
    size: Number,
    uploadedBy: ObjectId,
    uploadedAt: Date
  }],
  activities: [{
    action: String,
    user: ObjectId,
    createdAt: Date
  }],
  totalTime: Number, // seconds
  createdBy: ObjectId,
  createdAt: Date,
  updatedAt: Date
}
```

## Problem Statement

Task Flow solves real problems that many small companies, software teams, startups, and internship teams face every day.

### Main Problem Solved

Before Task Flow, teams use:
- WhatsApp
- Telegram
- Excel sheets
- Google Docs
- Verbal communication

This creates problems:
- ❌ Tasks get forgotten
- ❌ Managers don't know who is working on what
- ❌ Team members receive unclear assignments
- ❌ Project progress is difficult to track
- ❌ Deadlines are missed
- ❌ Team performance is not measurable
- ❌ No central place for project information

### Problems & Solutions

**Problem 1: No Task Visibility**
- Situation: Manager assigns tasks in a WhatsApp group. After a few days, nobody knows who owns which task.
- Solution: Task Flow allows Task → Assigned User → Due Date → Status tracking

**Problem 2: Poor Project Tracking**
- Situation: Manager asks "How much of the project is completed?" Nobody knows.
- Solution: Automatic project progress (Completed Tasks / Total Tasks)

**Problem 3: Unbalanced Workload**
- Situation: One employee has 20 tasks, another has 2 tasks. Work is not distributed fairly.
- Solution: Workload Indicator shows task distribution per user

**Problem 4: No Team Performance Tracking**
- Situation: Manager cannot answer "Who is performing well?"
- Solution: Performance Dashboard shows assigned/completed tasks and performance %

**Problem 5: Lack of Accountability**
- Situation: When a task is late, who was responsible? Nobody knows.
- Solution: Every task has assigned user, due date, and status for clear ownership

**Problem 6: Poor Team Collaboration**
- Situation: Project discussions happen in many places (WhatsApp, Email, Telegram). Information gets lost.
- Solution: Task comments keep discussions centralized

**Problem 7: No Real-Time Project Overview**
- Situation: Managers must open many spreadsheets.
- Solution: Dashboard shows total projects, tasks, completed tasks, team members, charts, and activity logs

### Who Benefits?

- **SMART IT Company** - Internal team management and project tracking
- **Software Development Teams** (Frontend, Backend, QA, UI/UX)
- **Internship Programs** - Track intern tasks and progress
- **Small to Medium IT Companies**

### One-Line Problem Statement

Task Flow is a web-based project management system developed for SMART IT company's 2026 internship program to help manage team members, organize projects, assign tasks, track progress, and improve collaboration through a centralized platform.

### One-Line Business Value

The system improves productivity, accountability, project visibility, workload distribution, and team collaboration while reducing missed deadlines and communication gaps for SMART IT's internal operations and internship management.

## Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **TailwindCSS** - Styling with dark mode support
- **Lucide Icons** - Icon library
- **React Query** - Data fetching and caching
- **@hello-pangea/dnd** - Drag and drop for Kanban board
- **react-big-calendar** - Calendar view component
- **jspdf** - PDF export
- **xlsx** - Excel export
- **socket.io-client** - Real-time notifications

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Multer** - File uploads
- **Nodemailer** - Email notifications
- **Socket.io** - Real-time notifications

## Project Structure

```
task-flow/
│
├── client/                 # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── assets/        # Images, icons, logos
│   │   ├── components/    # Reusable components
│   │   │   ├── common/    # Button, Input, Modal, Table, Loader
│   │   │   ├── layout/    # Navbar, Sidebar, Header, DashboardLayout
│   │   │   ├── dashboard/# StatCard, TaskChart, ProjectChart
│   │   │   ├── user/      # UserCard, UserForm
│   │   │   ├── project/   # ProjectCard, ProjectForm
│   │   │   └── task/      # TaskCard, TaskForm, TaskComment
│   │   ├── pages/         # Page components
│   │   │   ├── auth/      # Login, Register
│   │   │   ├── dashboard/ # Dashboard
│   │   │   ├── users/     # Users, UserDetails
│   │   │   ├── projects/  # Projects, CreateProject, ProjectDetails
│   │   │   ├── tasks/     # Tasks, CreateTask, TaskDetails
│   │   │   ├── kanban/     # KanbanBoard
│   │   │   ├── calendar/   # CalendarView
│   │   │   └── settings/  # Profile
│   │   ├── routes/        # AppRoutes, ProtectedRoute
│   │   ├── services/      # API service layer, export service
│   │   ├── context/       # AuthContext, ThemeContext, SocketContext
│   │   ├── hooks/         # Custom hooks
│   │   └── utils/         # Utility functions
│   ├── package.json
│   └── vite.config.js
│
├── server/                 # Node/Express Backend
│   ├── src/
│   │   ├── config/        # Database, socket config
│   │   ├── controllers/   # Route controllers
│   │   ├── models/        # Mongoose models
│   │   ├── routes/        # API routes
│   │   ├── middlewares/   # Custom middlewares
│   │   ├── services/      # Business logic, email service
│   │   ├── utils/         # Utility functions
│   │   ├── uploads/       # File upload directory
│   │   └── seed.js        # Database seeding script
│   ├── .env
│   ├── package.json
│   └── nodemon.json
│
└── README.md
```

## Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Setup Instructions

1. **Clone the repository**
```bash
git clone <repository-url>
cd task-flow
```

2. **Install server dependencies**
```bash
cd server
npm install
```

3. **Configure environment variables**
Create a `.env` file in the server directory:
```env
PORT=5000
MONGO_URL=mongodb://localhost:27017/taskflow
JWT_SECRET=your-secret-key
JWT_EXPIRE=30d
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-app-password
CLIENT_URL=http://localhost:5173
```

4. **Install client dependencies**
```bash
cd ../client
npm install
```

5. **Configure client environment variables**
Create a `.env` file in the client directory:
```env
VITE_API_URL=http://localhost:5000/api
```

## Running the Application

### Start the Backend Server
```bash
cd server
npm run dev
```
Server will run on `http://localhost:5000`

### Start the Frontend Development Server
```bash
cd client
npm run dev
```
Frontend will run on `http://localhost:5173`

### Seed the Database
To populate the database with initial data for SMART IT:
```bash
cd server
node src/seed.js
```

This will create:
- Initial admin user for SMART IT
- Sample team members
- Sample projects
- Sample tasks for testing

**Default Admin Credentials:**
- Email: admin@smartit.com
- Password: admin123

**Note:** Change default passwords after first login for security.

## Database Schema

### Users
- `_id`: ObjectId
- `name`: String
- `email`: String (unique)
- `password`: String (hashed)
- `role`: Enum (Admin, ProjectManager, TeamMember)
- `department`: String
- `phone`: String
- `avatar`: String
- `createdAt`: Date
- `updatedAt`: Date

### Projects
- `_id`: ObjectId
- `title`: String
- `description`: String
- `status`: Enum (Planning, Active, On Hold, Completed)
- `priority`: Enum (Low, Medium, High, Critical)
- `startDate`: Date
- `endDate`: Date
- `members`: Array of User references
- `createdBy`: Reference to User
- `activities`: Array of activity objects
- `milestones`: Array of milestone objects
- `attachments`: Array of attachment objects
- `estimatedBudget`: Number
- `actualCost`: Number
- `costEntries`: Array of cost entry objects
- `isArchived`: Boolean
- `archivedAt`: Date
- `templateId`: Reference to ProjectTemplate
- `createdAt`: Date
- `updatedAt`: Date

### ProjectTemplates
- `_id`: ObjectId
- `name`: String
- `description`: String
- `category`: Enum (Software, Marketing, Product, Event, General)
- `defaultStatus`: Enum (Planning, Active, On Hold, Completed)
- `defaultPriority`: Enum (Low, Medium, High, Critical)
- `defaultDurationDays`: Number
- `estimatedBudget`: Number
- `defaultTasks`: Array of task template objects
- `defaultMilestones`: Array of milestone template objects
- `isSystem`: Boolean
- `createdBy`: Reference to User
- `createdAt`: Date
- `updatedAt`: Date

### Tasks
- `_id`: ObjectId
- `title`: String
- `description`: String
- `project`: Reference to Project
- `assignedTo`: Reference to User
- `status`: Enum (Todo, In Progress, Review, Done)
- `priority`: Enum (Low, Medium, High, Urgent)
- `dueDate`: Date
- `comments`: Array of embedded comment objects
- `attachments`: Array of attachment objects
- `activities`: Array of activity objects
- `createdBy`: Reference to User
- `createdAt`: Date
- `updatedAt`: Date

### Comments (Embedded in Tasks)
- `_id`: ObjectId
- `text`: String
- `user`: Reference to User
- `createdAt`: Date
- `updatedAt`: Date

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user (with personality fields)
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile
- `POST /api/auth/change-password` - Change password
- `POST /api/auth/avatar` - Upload user avatar
- `POST /api/auth/forgot-password` - Request password reset
- `PUT /api/auth/reset-password/:token` - Reset password
- `GET /api/auth/sessions` - Get user sessions
- `DELETE /api/auth/sessions/:sessionId` - Revoke session
- `POST /api/auth/sessions/revoke-all` - Revoke all sessions
- `GET /api/auth/activity-logs` - Get activity logs

### User Management
- `GET /api/users` - Get all users (filtered by role)
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user (Admin only)
- `PUT /api/users/:id` - Update user (Admin only)
- `DELETE /api/users/:id` - Delete user (Admin only)
- `GET /api/users/:id/performance` - Get user performance stats
- `POST /api/users/import` - Import users from CSV/Excel (Admin only)
- `GET /api/users/export` - Export users to CSV/Excel (Admin only)

### Project Management
- `GET /api/projects` - Get all projects (filtered by role)
- `GET /api/projects/team/members` - Get team members for assignment
- `GET /api/projects/:id` - Get project by ID
- `POST /api/projects` - Create new project (Admin/PM only)
- `PUT /api/projects/:id` - Update project (Admin/PM only)
- `DELETE /api/projects/:id` - Delete project (Admin only)
- `POST /api/projects/:id/avatar` - Upload project avatar (Admin/PM only)
- `POST /api/projects/:id/clone` - Clone project (Admin/PM only)
- `PUT /api/projects/:id/archive` - Archive project (Admin/PM only)
- `PUT /api/projects/:id/unarchive` - Unarchive project (Admin/PM only)
- `POST /api/projects/:id/milestones` - Add milestone (Admin/PM only)
- `PUT /api/projects/:id/milestones/:milestoneId` - Update milestone (Admin/PM only)
- `DELETE /api/projects/:id/milestones/:milestoneId` - Delete milestone (Admin/PM only)
- `POST /api/projects/:id/costs` - Add cost entry (Admin/PM only)
- `POST /api/projects/:id/attachments` - Upload attachment (Admin/PM only)
- `DELETE /api/projects/:id/attachments/:attachmentId` - Delete attachment (Admin/PM only)

### Task Management
- `GET /api/tasks` - Get all tasks (filtered by role)
- `GET /api/tasks/:id` - Get task by ID
- `POST /api/tasks` - Create new task (Admin/PM only)
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task (Admin/PM only)
- `POST /api/tasks/:id/comments` - Add comment
- `DELETE /api/tasks/:id/comments/:commentId` - Delete comment
- `POST /api/tasks/:id/attachments` - Upload attachment
- `DELETE /api/tasks/:id/attachments/:attachmentId` - Delete attachment

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/team-utilization` - Get team utilization (Admin/PM only)

## Features Workflow

### Admin Workflow
1. Register new team members with multi-step registration (account details → personality → theme)
2. Create projects and assign teams (with project avatars)
3. Create tasks and assign to team members
4. Monitor progress through dashboard analytics
5. Manage user sessions and activity logs
6. Import/export users for bulk management
7. Track project milestones and budgets
8. Toggle dark mode for better viewing experience

### Project Manager Workflow
1. Create projects for their teams (with project avatars)
2. Assign team members to projects
3. Create and distribute tasks
4. Track project progress and team performance
5. Manage project milestones and budgets
6. Upload project attachments
7. Archive/clone projects as needed

### Team Member Workflow
1. Register with personality collection and theme preference
2. View assigned tasks and projects
3. Update task status as work progresses
4. Add comments for collaboration
5. Upload task attachments
6. Complete tasks and mark as done
7. View team member profiles with fun facts and superpowers

## Automatic Progress Updates

- Project progress automatically updates when tasks are marked as complete
- Dashboard analytics reflect real-time data
- Performance metrics calculated dynamically

## Deployment

### Frontend Deployment (Vercel/Netlify)
1. Build the frontend: `npm run build`
2. Deploy the `dist` folder to your hosting platform
3. Set environment variables:
   - `VITE_API_URL` - Backend API URL

### Backend Deployment (Heroku/Railway/Render)
1. Deploy the server directory
2. Set environment variables:
   - `MONGO_URL` - MongoDB connection string
   - `JWT_SECRET` - JWT secret key
   - `EMAIL_USER` - Gmail address for notifications
   - `EMAIL_PASS` - Gmail app password
   - `CLIENT_URL` - Frontend URL
3. Ensure MongoDB is accessible (MongoDB Atlas recommended)
4. Configure uploads directory for file storage

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue in the repository or contact the development team.

---

## Project Completion

The Task Flow Project Management System has been successfully developed for SMART IT's 2026 Internship Program. It provides a complete solution for:

✅ Managing team members and their roles
✅ Tracking projects and their progress
✅ Assigning and monitoring tasks
✅ Visualizing data through dashboards
✅ Ensuring security with JWT authentication
✅ Providing role-based access control
✅ Multi-step registration with personality collection
✅ Avatar uploads for users and projects
✅ Theme preference system (light/dark/system)
✅ Human-friendly error messages
✅ Session management and activity logging
✅ File attachments for projects and tasks
✅ Project milestones and budget tracking
✅ Import/Export functionality for users
✅ Archive and clone project features

### Recent Enhancements

**User Experience Improvements:**
- Multi-step registration flow with personality collection (fun fact, superpower)
- Theme preference setup during registration (respected on login)
- Time-based greetings on login page
- Random warm welcome messages
- Human-friendly error messages throughout the application
- Avatar upload for team members and projects
- Creative placeholder suggestions for personality fields

**Backend Enhancements:**
- Extended User model with personality fields (funFact, superpower, themePreference)
- Extended Project model with avatar field
- Project avatar upload endpoint
- Enhanced error messages in authentication and user controllers
- Session management with device/browser tracking
- Activity logging for security auditing

**Frontend Enhancements:**
- Updated ThemeContext to respect user's theme preference
- Enhanced Register component with 3-step flow
- Enhanced Login component with warm messages
- Avatar upload UI in Team member creation/edit
- Avatar upload UI in Project creation/edit
- Progress indicator in registration flow
- Visual theme selection with icons

This project demonstrates proficiency in:

- MERN stack development
- Full-stack application architecture
- Project management principles
- Professional software development practices
- User experience design
- Database schema design
- API development and security
- Role-based access control
- File upload handling
- State management with React Context

**Project Status: COMPLETE ✅**

© 2026 Task Flow - SMART IT Internship Project 🚀
