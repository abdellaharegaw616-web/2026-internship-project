# Task Flow Project Management System - Implementation Notes

## Project Overview

**Project Name:** Task Flow Project Management System  
**Client:** SMART IT  
**Project Type:** 2026 Internship Project  
**Status:** Complete ✅  

Task Flow is a comprehensive web-based project management system designed to help organizations manage team members, organize projects, assign tasks, track progress, and improve collaboration through a centralized platform. It replaces inefficient tools like WhatsApp groups, Excel sheets, and verbal communication with a structured, professional solution.

---

## Technology Stack

### Frontend
- **Framework:** React 18
- **Build Tool:** Vite
- **Styling:** TailwindCSS
- **Icons:** Lucide React
- **Charts:** Recharts
- **State Management:** React Context API
- **HTTP Client:** Axios
- **Notifications:** React Hot Toast
- **Routing:** React Router v6
- **Query Management:** TanStack Query

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens)
- **File Upload:** Multer
- **Password Hashing:** bcryptjs
- **Email:** Nodemailer
- **Validation:** Express-validator
- **CORS:** cors middleware

### Development Tools
- **Version Control:** Git
- **Package Manager:** npm
- **API Testing:** Postman (recommended)

---

## Project Architecture

### Directory Structure

```
Task Flow Project Management System/
├── client/                          # Frontend React Application
│   ├── public/
│   │   └── uploads/                 # Uploaded files (avatars, attachments)
│   │       └── avatars/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js             # Axios configuration
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── DashboardLayout.jsx
│   │   │   │   ├── Header.jsx
│   │   │   │   └── Sidebar.jsx
│   │   │   └── ui/                 # Reusable UI components
│   │   ├── context/
│   │   │   ├── AuthContext.jsx      # Authentication state
│   │   │   └── ThemeContext.jsx     # Dark mode state
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Team.jsx
│   │   │   ├── MemberProfile.jsx
│   │   │   ├── Projects.jsx
│   │   │   ├── ProjectDetails.jsx
│   │   │   ├── Tasks.jsx
│   │   │   ├── Settings.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── ForgotPassword.jsx
│   │   │   ├── ResetPassword.jsx
│   │   │   └── Landing.jsx
│   │   ├── utils/
│   │   │   └── helpers.js          # Utility functions
│   │   ├── App.jsx                  # Main app component
│   │   ├── index.css               # Global styles
│   │   └── main.jsx                # Entry point
│   ├── package.json
│   └── vite.config.js
├── server/                          # Backend Express Application
│   ├── config/
│   │   ├── db.js                   # MongoDB connection
│   │   └── socket.js               # Socket.io configuration
│   ├── middleware/
│   │   ├── auth.js                 # Authentication middleware
│   │   ├── authMiddleware.js       # Alternative auth middleware
│   │   ├── roleMiddleware.js      # Role-based access control
│   │   ├── errorMiddleware.js      # Error handling
│   │   └── upload.js               # Multer file upload config
│   ├── models/
│   │   ├── User.js
│   │   ├── Project.js
│   │   ├── Task.js
│   │   ├── ActivityLog.js
│   │   ├── Session.js
│   │   ├── Department.js
│   │   ├── ProjectTemplate.js
│   │   └── Comment.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── projectController.js
│   │   ├── taskController.js
│   │   └── dashboardController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── projectRoutes.js
│   │   ├── taskRoutes.js
│   │   └── dashboardRoutes.js
│   ├── services/
│   │   └── emailService.js         # Email notifications
│   ├── src/
│   │   └── seed.js                # Database seeding
│   ├── utils/
│   │   └── sendEmail.js
│   ├── server.js                  # Express server entry point
│   └── package.json
├── .gitignore
├── README.md
├── ROLE_PERMISSIONS.md
└── IMPLEMENTATION_NOTES.md
```

---

## Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: Enum ['Admin', 'ProjectManager', 'TeamMember'],
  department: String,
  phone: String,
  avatar: String (URL),
  isActive: Boolean (default: true),
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Project Collection
```javascript
{
  _id: ObjectId,
  title: String (required),
  description: String,
  status: Enum ['Planning', 'Active', 'On Hold', 'Completed'],
  priority: Enum ['Low', 'Medium', 'High', 'Critical'],
  startDate: Date,
  endDate: Date,
  members: [ObjectId (ref: User)],
  createdBy: ObjectId (ref: User),
  avatar: String (URL),
  activities: [{
    action: String,
    user: ObjectId (ref: User),
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
    uploadedBy: ObjectId (ref: User),
    uploadedAt: Date
  }],
  estimatedBudget: Number,
  actualCost: Number,
  costEntries: [{
    description: String,
    amount: Number,
    category: String,
    date: Date,
    createdBy: ObjectId (ref: User)
  }],
  isArchived: Boolean,
  archivedAt: Date,
  templateId: ObjectId (ref: ProjectTemplate),
  createdAt: Date,
  updatedAt: Date
}
```

### Task Collection
```javascript
{
  _id: ObjectId,
  title: String (required),
  description: String,
  project: ObjectId (ref: Project),
  assignedTo: ObjectId (ref: User),
  status: Enum ['Todo', 'In Progress', 'Review', 'Done'],
  priority: Enum ['Low', 'Medium', 'High', 'Urgent'],
  dueDate: Date,
  createdBy: ObjectId (ref: User),
  comments: [{
    text: String,
    user: ObjectId (ref: User),
    createdAt: Date,
    updatedAt: Date
  }],
  activities: [{
    action: String,
    user: ObjectId (ref: User),
    createdAt: Date
  }],
  attachments: [{
    filename: String,
    originalName: String,
    mimetype: String,
    size: Number,
    uploadedBy: ObjectId (ref: User),
    uploadedAt: Date
  }],
  totalTime: Number (seconds),
  createdAt: Date,
  updatedAt: Date
}
```

### ActivityLog Collection
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User),
  action: String,
  details: Object,
  ipAddress: String,
  userAgent: String,
  createdAt: Date
}
```

### Session Collection
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User),
  token: String,
  device: String，
  browser: String,
  os: String,
  ipAddress: String,
  createdAt: Date,
  expiresAt: Date,
  isActive: Boolean
}
```

---

## API Endpoints

### Authentication Routes (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - Login user
- `GET /me` - Get current user
- `PUT /profile` - Update profile
- `PUT /change-password` - Change password
- `POST /forgot-password` - Request password reset
- `PUT /reset-password/:token` - Reset password
- `POST /avatar` - Upload user avatar
- `GET /sessions` - Get user sessions
- `DELETE /sessions/:sessionId` - Revoke session
- `POST /sessions/revoke-all` - Revoke all sessions
- `GET /activity-logs` - Get activity logs

### User Routes (`/api/users`)
- `GET /` - Get all users (filtered by role)
- `GET /:id` - Get user by ID
- `POST /` - Create user (Admin only)
- `PUT /:id` - Update user (Admin only)
- `DELETE /:id` - Delete user (Admin only)
- `GET /:id/performance` - Get user performance stats
- `POST /import` - Import users from CSV/Excel (Admin only)
- `GET /export` - Export users to CSV/Excel (Admin only)

### Project Routes (`/api/projects`)
- `GET /` - Get all projects (filtered by role)
- `GET /team/members` - Get team members for assignment
- `GET /:id` - Get project by ID
- `POST /` - Create project (Admin/PM only)
- `PUT /:id` - Update project (Admin/PM only)
- `DELETE /:id` - Delete project (Admin only)
- `POST /:id/avatar` - Upload project avatar (Admin/PM only)
- `POST /:id/clone` - Clone project (Admin/PM only)
- `PUT /:id/archive` - Archive project (Admin/PM only)
- `PUT /:id/unarchive` - Unarchive project (Admin/PM only)
- `POST /:id/milestones` - Add milestone (Admin/PM only)
- `PUT /:id/milestones/:milestoneId` - Update milestone (Admin/PM only)
- `DELETE /:id/milestones/:milestoneId` - Delete milestone (Admin/PM only)
- `POST /:id/costs` - Add cost entry (Admin/PM only)
- `POST /:id/attachments` - Upload attachment (Admin/PM only)
- `DELETE /:id/attachments/:attachmentId` - Delete attachment (Admin/PM only)

