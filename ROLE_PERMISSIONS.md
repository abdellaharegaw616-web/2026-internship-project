# Role-Based Access Control (RBAC) Permissions

## Overview
The Task Flow Project Management System uses three user roles with specific permissions across Team, Project, and Task modules.

---

## Admin Role

### Team Module
**Can Do:**
- ✅ View all team members with full details
- ✅ Create new team members
- ✅ Edit any team member's profile
- ✅ Delete any team member
- ✅ View member performance metrics
- ✅ Import users from CSV/Excel
- ✅ Export users to CSV/Excel
- ✅ Activate/deactivate user accounts

**Cannot Do:**
- ❌ None (Admin has full access)

### Project Module
**Can Do:**
- ✅ View all projects
- ✅ Create new projects
- ✅ Edit any project
- ✅ Delete any project
- ✅ Archive/unarchive projects
- ✅ Clone projects
- ✅ Add project milestones
- ✅ Edit/delete project milestones
- ✅ Add cost entries
- ✅ Upload project attachments
- ✅ Delete project attachments
- ✅ Upload project avatar
- ✅ Assign team members to projects

**Cannot Do:**
- ❌ None (Admin has full access)

### Task Module
**Can Do:**
- ✅ View all tasks across all projects
- ✅ Create tasks for any project
- ✅ Edit any task
- ✅ Delete any task
- ✅ Assign tasks to any team member
- ✅ Add comments to any task
- ✅ Delete comments from any task
- ✅ Change task status and priority
- ✅ Upload task attachments
- ✅ Delete task attachments

**Cannot Do:**
- ❌ None (Admin has full access)

### Dashboard
**Can Do:**
- ✅ View all dashboard statistics
- ✅ View team utilization data
- ✅ View project health reports
- ✅ View burndown charts

---

## Project Manager Role

### Team Module
**Can Do:**
- ✅ View all team members with full details
- ✅ View member performance metrics
- ✅ Search and filter team members

**Cannot Do:**
- ❌ Create new team members
- ❌ Edit team member profiles
- ❌ Delete team members
- ❌ Import/export users
- ❌ Activate/deactivate user accounts

### Project Module
**Can Do:**
- ✅ View all projects
- ✅ Create new projects
- ✅ Edit any project
- ✅ Archive/unarchive projects
- ✅ Clone projects
- ✅ Add project milestones
- ✅ Edit/delete project milestones
- ✅ Add cost entries
- ✅ Upload project attachments
- ✅ Delete project attachments
- ✅ Upload project avatar
- ✅ Assign team members to projects

**Cannot Do:**
- ❌ Delete projects (Admin only)

### Task Module
**Can Do:**
- ✅ View all tasks across all projects
- ✅ Create tasks for any project
- ✅ Edit any task
- ✅ Delete any task
- ✅ Assign tasks to any team member
- ✅ Add comments to any task
- ✅ Delete comments from any task
- ✅ Change task status and priority
- ✅ Upload task attachments
- ✅ Delete task attachments

**Cannot Do:**
- ❌ None (Project Manager has full task access)

### Dashboard
**Can Do:**
- ✅ View all dashboard statistics
- ✅ View team utilization data
- ✅ View project health reports
- ✅ View burndown charts

---

## Team Member Role

### Team Module
**Can Do:**
- ✅ View team members (limited view - name, avatar, department only)
- ✅ View own profile

**Cannot Do:**
- ❌ Create team members
- ❌ Edit team member profiles (except own via Settings)
- ❌ Delete team members
- ❌ View member performance metrics
- ❌ Import/export users
- ❌ Activate/deactivate user accounts
- ❌ View sensitive member details (email, phone, etc.)

### Project Module
**Can Do:**
- ✅ View projects they are assigned to
- ✅ View project details
- ✅ View project members

**Cannot Do:**
- ❌ Create new projects
- ❌ Edit projects
- ❌ Delete projects
- ❌ Archive/unarchive projects
- ❌ Clone projects
- ❌ Add/edit/delete milestones
- ❌ Add cost entries
- ❌ Upload/delete attachments
- ❌ Upload project avatar
- ❌ Assign team members to projects

### Task Module
**Can Do:**
- ✅ View tasks assigned to them
- ✅ Edit their own tasks
- ✅ Update their own task status
- ✅ Add comments to their tasks
- ✅ Delete their own comments
- ✅ Upload attachments to their tasks

**Cannot Do:**
- ❌ View tasks assigned to others
- ❌ Create tasks
- ❌ Delete tasks
- ❌ Assign tasks to others
- ❌ Change task priority
- ❌ Add comments to others' tasks
- ❌ Delete others' comments
- ❌ Delete attachments from others' tasks

### Dashboard
**Can Do:**
- ✅ View personal dashboard statistics
- ✅ View own task statistics
- ✅ View own project progress

**Cannot Do:**
- ❌ View team utilization data (Admin/PM only)
- ❌ View overall project health reports
- ❌ View team burndown charts

