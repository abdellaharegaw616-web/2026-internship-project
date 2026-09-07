# Task Flow Project Management System

A comprehensive web-based project management system built with the MERN stack (MongoDB, Express.js, React, Node.js) for managing team members, organizing projects, assigning tasks, tracking progress, and improving team collaboration.

## 🚀 Features

### Team Management
- ✅ **Add, edit, and delete team members** - Full CRUD operations for team member management with validation
- ✅ **Avatar upload for team members** - Support for image uploads (JPG, PNG, JFIF) with automatic resizing and optimization
- ✅ **Role-based access control** - Three-tier role system (Admin, Project Manager, Team Member) with specific permissions
- ✅ **Department filtering and organization** - Organize team members by departments for better management
- ✅ **Search and filter team members** - Advanced search by name, email, role, department, and status
- ✅ **User profile management with personality traits** - Collect fun facts and superpowers to build team culture
- ✅ **Import/Export users (CSV/Excel)** - Bulk user management with import/export functionality for admins
- ✅ **Performance tracking** - View individual team member performance metrics and task completion rates
- ✅ **Activity logs** - Track all user activities for security and accountability
- ✅ **Session management** - Manage active sessions across devices with ability to revoke sessions

### Project Management
- ✅ **Create, edit, and delete projects** - Full project lifecycle management with validation and error handling
- ✅ **Project avatar upload** - Upload project logos and images for better visual identification
- ✅ **Assign team members to projects** - Flexible team assignment with role-based permissions
- ✅ **Track project progress automatically** - Real-time progress calculation based on task completion
- ✅ **Project status management** - Track project phases (Planning, Active, On Hold, Completed) with visual indicators
- ✅ **Priority levels** - Four-tier priority system (Low, Medium, High, Critical) for better resource allocation
- ✅ **Milestone tracking** - Create and track project milestones with due dates and completion status
- ✅ **Budget and cost tracking** - Monitor estimated vs actual costs with detailed cost entries
- ✅ **File attachments** - Upload project-related documents, images, and resources
- ✅ **Archive and clone projects** - Archive completed projects and clone existing projects for new initiatives
- ✅ **Project templates** - Create reusable project templates for consistent project setup
- ✅ **Activity timeline** - Track all project activities and changes with timestamps

### Task Management
- ✅ **Create, edit, and delete tasks** - Complete task management with validation and error handling
- ✅ **Assign tasks to team members** - Flexible task assignment with automatic notifications
- ✅ **Task status tracking** - Four-stage workflow (Todo, In Progress, Review, Done) with visual indicators
- ✅ **Priority levels** - Four-tier priority system (Low, Medium, High, Urgent) for better task prioritization
- ✅ **Due date management** - Set and track due dates with overdue task alerts
- ✅ **Task comments for collaboration** - Real-time commenting system for task discussions and updates
- ✅ **File attachments** - Upload task-related documents, images, and resources
- ✅ **Time tracking** - Track time spent on tasks for productivity analysis
- ✅ **Task filtering and search** - Advanced search and filter by status, priority, assignee, and due date
- ✅ **Task dependencies** - Set dependencies between tasks for complex project management
- ✅ **Activity tracking** - Track all task activities and changes with timestamps

### Authentication & User Experience
- ✅ **Multi-step registration (3 steps)** - Guided registration process with progress indicator and validation
- ✅ **Personality collection during registration** - Collect fun facts and superpowers to build team culture
- ✅ **Theme preference setup** - Choose between light, dark, or system theme during registration
- ✅ **Time-based greetings on login** - Dynamic greetings based on time of day (Good morning/afternoon/evening)
- ✅ **Warm welcome messages** - Random friendly welcome messages to enhance user experience
- ✅ **Human-friendly error messages** - Clear, non-technical error messages for better user understanding
- ✅ **JWT authentication** - Secure token-based authentication with automatic token refresh
- ✅ **Session management** - Track active sessions across devices with ability to revoke sessions
- ✅ **Activity logging** - Comprehensive logging of user activities for security and auditing
- ✅ **Password reset functionality** - Secure password reset via email with token-based verification
- ✅ **Remember me functionality** - Option to stay logged in across browser sessions
- ✅ **Demo account quick login** - Quick access to demo account for testing purposes