### Task Routes (`/api/tasks`)
- `GET /` - Get all tasks (filtered by role)
- `GET /:id` - Get task by ID
- `POST /` - Create task (Admin/PM only)
- `PUT /:id` - Update task
- `DELETE /:id` - Delete task (Admin/PM only)
- `POST /:id/comments` - Add comment
- `DELETE /:id/comments/:commentId` - Delete comment
- `POST /:id/attachments` - Upload attachment
- `DELETE /:id/attachments/:attachmentId` - Delete attachment

### Dashboard Routes (`/api/dashboard`)
- `GET /stats` - Get dashboard statistics
- `GET /team-utilization` - Get team utilization (Admin/PM only)

---

## Frontend Components

### Layout Components
- **DashboardLayout:** Main layout with sidebar and header
- **Header:** Top navigation with user info and theme toggle
- **Sidebar:** Navigation menu with role-based links

### Page Components
- **Landing:** Public landing page
- **Login:** User authentication
- **Register:** User registration
- **ForgotPassword:** Password reset request
- **ResetPassword:** Password reset form
- **Dashboard:** Main dashboard with charts and stats
- **Team:** Team member management
- **MemberProfile:** Individual member profile view
- **Projects:** Project management
- **ProjectDetails:** Detailed project view
- **Tasks:** Task management
- **Settings:** User settings and preferences

### Context Providers
- **AuthContext:** Manages authentication state and user data
- **ThemeContext:** Manages dark mode theme

### Utility Functions (helpers.js)
- `getInitials(name)` - Get initials from name
- `getAvatarColor(role)` - Get role-based avatar color
- `getRoleClass(role)` - Get role badge styling
- `getRoleLabel(role)` - Get role display name
- `getProjectStatusClass(status)` - Get project status styling
- `getPriorityClass(priority)` - Get priority styling
- `formatDate(date)` - Format date string
- `formatCurrency(amount)` - Format currency
- `getDaysRemaining(date)` - Calculate days remaining
- `timeAgo(date)` - Get relative time string

---

## Authentication & Authorization

### JWT Authentication Flow
1. User registers/logs in
2. Server generates JWT token (7-day expiry)
3. Token stored in localStorage
4. Token sent in Authorization header for protected routes
5. Middleware verifies token and attaches user to request

### Role-Based Access Control (RBAC)
Three user roles with hierarchical permissions:
- **Admin:** Full access to all features
- **ProjectManager:** Full access to projects and tasks, read-only on users
- **TeamMember:** Limited access to own tasks and assigned projects

### Middleware
- **protect:** Verifies JWT token and authenticates user
- **authorize(...roles):** Checks if user has required role
- **authMiddleware:** Alternative authentication middleware
- **roleMiddleware:** Role-based access control middleware

### Session Management
- Sessions tracked in Session collection
- Multiple device support
- Session revocation capability
- Activity logging for security

---

## Implemented Features

### 1. Authentication Module
- User registration with validation
- User login with JWT
- Password reset via email
- Profile management
- Avatar upload
- Session management
- Activity logging
- 2FA support (OTP generation/verification)

### 2. Team Management Module
- Team member list with search/filter
- Add new team members
- Edit member profiles
- Delete members (Admin only)
- Member profile view
- Performance tracking
- Import/Export users (Admin only)
- Avatar upload for members