---

## Permission Summary Table

| Feature | Admin | Project Manager | Team Member |
|---------|-------|-----------------|-------------|
| **Team Module** |
| View all members | ✅ Full | ✅ Full | ⚠️ Limited |
| Create members | ✅ | ❌ | ❌ |
| Edit members | ✅ | ❌ | ❌ |
| Delete members | ✅ | ❌ | ❌ |
| View performance | ✅ | ✅ | ❌ |
| Import/Export | ✅ | ❌ | ❌ |
| **Project Module** |
| View all projects | ✅ | ✅ | ⚠️ Own only |
| Create projects | ✅ | ✅ | ❌ |
| Edit projects | ✅ | ✅ | ❌ |
| Delete projects | ✅ | ❌ | ❌ |
| Archive/Unarchive | ✅ | ✅ | ❌ |
| Clone projects | ✅ | ✅ | ❌ |
| Milestones | ✅ | ✅ | ❌ |
| Cost tracking | ✅ | ✅ | ❌ |
| Attachments | ✅ | ✅ | ❌ |
| Upload avatar | ✅ | ✅ | ❌ |
| Assign members | ✅ | ✅ | ❌ |
| **Task Module** |
| View all tasks | ✅ | ✅ | ⚠️ Own only |
| Create tasks | ✅ | ✅ | ❌ |
| Edit tasks | ✅ | ✅ | ⚠️ Own only |
| Delete tasks | ✅ | ✅ | ❌ |
| Assign tasks | ✅ | ✅ | ❌ |
| Change status | ✅ | ✅ | ⚠️ Own only |
| Change priority | ✅ | ✅ | ❌ |
| Add comments | ✅ | ✅ | ⚠️ Own only |
| Delete comments | ✅ | ✅ | ⚠️ Own only |
| Attachments | ✅ | ✅ | ⚠️ Own only |
| **Dashboard** |
| All statistics | ✅ | ✅ | ⚠️ Personal |
| Team utilization | ✅ | ✅ | ❌ |
| Project health | ✅ | ✅ | ❌ |
| Burndown charts | ✅ | ✅ | ❌ |

---

## API Endpoint Protection

### Team Routes
- `GET /api/users` - All authenticated users (with role-based filtering)
- `POST /api/users` - Admin only
- `PUT /api/users/:id` - Admin only
- `DELETE /api/users/:id` - Admin only
- `GET /api/users/:id/performance` - All authenticated users
- `POST /api/users/import` - Admin only
- `GET /api/users/export` - Admin only

### Project Routes
- `GET /api/projects` - All authenticated users (filtered by role)
- `POST /api/projects` - Admin, ProjectManager
- `GET /api/projects/:id` - All authenticated users (if member)
- `PUT /api/projects/:id` - Admin, ProjectManager
- `DELETE /api/projects/:id` - Admin only
- `POST /api/projects/:id/avatar` - Admin, ProjectManager
- `POST /api/projects/:id/clone` - Admin, ProjectManager
- `PUT /api/projects/:id/archive` - Admin, ProjectManager
- Milestone routes - Admin, ProjectManager
- Cost routes - Admin, ProjectManager
- Attachment routes - Admin, ProjectManager

### Task Routes
- `GET /api/tasks` - All authenticated users (filtered by role)
- `POST /api/tasks` - Admin, ProjectManager
- `GET /api/tasks/:id` - All authenticated users (if assigned)
- `PUT /api/tasks/:id` - Admin, ProjectManager, TeamMember (own only)
- `DELETE /api/tasks/:id` - Admin, ProjectManager
- `POST /api/tasks/:id/comments` - All authenticated users (if assigned)
- `DELETE /api/tasks/:id/comments/:commentId` - All authenticated users (own comment)
- Attachment routes - Admin, ProjectManager, TeamMember (own only)

### Dashboard Routes
- `GET /api/dashboard/stats` - All authenticated users (filtered by role)
- `GET /api/dashboard/team-utilization` - Admin, ProjectManager only

---

## Security Notes

1. **Authentication Required**: All routes require valid JWT token
2. **Role-Based Filtering**: Data returned is automatically filtered based on user role
3. **Ownership Validation**: Team Members can only access their own data
4. **Admin Override**: Admin has access to all features
5. **Project Manager Scope**: PMs can manage projects and tasks but not users
6. **Team Member Limitation**: Team Members have read-only access except for their own tasks

---

## Implementation Details

### Middleware Used
- `protect` - Verifies JWT token and authenticates user
- `authorize('Admin', 'ProjectManager')` - Checks if user has required role
- Role-based filtering in controllers - Filters data based on user role

### Database Level
- User role stored in `User.role` field
- Project members stored in `Project.members` array
- Task assignment stored in `Task.assignedTo` field
- All queries include role-based filtering

---

*This document reflects the current implementation as of the SMART IT 2026 Internship Project.*
