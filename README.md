# Task Flow Project Management System

A comprehensive web-based project management system built with the MERN stack (MongoDB, Express.js, React, Node.js) for managing team members, organizing projects, assigning tasks, tracking progress, and improving team collaboration.

## 🚀 Features

### Team Management
- ✅ Add, edit, and delete team members
- ✅ Avatar upload for team members
- ✅ Role-based access control (Admin, Project Manager, Team Member)
- ✅ Department filtering and organization
- ✅ Search and filter team members
- ✅ User profile management with personality traits (fun fact, superpower)
- ✅ Import/Export users (CSV/Excel)

### Project Management
- ✅ Create, edit, and delete projects
- ✅ Project avatar upload
- ✅ Assign team members to projects
- ✅ Track project progress automatically
- ✅ Project status management (Planning, Active, On Hold, Completed)
- ✅ Priority levels (Low, Medium, High, Critical)
- ✅ Milestone tracking
- ✅ Budget and cost tracking
- ✅ File attachments
- ✅ Archive and clone projects
- ✅ Project templates

### Task Management
- ✅ Create, edit, and delete tasks
- ✅ Assign tasks to team members
- ✅ Task status tracking (Todo, In Progress, Review, Done)
- ✅ Priority levels (Low, Medium, High, Urgent)
- ✅ Due date management
- ✅ Task comments for collaboration
- ✅ File attachments
- ✅ Time tracking

### Authentication & User Experience
- ✅ Multi-step registration (3 steps)
- ✅ Personality collection during registration (fun fact, superpower)
- ✅ Theme preference setup (light/dark/system)
- ✅ Time-based greetings on login
- ✅ Warm welcome messages
- ✅ Human-friendly error messages
- ✅ JWT authentication
- ✅ Session management
- ✅ Activity logging
- ✅ Password reset functionality

### Dashboard & Analytics
- ✅ Real-time statistics overview
- ✅ Team utilization metrics
- ✅ Project progress visualization
- ✅ Task completion charts
- ✅ Performance tracking
- ✅ Activity logs

## 🛠 Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **Lucide React** - Icons
- **Axios** - HTTP client
- **React Router** - Routing
- **Chart.js** - Data visualization
- **Socket.io Client** - Real-time communication

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **Socket.io** - Real-time communication
- **JWT** - Authentication
- **Multer** - File uploads
- **Winston** - Logging
- **Nodemailer** - Email notifications
- **Cloudinary** - Cloud storage

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB (local instance or MongoDB Atlas)
- npm or yarn

## 🔧 Installation

### 1. Clone the repository

```bash
git clone https://github.com/abdellaharegaw616-web/2026-internship-project.git
cd 2026-internship-project
```

### 2. Install dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 3. Environment Configuration

Create a `.env` file in the `server` directory:

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/taskflow
# or use MongoDB Atlas: MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/taskflow

# JWT
JWT_SECRET=your_jwt_secret_key_here

# Server
PORT=5000
NODE_ENV=development

# Client URL
CLIENT_URL=http://localhost:5173

# Email Configuration (optional - for password reset)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=noreply@taskflow.com

# Cloudinary (optional - for cloud storage)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Create a `.env` file in the `client` directory:

```env
VITE_API_URL=http://localhost:5000
```

### 4. Start MongoDB

If using local MongoDB:

```bash
# Windows
mongod

# Mac/Linux
sudo mongod
```

Or use MongoDB Atlas for cloud hosting.

### 5. Run the application

```bash
# Terminal 1 - Start server
cd server
npm start

# Terminal 2 - Start client
cd client
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- API Health: http://localhost:5000/api/health

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

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile
- `POST /api/auth/change-password` - Change password
- `POST /api/auth/avatar` - Upload avatar
- `POST /api/auth/forgot-password` - Request password reset
- `PUT /api/auth/reset-password/:token` - Reset password

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create user (Admin only)
- `PUT /api/users/:id` - Update user (Admin only)
- `DELETE /api/users/:id` - Delete user (Admin only)
- `GET /api/users/:id/performance` - Get user performance stats

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get project by ID
- `POST /api/projects` - Create project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `POST /api/projects/:id/avatar` - Upload project avatar
- `POST /api/projects/:id/clone` - Clone project
- `PUT /api/projects/:id/archive` - Archive project

### Tasks
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/:id` - Get task by ID
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `POST /api/tasks/:id/comments` - Add comment

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/team-utilization` - Get team utilization
- `GET /api/dashboard/public-stats` - Get public statistics

## 🎨 Features Workflow

### Admin Workflow
1. Register new team members with multi-step registration
2. Create projects and assign teams
3. Create and distribute tasks
4. Monitor progress through dashboard analytics
5. Manage user sessions and activity logs
6. Track project milestones and budgets

### Project Manager Workflow
1. Create projects for their teams
2. Assign team members to projects
3. Create and distribute tasks
4. Track project progress and team performance
5. Manage project milestones and budgets
6. Archive/clone projects as needed

### Team Member Workflow
1. Register with personality collection and theme preference
2. View assigned tasks and projects
3. Update task status as work progresses
4. Add comments for collaboration
5. Complete tasks and mark as done

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

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