### 3. Project Management Module
- Project list with search/filter
- Create new projects
- Edit project details
- Delete projects (Admin only)
- Project details view
- Member assignment
- Progress calculation (auto)
- Project avatar upload
- Archive/unarchive projects
- Clone projects
- Milestone tracking
- Budget/cost tracking
- File attachments

### 4. Task Management Module
- Task list with search/filter
- Create new tasks
- Edit task details
- Delete tasks (Admin/PM)
- Task details view
- Status management (Todo, In Progress, Review, Done)
- Priority management (Low, Medium, High, Urgent)
- Task assignment
- Comments system
- File attachments
- Due date tracking

### 5. Dashboard Module
- Statistics cards (Projects, Tasks, Team Members, Completed)
- Task status distribution chart (Pie)
- Project status distribution chart (Bar)
- Recent activities
- Upcoming tasks
- Project health indicators
- Team utilization metrics (Admin/PM)
- Burndown charts
- Real-time data updates

### 6. Settings Module
- Profile editing
- Password change
- Avatar upload
- Theme toggle (dark/light mode)
- Session management
- Activity log viewing

### 7. UI/UX Features
- Responsive design (mobile-friendly)
- Dark mode support
- Toast notifications
- Modal dialogs
- Loading states
- Form validation
- Role-based avatar colors
- Smooth transitions
- Professional styling

---

## Security Implementation

### Password Security
- Passwords hashed using bcryptjs
- Minimum 6 characters required
- Password change functionality
- Reset token with expiry

### API Security
- JWT token authentication
- Protected routes middleware
- Role-based access control
- CORS configuration
- Input validation
- SQL injection prevention (MongoDB sanitization)

### File Upload Security
- File type validation (images only)
- File size limits (10MB)
- Secure file storage
- Malicious file prevention

### Session Security
- Session tracking
- Device information logging
- IP address tracking
- Session revocation
- Activity logging

---

## Environment Variables

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

### Backend (.env)
```
PORT=5000
MONGO_URL=mongodb://localhost:27017/taskflow
JWT_SECRET=your_jwt_secret_key
CLIENT_URL=http://localhost:5173
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
NODE_ENV=development
```

---

## Database Seeding

The seed script (`server/src/seed.js`) populates the database with:
- 6 realistic users (Admin, Project Managers, Team Members)
- 5 realistic SMART IT client projects
- 20+ realistic tasks across projects
- Proper role assignments and project memberships

**Test Credentials:**
- Admin: admin@smartit.com / admin123
- Project Manager: sarah.johnson@smartit.com / sarah123
- Team Member: michael.chen@smartit.com / michael123

---

## Deployment Considerations

### Frontend Deployment (Vercel)
1. Build the frontend: `npm run build`
2. Deploy the `dist` folder to Vercel
3. Set environment variable: `VITE_API_URL`

### Backend Deployment (Render)
1. Deploy the server directory
2. Set environment variables:
   - `MONGO_URL` - MongoDB Atlas connection string
   - `JWT_SECRET` - JWT secret key
   - `CLIENT_URL` - Frontend URL
   - `EMAIL_USER` - Gmail address
   - `EMAIL_PASS` - Gmail app password
3. Configure MongoDB Atlas for database
4. Ensure uploads directory is writable

### Database Deployment (MongoDB Atlas)
1. Create MongoDB Atlas cluster
2. Create database user
3. Whitelist IP addresses
4. Get connection string
5. Update environment variables

---

## Key Implementation Details

### Avatar System
- Role-based avatar colors (Admin: Purple, PM: Blue, TeamMember: Green)
- Avatar upload via multer middleware
- Stored in `public/uploads/avatars/`
- Served as static files
- Automatic fallback to initials if no avatar

### Progress Calculation
- Project progress = (Completed Tasks / Total Tasks) × 100
- Automatically recalculated on task updates
- Displayed in project cards and dashboard

### Activity Logging
- All user actions logged
- Includes action type, user, timestamp
- Viewable in user profile
- Used for security auditing