### Dashboard & Analytics
- ✅ **Real-time statistics overview** - Live dashboard with key metrics (total projects, tasks, team members, completion rates)
- ✅ **Team utilization metrics** - Visual representation of team workload and task distribution
- ✅ **Project progress visualization** - Interactive charts showing project completion status and progress trends
- ✅ **Task completion charts** - Bar and pie charts for task status distribution and completion rates
- ✅ **Performance tracking** - Individual and team performance metrics with trend analysis
- ✅ **Activity logs** - Comprehensive activity timeline showing recent actions and changes
- ✅ **Public statistics** - Anonymous statistics for login page showing project and task counts
- ✅ **Workload indicators** - Visual indicators showing team member workload balance
- ✅ **Deadline tracking** - Upcoming deadlines and overdue task alerts
- ✅ **Export reports** - Generate and export dashboard reports in various formats

## 🛠 Tech Stack

### Frontend
- **React 18** - Modern UI library with hooks and concurrent features for building interactive user interfaces
- **Vite** - Next-generation build tool with fast HMR (Hot Module Replacement) and optimized production builds
- **TailwindCSS** - Utility-first CSS framework for rapid UI development with consistent design system
- **Lucide React** - Beautiful, consistent icon library with 1000+ customizable icons
- **Axios** - Promise-based HTTP client for making API requests with interceptors and error handling
- **React Router v6** - Declarative routing for React applications with nested routes and lazy loading
- **Chart.js** - Flexible charting library for data visualization with responsive and accessible charts
- **Socket.io Client** - Real-time bidirectional event-based communication for live updates
- **React Context API** - State management for global application state (auth, theme, etc.)
- **React Query** - Data fetching and caching library for efficient API data management

### Backend
- **Node.js v18+** - JavaScript runtime built on Chrome's V8 engine for server-side applications
- **Express.js** - Fast, minimalist web framework for building robust APIs and web applications
- **MongoDB** - NoSQL document database with flexible schema and powerful querying capabilities
- **Mongoose** - Elegant MongoDB object modeling for Node.js with schema validation and middleware
- **Socket.io** - Real-time bidirectional event-based communication for live updates and notifications
- **JWT (JSON Web Tokens)** - Secure token-based authentication with HMAC signing and expiration
- **Multer** - Middleware for handling multipart/form-data for file uploads with storage options
- **Winston** - Versatile logging library with multiple transports and log levels
- **Nodemailer** - Email sending module for SMTP with support for attachments and HTML emails
- **Cloudinary** - Cloud-based image and video management service with CDN and transformations
- **Bcrypt** - Password hashing library for secure password storage with salt rounds
- **Helmet** - Security middleware for Express apps to set various HTTP headers for protection
- **CORS** - Middleware for enabling Cross-Origin Resource Sharing with configurable options
- **Morgan** - HTTP request logger middleware for Node.js with customizable formats
- **Compression** - Compression middleware for Express to gzip response bodies

## 📋 Prerequisites

Before installing Task Flow, ensure your system meets the following requirements:

- **Node.js** (v18 or higher) - Download from [nodejs.org](https://nodejs.org/)
- **MongoDB** (v4.4 or higher) - Local installation or MongoDB Atlas account
- **npm** (v9 or higher) - Comes bundled with Node.js
- **Git** - For cloning the repository
- **Modern web browser** - Chrome, Firefox, Safari, or Edge (latest version)

**Optional for production:**
- **Cloudinary account** - For cloud image storage
- **Gmail account** - For email notifications (with App Password enabled)
- **VPS or cloud hosting** - For deployment (AWS, DigitalOcean, Heroku, etc.)

## 🔧 Installation

### 1. Clone the repository

Clone the repository from GitHub using Git:

```bash
git clone https://github.com/abdellaharegaw616-web/2026-internship-project.git
cd 2026-internship-project
```

### 2. Install dependencies

Install server and client dependencies separately:

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

**Server dependencies include:**
- express, mongoose, cors, dotenv
- jsonwebtoken, bcryptjs
- multer, cloudinary
- socket.io, winston, nodemailer
- And other production dependencies

**Client dependencies include:**
- react, react-dom, react-router-dom
- axios, chart.js, socket.io-client
- lucide-react, clsx, tailwind-merge
- And other UI libraries

### 3. Environment Configuration

Create environment files for both server and client:

**Server Environment (`server/.env`):**

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/taskflow
# For MongoDB Atlas: MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/taskflow

# JWT Configuration
JWT_SECRET=your_secure_jwt_secret_key_here_change_this_in_production
JWT_EXPIRE=7d

# Server Configuration
PORT=5000
NODE_ENV=development

# Client URL (for CORS)
CLIENT_URL=http://localhost:5173

# Email Configuration (optional - for password reset emails)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
EMAIL_FROM=noreply@taskflow.com

# Cloudinary Configuration (optional - for cloud image storage)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**Client Environment (`client/.env`):**

```env
VITE_API_URL=http://localhost:5000
```

**Important Notes:**
- Never commit `.env` files to version control
- Use strong, unique secrets for production
- For Gmail, enable 2-Step Verification and create an App Password
- For MongoDB Atlas, whitelist your IP address in the network settings

### 4. Start MongoDB

**Option 1: Local MongoDB Installation**

If you have MongoDB installed locally:

```bash
# Windows
mongod

# Mac/Linux
sudo mongod
```

**Option 2: MongoDB Atlas (Cloud)**

For cloud hosting, use MongoDB Atlas:

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (free tier available)
3. Create a database user with username and password
4. Whitelist your IP address in Network Access
5. Get your connection string from the Connect button
6. Update your `.env` file with the connection string

**Option 3: Docker**

If you prefer using Docker:

```bash
# Pull and run MongoDB
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Or with persistence
docker run -d -p 27017:27017 -v mongodb_data:/data/db --name mongodb mongo:latest
```

### 5. Run the application

Start both the server and client in separate terminals:

**Terminal 1 - Backend Server:**

```bash
cd server
npm start
```

You should see:
```
✅ MongoDB connected successfully
🚀 Server running on http://localhost:5000
📋 API Health: http://localhost:5000/api/health
🔌 Socket.io initialized
```

**Terminal 2 - Frontend Client:**

```bash
cd client
npm run dev
```

You should see:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
➜  press h + enter to show help
```

### 6. Access the application

Open your browser and navigate to:
- **Frontend Application:** http://localhost:5173
- **Backend API:** http://localhost:5000
- **API Health Check:** http://localhost:5000/api/health

### 7. Seed the database (Optional)

To populate the database with sample data:

```bash
cd server
node src/seed.js
```

This will create:
- Sample users (Admin, Project Manager, Team Member)
- Sample projects
- Sample tasks
- Sample departments

## 📁 Project Structure

```
task-flow-project-management/
├── client/                 # Frontend React application
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── api/          # API service functions
│   │   ├── assets/       # Images and fonts
│   │   ├── components/   # Reusable components
│   │   ├── context/      # React Context providers
│   │   ├── hooks/        # Custom hooks
│   │   ├── pages/        # Page components
│   │   ├── routes/       # Route configuration
│   │   ├── services/     # Service functions
│   │   ├── utils/        # Utility functions
│   │   ├── App.jsx       # Main App component
│   │   └── main.jsx      # Entry point
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── server/                # Backend Node.js application
│   ├── src/
│   │   ├── config/       # Configuration files
│   │   ├── controllers/  # Route controllers
│   │   ├── middlewares/  # Express middlewares
│   │   ├── models/       # Mongoose models
│   │   ├── routes/       # API routes
│   │   ├── services/     # Business logic
│   │   ├── utils/        # Utility functions
│   │   ├── uploads/      # Upload directory
│   │   ├── seed.js       # Database seeding
│   │   └── server.js     # Entry point
│   ├── logs/            # Application logs
│   ├── .env.example
│   ├── package.json
│   └── .env
├── .gitignore
└── README.md
```

## 🔑 Default Credentials

### Admin Account
- Email: admin@taskflow.com
- Password: admin123

### Demo Account
- Email: demo@taskflow.com
- Password: demo123

## 📊 Database Schema

### Users Collection
```javascript
{
  name: String,
  email: String,
  password: String,
  role: String, // Admin, ProjectManager, TeamMember
  department: String,
  phone: String,
  avatar: String,
  funFact: String,
  superpower: String,
  themePreference: String, // light, dark, system
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Projects Collection
```javascript
{
  title: String,
  description: String,
  status: String, // Planning, Active, On Hold, Completed
  priority: String, // Low, Medium, High, Critical
  startDate: Date,
  endDate: Date,
  members: [ObjectId],
  createdBy: ObjectId,
  avatar: String,
  milestones: [{
    title: String,
    dueDate: Date,
    completed: Boolean
  }],
  attachments: [{
    filename: String,
    originalName: String,
    mimetype: String,
    size: Number
  }],
  estimatedBudget: Number,
  actualCost: Number,
  isArchived: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Tasks Collection
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
    createdAt: Date
  }],
  attachments: [{
    filename: String,
    originalName: String,
    mimetype: String,
    size: Number
  }],
  totalTime: Number,
  createdBy: ObjectId,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔌 API Endpoints

### Authentication Endpoints

#### Register New User
- **Endpoint:** `POST /api/auth/register`
- **Description:** Register a new user with multi-step registration process
- **Request Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepassword",
    "role": "TeamMember",
    "department": "Engineering",
    "phone": "+1234567890",
    "funFact": "I love hiking",
    "superpower": "Problem solving",
    "themePreference": "dark"
  }
  ```
- **Response:** JWT token and user object

#### Login User
- **Endpoint:** `POST /api/auth/login`
- **Description:** Authenticate user and return JWT token
- **Request Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "securepassword"
  }
  ```
- **Response:** JWT token and user object

#### Get Current User
- **Endpoint:** `GET /api/auth/me`
- **Description:** Get currently authenticated user details
- **Headers:** `Authorization: Bearer <token>`
- **Response:** User object with profile information

#### Get User Profile
- **Endpoint:** `GET /api/auth/profile`
- **Description:** Get detailed user profile with performance metrics
- **Headers:** `Authorization: Bearer <token>`
- **Response:** Extended user profile with stats

#### Update Profile
- **Endpoint:** `PUT /api/auth/profile`
- **Description:** Update user profile information
- **Headers:** `Authorization: Bearer <token>`
- **Request Body:** Profile fields to update
- **Response:** Updated user object

#### Change Password
- **Endpoint:** `POST /api/auth/change-password`
- **Description:** Change user password
- **Headers:** `Authorization: Bearer <token>`
- **Request Body:**
  ```json
  {
    "currentPassword": "oldpassword",
    "newPassword": "newpassword"
  }
  ```
- **Response:** Success message

#### Upload Avatar
- **Endpoint:** `POST /api/auth/avatar`
- **Description:** Upload user avatar image
- **Headers:** `Authorization: Bearer <token>`
- **Content-Type:** `multipart/form-data`
- **Request Body:** Image file
- **Response:** Avatar URL

#### Forgot Password
- **Endpoint:** `POST /api/auth/forgot-password`
- **Description:** Request password reset email
- **Request Body:**
  ```json
  {
    "email": "john@example.com"
  }
  ```
- **Response:** Success message (if email exists)

#### Reset Password
- **Endpoint:** `PUT /api/auth/reset-password/:token`
- **Description:** Reset password using token from email
- **Request Body:**
  ```json
  {
    "password": "newpassword"
  }
  ```
- **Response:** Success message

### User Management Endpoints

#### Get All Users
- **Endpoint:** `GET /api/users`
- **Description:** Get all users with filtering and pagination
- **Query Parameters:** `role`, `department`, `status`, `page`, `limit`
- **Headers:** `Authorization: Bearer <token>`
- **Response:** Array of users with metadata

#### Get User by ID
- **Endpoint:** `GET /api/users/:id`
- **Description:** Get specific user details
- **Headers:** `Authorization: Bearer <token>`
- **Response:** User object with full details

#### Create User (Admin Only)
- **Endpoint:** `POST /api/users`
- **Description:** Create new user (Admin/PM only)
- **Headers:** `Authorization: Bearer <token>`
- **Request Body:** User registration data
- **Response:** Created user object

#### Update User (Admin Only)
- **Endpoint:** `PUT /api/users/:id`
- **Description:** Update user details (Admin only)
- **Headers:** `Authorization: Bearer <token>`
- **Request Body:** User fields to update
- **Response:** Updated user object

#### Delete User (Admin Only)
- **Endpoint:** `DELETE /api/users/:id`
- **Description:** Delete user (Admin only)
- **Headers:** `Authorization: Bearer <token>`
- **Response:** Success message

#### Get User Performance
- **Endpoint:** `GET /api/users/:id/performance`
- **Description:** Get user performance statistics
- **Headers:** `Authorization: Bearer <token>`
- **Response:** Performance metrics (tasks completed, completion rate, etc.)

### Project Management Endpoints

#### Get All Projects
- **Endpoint:** `GET /api/projects`
- **Description:** Get all projects with filtering
- **Query Parameters:** `status`, `priority`, `department`, `page`, `limit`
- **Headers:** `Authorization: Bearer <token>`
- **Response:** Array of projects

#### Get Project by ID
- **Endpoint:** `GET /api/projects/:id`
- **Description:** Get specific project details
- **Headers:** `Authorization: Bearer <token>`
- **Response:** Project object with full details

#### Create Project
- **Endpoint:** `POST /api/projects`
- **Description:** Create new project (Admin/PM only)
- **Headers:** `Authorization: Bearer <token>`
- **Request Body:** Project details
- **Response:** Created project object

#### Update Project
- **Endpoint:** `PUT /api/projects/:id`
- **Description:** Update project details (Admin/PM only)
- **Headers:** `Authorization: Bearer <token>`
- **Request Body:** Project fields to update
- **Response:** Updated project object

#### Delete Project (Admin Only)
- **Endpoint:** `DELETE /api/projects/:id`
- **Description:** Delete project (Admin only)
- **Headers:** `Authorization: Bearer <token>`
- **Response:** Success message

#### Upload Project Avatar
- **Endpoint:** `POST /api/projects/:id/avatar`
- **Description:** Upload project avatar (Admin/PM only)
- **Headers:** `Authorization: Bearer <token>`
- **Content-Type:** `multipart/form-data`
- **Request Body:** Image file
- **Response:** Avatar URL

#### Clone Project
- **Endpoint:** `POST /api/projects/:id/clone`
- **Description:** Clone existing project (Admin/PM only)
- **Headers:** `Authorization: Bearer <token>`
- **Response:** New project object

#### Archive Project
- **Endpoint:** `PUT /api/projects/:id/archive`
- **Description:** Archive/unarchive project (Admin/PM only)
- **Headers:** `Authorization: Bearer <token>`
- **Request Body:** `{ "isArchived": true }`
- **Response:** Updated project object

### Task Management Endpoints

#### Get All Tasks
- **Endpoint:** `GET /api/tasks`
- **Description:** Get all tasks with filtering
- **Query Parameters:** `status`, `priority`, `project`, `assignedTo`, `page`, `limit`
- **Headers:** `Authorization: Bearer <token>`
- **Response:** Array of tasks

#### Get Task by ID
- **Endpoint:** `GET /api/tasks/:id`
- **Description:** Get specific task details
- **Headers:** `Authorization: Bearer <token>`
- **Response:** Task object with full details

#### Create Task
- **Endpoint:** `POST /api/tasks`
- **Description:** Create new task (Admin/PM only)
- **Headers:** `Authorization: Bearer <token>`
- **Request Body:** Task details
- **Response:** Created task object

#### Update Task
- **Endpoint:** `PUT /api/tasks/:id`
- **Description:** Update task details
- **Headers:** `Authorization: Bearer <token>`
- **Request Body:** Task fields to update
- **Response:** Updated task object

#### Delete Task (Admin Only)
- **Endpoint:** `DELETE /api/tasks/:id`
- **Description:** Delete task (Admin only)
- **Headers:** `Authorization: Bearer <token>`
- **Response:** Success message

#### Add Comment
- **Endpoint:** `POST /api/tasks/:id/comments`
- **Description:** Add comment to task
- **Headers:** `Authorization: Bearer <token>`
- **Request Body:** `{ "text": "Comment text" }`
- **Response:** Created comment object

### Dashboard Endpoints

#### Get Dashboard Statistics
- **Endpoint:** `GET /api/dashboard/stats`
- **Description:** Get dashboard statistics (authenticated users)
- **Headers:** `Authorization: Bearer <token>`
- **Response:** Dashboard metrics (projects, tasks, users, completion rates)

#### Get Team Utilization
- **Endpoint:** `GET /api/dashboard/team-utilization`
- **Description:** Get team utilization metrics (Admin/PM only)
- **Headers:** `Authorization: Bearer <token>`
- **Response:** Team workload distribution

#### Get Public Statistics
- **Endpoint:** `GET /api/dashboard/public-stats`
- **Description:** Get public statistics (no authentication required)
- **Response:** Anonymous project and task counts

## 🎨 Features Workflow

### Admin Workflow

**Step 1: Team Management**
- Register new team members using the multi-step registration process
- Collect personality traits (fun fact, superpower) to build team culture
- Set theme preferences for each team member
- Assign roles (Admin, Project Manager, Team Member)
- Organize team members by departments
- Import users in bulk using CSV/Excel files
- Manage user sessions and revoke suspicious sessions
- Monitor user activity logs for security

**Step 2: Project Setup**
- Create new projects with detailed information
- Upload project avatars for visual identification
- Set project priorities (Low, Medium, High, Critical)
- Define project timelines with start and end dates
- Assign team members to projects based on skills and availability
- Create project milestones with due dates
- Set estimated budgets for cost tracking

**Step 3: Task Distribution**
- Create tasks within projects with clear descriptions
- Assign tasks to appropriate team members
- Set task priorities and due dates
- Define task dependencies for complex workflows
- Upload task-related documents and resources
- Set up task comments for collaboration

**Step 4: Monitoring & Analytics**
- Monitor project progress through dashboard analytics
- Track team utilization and workload balance
- Review individual team member performance metrics
- Analyze task completion rates and trends
- Monitor upcoming deadlines and overdue tasks
- Review activity logs for security auditing

**Step 5: Project Management**
- Track project milestones and completion status
- Monitor budget vs actual costs
- Archive completed projects
- Clone successful projects for new initiatives
- Create project templates for consistent setup
- Export project reports for stakeholder updates

### Project Manager Workflow

**Step 1: Project Planning**
- Create projects for their teams with clear objectives
- Define project scope, timeline, and deliverables
- Set project priorities based on business needs
- Create project milestones with measurable goals
- Set estimated budgets for resource planning

**Step 2: Team Assignment**
- Assign team members to projects based on skills
- Balance workload across team members
- Review team availability and capacity
- Communicate project goals and expectations

**Step 3: Task Creation**
- Break down projects into manageable tasks
- Assign tasks to team members with clear deadlines
- Set task priorities for proper sequencing
- Define task dependencies for workflow management
- Provide task descriptions and requirements

**Step 4: Progress Tracking**
- Monitor project progress through dashboard
- Track task completion rates
- Review team member performance
- Identify bottlenecks and resource constraints
- Adjust timelines and assignments as needed

**Step 5: Collaboration**
- Review and respond to task comments
- Provide feedback on task progress
- Facilitate team communication
- Resolve conflicts and blockers
- Share project updates with stakeholders

**Step 6: Project Completion**
- Mark milestones as completed
- Track actual costs vs budget
- Archive completed projects
- Document lessons learned
- Create project templates for future use

### Team Member Workflow

**Step 1: Onboarding**
- Register with multi-step registration process
- Provide personality traits (fun fact, superpower)
- Set theme preference (light/dark/system)
- Complete profile with avatar upload
- Review assigned projects and tasks

**Step 2: Task Management**
- View assigned tasks and projects
- Review task descriptions and requirements
- Check due dates and priorities
- Update task status as work progresses
- Add comments for collaboration and questions

**Step 3: Collaboration**
- Participate in task discussions via comments
- Share updates and progress with team
- Request help when needed
- Provide feedback on tasks and projects
- Upload task-related files and resources

**Step 4: Time Tracking**
- Track time spent on tasks
- Update task progress regularly
- Mark tasks as complete when finished
- Review personal performance metrics
- Identify areas for improvement

**Step 5: Profile Management**
- Update personal information
- Change avatar as needed
- Update theme preference
- Manage password and security settings
- Review activity history

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository** - Create your own copy of the project
2. **Create a feature branch** - Use descriptive branch names (`git checkout -b feature/AmazingFeature`)
3. **Commit your changes** - Write clear, concise commit messages (`git commit -m 'Add some AmazingFeature'`)
4. **Push to the branch** - Push your changes to your fork (`git push origin feature/AmazingFeature`)
5. **Open a Pull Request** - Submit your changes for review with a detailed description

**Contribution Guidelines:**
- Follow the existing code style and conventions
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting
- Be respectful and constructive in code reviews

## 🐛 Troubleshooting

### Common Issues

**Issue: MongoDB Connection Error**
```
MongoDB connection error: Server selection timed out
```
**Solution:**
- Ensure MongoDB is running (check with `mongod` command)
- Verify your MONGODB_URI in `.env` file
- For MongoDB Atlas, whitelist your IP address
- Check network connectivity

**Issue: Port Already in Use**
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution:**
- Kill the process using port 5000: `npx kill-port 5000`
- Or change the PORT in your `.env` file

**Issue: Module Not Found**
```
Error: Cannot find module 'express'
```
**Solution:**
- Run `npm install` in the server directory
- Ensure `node_modules` exists
- Delete `node_modules` and `package-lock.json`, then reinstall

**Issue: CORS Errors**
```
Access to XMLHttpRequest has been blocked by CORS policy
```
**Solution:**
- Verify CLIENT_URL in server `.env` matches your frontend URL
- Check CORS configuration in `server/src/server.js`
- Ensure backend is running

**Issue: Email Not Sending**
```
Error: Missing credentials for "PLAIN"
```
**Solution:**
- Email credentials are optional for development
- Configure EMAIL_USER and EMAIL_PASS in `.env` for email features
- For Gmail, use App Password (not regular password)

**Issue: File Upload Failing**
```
Error: File too large
```
**Solution:**
- Default file size limit is 10MB
- Adjust limit in multer configuration if needed
- Ensure uploads directory has write permissions

### Development Tips

**Clear MongoDB Database:**
```bash
# Connect to MongoDB
mongosh
# Use taskflow database
use taskflow
# Drop database
db.dropDatabase()
```

**Reset Application State:**
```bash
# Clear node_modules
rm -rf node_modules package-lock.json
npm install

# Clear browser cache
# Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
```

**View Logs:**
```bash
# Server logs are stored in server/logs/
tail -f server/logs/combined.log
tail -f server/logs/error.log
```

## � Deployment Guide

### Deployment Overview

This application uses a split deployment strategy:
- **Frontend (React)**: Deployed on Vercel
- **Backend (Node.js/Express)**: Deployed on Render
- **Database**: MongoDB Atlas (cloud-hosted)
- **File Storage**: Cloudinary (cloud-hosted)
- **Email**: Gmail SMTP (optional)

### Prerequisites for Production

#### 1. MongoDB Atlas Account
- Free tier account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Create a cluster (M0 free tier recommended)
- Create database user with username/password
- Whitelist all IP addresses (0.0.0.0/0) for cloud deployment
- Get connection string

#### 2. Cloudinary Account (for image uploads)
- Free tier account at [Cloudinary](https://cloudinary.com)
- Get API Key, API Secret, and Cloud Name from dashboard
- Enable unsigned uploads or configure upload presets

#### 3. Gmail Account (for email notifications - optional)
- Gmail account with 2-Step Verification enabled
- Generate App Password from Google Account settings
- Use App Password (not regular password)

#### 4. Vercel Account (for frontend)
- Free account at [Vercel](https://vercel.com)
- Connect to GitHub repository

#### 5. Render Account (for backend)
- Free tier account at [Render](https://render.com)
- Connect to GitHub repository

---

### Frontend Deployment (Vercel)

#### Step 1: Prepare Frontend for Deployment

**Update `client/.env` for production:**
```env
VITE_API_URL=https://your-backend-api.onrender.com
```

**Create `client/vercel.json` (optional for custom configuration):**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

#### Step 2: Deploy to Vercel

1. **Push code to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Import project in Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New Project"
   - Import your GitHub repository
   - Select the `client` folder as root directory
   - Configure settings:
     - **Framework Preset**: Vite
     - **Root Directory**: `./client`
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`

3. **Add Environment Variables**
   - Go to Project Settings → Environment Variables
   - Add: `VITE_API_URL` = `https://your-backend-api.onrender.com`

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your frontend will be live at `https://your-project.vercel.app`

---

### Backend Deployment (Render)

#### Step 1: Prepare Backend for Production

**Update `server/package.json` (ensure start script):**
```json
{
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js"
  }
}
```

**Create `server/.env` for production (add these to Render, not commit):**
```env
# MongoDB Atlas Connection
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/taskflow?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your_secure_jwt_secret_key_minimum_32_characters
JWT_EXPIRE=7d

# Server Configuration
PORT=5000
NODE_ENV=production

# Client URL (your Vercel frontend)
CLIENT_URL=https://your-project.vercel.app

# Email Configuration (optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
EMAIL_FROM=noreply@taskflow.com

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

#### Step 2: Deploy to Render

1. **Push code to GitHub**
   ```bash
   git add .
   git commit -m "Ready for backend deployment"
   git push origin main
   ```

2. **Create Web Service on Render**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure settings:
     - **Name**: `taskflow-api` (or your preferred name)
     - **Root Directory**: `./server`
     - **Build Command**: `npm install`
     - **Start Command**: `node src/server.js`
     - **Environment**: Node
     - **Region**: Choose nearest region
     - **Instance Type**: Free (or paid for better performance)

3. **Add Environment Variables**
   - Go to Environment section in Render dashboard
   - Add all variables from `.env` above:
     - `MONGODB_URI`
     - `JWT_SECRET`
     - `CLIENT_URL`
     - `EMAIL_USER`, `EMAIL_PASS` (if using email)
     - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Your backend will be live at `https://taskflow-api.onrender.com`

5. **Get Backend URL**
   - Copy the URL from Render dashboard
   - Update `client/.env` and Vercel environment variable with this URL
   - Redeploy frontend on Vercel

---

### MongoDB Atlas Setup

#### Step 1: Create Cluster
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Click "Build a Database"
4. Choose "M0 Free" cluster (512MB storage)
5. Select a region (choose closest to your Render region)

#### Step 2: Configure Network Access
1. Go to Network Access → IP Access List
2. Click "Add IP Address"
3. Select "Allow Access from Anywhere" (0.0.0.0/0)
4. This is required for Render deployment

#### Step 3: Create Database User
1. Go to Database Access → MongoDB Users
2. Click "Create Database User"
3. Set username and password (save these!)
4. Choose "Read and write to any database"
5. Click "Create User"

#### Step 4: Get Connection String
1. Go to Database → Connect
2. Choose "Connect your application"
3. Select Node.js version
4. Copy the connection string
5. Replace `<password>` with your database user password
6. Use this as `MONGODB_URI` in Render environment variables

---

### Cloudinary Setup (for Image Uploads)

#### Step 1: Create Account
1. Go to [Cloudinary](https://cloudinary.com)
2. Sign up for free account
3. Verify email address

#### Step 2: Get Credentials
1. Go to Dashboard
2. Copy:
   - **Cloud Name** (e.g., `abc123`)
   - **API Key** (e.g., `123456789012345`)
   - **API Secret** (e.g., `abcdefghijklmnopqrstuvwxyz123456`)

#### Step 3: Configure in Render
1. Add these to Render environment variables:
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`

---

### Email Configuration (Optional)

#### Step 1: Enable Gmail App Password
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable 2-Step Verification (if not enabled)
3. Search for "App Passwords"
4. Create new App Password (name it "TaskFlow")
5. Copy the 16-character password

#### Step 2: Configure in Render
1. Add these to Render environment variables:
   - `EMAIL_USER` = your Gmail address
   - `EMAIL_PASS` = the App Password (not regular password)
   - `EMAIL_HOST` = `smtp.gmail.com`
   - `EMAIL_PORT` = `587`
   - `EMAIL_SECURE` = `false`

---

### Post-Deployment Checklist

- [ ] Frontend deployed on Vercel
- [ ] Backend deployed on Render
- [ ] MongoDB Atlas cluster created and connected
- [ ] Cloudinary configured for image uploads
- [ ] Email configured (if using email features)
- [ ] Environment variables set in both Vercel and Render
- [ ] Frontend `VITE_API_URL` points to backend URL
- [ ] Backend `CLIENT_URL` points to frontend URL
- [ ] Test user registration
- [ ] Test login functionality
- [ ] Test file uploads (avatars, project images)
- [ ] Test email notifications (if configured)
- [ ] Test real-time features (Socket.io)
- [ ] Verify all API endpoints are accessible

---

### Troubleshooting Deployment Issues

**Issue: Frontend can't connect to backend**
- Verify `VITE_API_URL` in Vercel environment variables
- Check backend is running on Render
- Ensure CORS is configured correctly in backend
- Check Render logs for errors

**Issue: MongoDB connection fails**
- Verify `MONGODB_URI` is correct in Render
- Check IP whitelist in MongoDB Atlas (should be 0.0.0.0/0)
- Ensure database user credentials are correct
- Check MongoDB Atlas cluster status

**Issue: File uploads failing**
- Verify Cloudinary credentials in Render
- Check Cloudinary account status
- Ensure file size limits are appropriate
- Check Render logs for upload errors

**Issue: Email not sending**
- Verify Gmail App Password (not regular password)
- Check 2-Step Verification is enabled
- Ensure email credentials are correct in Render
- Check if email service is blocked by Render

**Issue: Socket.io not working**
- Ensure backend is using WebSocket-compatible hosting
- Check if Render supports WebSockets (paid tier may be required)
- Verify Socket.io client configuration
- Check firewall/network settings

---

### Cost Summary (Free Tier)

| Service | Free Tier Limit | Cost |
|---------|----------------|------|
| Vercel (Frontend) | 100GB bandwidth/month | Free |
| Render (Backend) | 750 hours/month, 512MB RAM | Free |
| MongoDB Atlas | 512MB storage | Free |
| Cloudinary | 25GB storage/month, 25GB bandwidth/month | Free |
| Gmail SMTP | Limited daily emails | Free |

**Total Monthly Cost: $0 (Free Tier)**

**Note:** Free tiers have limitations. For production use with high traffic, consider upgrading to paid plans.

---

### Security Best Practices for Production

1. **Never commit `.env` files** to version control
2. **Use strong, unique secrets** for JWT and API keys
3. **Enable HTTPS** (automatic on Vercel and Render)
4. **Regularly update dependencies** for security patches
5. **Monitor logs** for suspicious activity
6. **Implement rate limiting** (already included in backend)
7. **Use environment-specific configurations**
8. **Regular database backups** (MongoDB Atlas automated backups)
9. **Restrict API access** with proper authentication
10. **Keep MongoDB Atlas IP whitelist** updated if needed

---

## �📝 License

This project is licensed under the MIT License.

## 👥 Authors

- **Abdellah Aregaw** - Initial work

## 🙏 Acknowledgments

- SMART IT 2026 Internship Program
- All contributors and team members

## 📞 Support

For support, email support@taskflow.com or open an issue in the repository.

---

**Built with ❤️ for SMART IT's 2026 Internship Program**