### Real-time Updates
- Dashboard data fetched on each request
- No WebSocket implementation (future enhancement)
- Efficient data aggregation
- Role-based filtering

### Email Notifications
- Password reset emails
- Project assignment notifications
- Task assignment notifications
- Due date reminders
- Using Nodemailer with Gmail

---

## Performance Optimizations

### Frontend
- React.memo for component optimization
- Lazy loading for routes (future)
- Efficient state management with Context
- Optimized re-renders
- Image optimization (future)

### Backend
- Database indexing on frequently queried fields
- Efficient aggregation queries
- Pagination support (future)
- Response caching (future)
- Connection pooling

---

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES6+ JavaScript support required
- Responsive design works on all screen sizes
- Progressive enhancement approach

---

## Future Enhancements

### Planned Features
- WebSocket for real-time updates
- Kanban board view
- Calendar view for tasks
- Advanced reporting and analytics
- Mobile app (React Native)
- Integration with third-party tools (Slack, GitHub)
- Advanced search and filtering
- Bulk operations
- Custom fields
- Webhooks
- API rate limiting
- Advanced permissions system

### Technical Improvements
- Unit testing with Jest
- E2E testing with Playwright
- CI/CD pipeline
- Docker containerization
- Redis caching
- Load balancing
- CDN for static assets
- Image compression
- Database sharding for scale

---

## Troubleshooting

### Common Issues

**1. CORS Errors**
- Ensure `CLIENT_URL` matches frontend URL
- Check CORS middleware configuration

**2. Authentication Failures**
- Verify JWT_SECRET matches between environments
- Check token expiry (7 days)
- Ensure token sent in Authorization header

**3. File Upload Failures**
- Ensure uploads directory exists and is writable
- Check file size limits
- Verify multer configuration

**4. Database Connection Issues**
- Verify MongoDB connection string
- Check MongoDB Atlas IP whitelist
- Ensure database user has correct permissions

**5. Avatar Not Displaying**
- Check if file exists in uploads directory
- Verify static file serving configuration
- Check avatar URL in database

---

## Development Guidelines

### Code Style
- Use functional components with hooks
- Follow React best practices
- Use descriptive variable names
- Add comments for complex logic
- Keep components small and focused

### API Design
- RESTful conventions
- Consistent response format
- Proper HTTP status codes
- Error handling with messages
- Input validation

### Database Design
- Proper indexing
- Reference integrity
- Efficient queries
- Data validation at schema level

---

## Testing Recommendations

### Manual Testing Checklist
- [ ] User registration and login
- [ ] Role-based access control
- [ ] Team member CRUD operations
- [ ] Project CRUD operations
- [ ] Task CRUD operations
- [ ] Avatar upload for users
- [ ] Avatar upload for projects
- [ ] Dashboard stats accuracy
- [ ] Dark mode toggle
- [ ] Responsive design on mobile
- [ ] Form validation
- [ ] Error handling
- [ ] Logout functionality

### Automated Testing (Future)
- Unit tests for utilities
- Component tests with React Testing Library
- API endpoint tests
- Integration tests
- E2E tests with Playwright

---

## Support and Maintenance

### Regular Maintenance Tasks
- Monitor server logs
- Check database performance
- Update dependencies
- Review security vulnerabilities
- Backup database regularly
- Monitor disk space (uploads)

### Monitoring (Future)
- Application performance monitoring
- Error tracking (Sentry)
- Uptime monitoring
- Database performance monitoring
- User analytics

---

## Conclusion

The Task Flow Project Management System is a fully functional, production-ready application built with modern web technologies. It provides a comprehensive solution for team and project management with robust security, intuitive UI, and scalable architecture. The system is designed to be easily extended and maintained, with clear separation of concerns and well-documented code.

**Project Status:** Complete ✅  
**Last Updated:** July 2026  
**Version:** 1.0.0  

---

*This implementation document reflects the current state of the SMART IT 2026 Internship Project.*
