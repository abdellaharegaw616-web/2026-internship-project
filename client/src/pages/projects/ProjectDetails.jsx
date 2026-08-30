import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import projectService from '../../services/projectService';
import taskService from '../../services/taskService';
import userService from '../../services/userService';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import TaskForm from '../../components/task/TaskForm';
import TaskCard from '../../components/task/TaskCard';
import TaskComment from '../../components/task/TaskComment';
import { getProjectStatusClass, formatDate, getDaysRemaining, getInitials, getAvatarColor } from '../../utils/helpers';
import { ArrowLeft, Plus, Users, Calendar, TrendingUp, Edit, Trash2 } from 'lucide-react';

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchProjectData();
  }, [id]);

  const fetchProjectData = async () => {
    try {
      setLoading(true);
      const [projectData, tasksData, usersData, statsData] = await Promise.all([
        projectService.getProjectById(id),
        projectService.getProjectTasks(id),
        userService.getAllUsers(),
        projectService.getProjectStats(id),
      ]);
      setProject(projectData);
      setTasks(tasksData);
      setUsers(usersData);
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching project data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = () => {
    setSelectedTask(null);
    setIsTaskModalOpen(true);
  };

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setIsTaskModalOpen(true);
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskService.deleteTask(taskId);
        fetchProjectData();
      } catch (error) {
        console.error('Error deleting task:', error);
        alert('Failed to delete task');
      }
    }
  };

  const handleTaskSaved = () => {
    fetchProjectData();
    setIsTaskModalOpen(false);
    setSelectedTask(null);
  };

  const handleAddComment = async (taskId, text) => {
    try {
      await taskService.addComment(taskId, { text });
      fetchProjectData();
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleDeleteComment = async (taskId, commentId) => {
    try {
      await taskService.deleteComment(taskId, commentId);
      fetchProjectData();
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Project not found</p>
        <button onClick={() => navigate('/projects')} className="mt-4 text-blue-600 hover:underline">
          Go back to projects
        </button>
      </div>
    );
  }

  const daysRemaining = getDaysRemaining(project.endDate);
  const isOverdue = daysRemaining !== null && daysRemaining < 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/projects')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Projects
        </button>
        {(currentUser?.role === 'Admin' || currentUser?.role === 'ProjectManager') && (
          <div className="flex gap-2">
            <Button onClick={() => navigate(`/projects/${project._id}/edit`)} variant="secondary">
              <Edit size={16} className="mr-2" />
              Edit
            </Button>
            <Button onClick={() => handleDeleteProject(project._id)} variant="danger">
              <Trash2 size={16} className="mr-2" />
              Delete
            </Button>
          </div>
        )}
      </div>

      {/* Project Info */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
            <p className="text-gray-600 mt-1">{project.description}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getProjectStatusClass(project.status)}`}>
            {project.status}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="flex items-center gap-2 text-gray-600">
            <Users size={18} />
            <span>{project.members?.length || 0} Members</span>
          </div>
          <div className={`flex items-center gap-2 ${isOverdue ? 'text-red-600' : 'text-gray-600'}`}>
            <Calendar size={18} />
            <span>{formatDate(project.endDate)}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <TrendingUp size={18} />
            <span>{project.progress || 0}% Complete</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <span className={`text-sm ${isOverdue ? 'text-red-600' : daysRemaining <= 7 ? 'text-orange-600' : ''}`}>
              {isOverdue ? `Overdue by ${Math.abs(daysRemaining)} days` : daysRemaining === 0 ? 'Due today' : `${daysRemaining} days remaining`}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">Progress</span>
            <span className="font-medium text-gray-900">{project.progress || 0}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${project.progress || 0}%` }}
            />
          </div>
        </div>

        {/* Members */}
        {project.members && project.members.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-100">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Team Members</h3>
            <div className="flex -space-x-2">
              {project.members.slice(0, 5).map((member) => (
                <div
                  key={member._id}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold border-2 border-white ${getAvatarColor(member.name)}`}
                  title={member.name}
                >
                  {member.avatar ? (
                    <img src={member.avatar} alt={member.name} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    getInitials(member.name)
                  )}
                </div>
              ))}
              {project.members.length > 5 && (
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-sm font-medium border-2 border-white">
                  +{project.members.length - 5}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-600">Total Tasks</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-600">Completed</p>
            <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-600">In Progress</p>
            <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-600">Overdue</p>
            <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'overview'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('members')}
            className={`px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'members'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Members
          </button>
          <button
            onClick={() => setActiveTab('tasks')}
            className={`px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'tasks'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Tasks
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'activity'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Activity
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Overview</h3>
              <p className="text-gray-600">{project.description}</p>
            </div>
          )}

          {activeTab === 'members' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Members</h3>
              {project.members && project.members.length > 0 ? (
                <div className="space-y-3">
                  {project.members.map((member) => (
                    <div key={member._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        {member.avatar ? (
                          <img src={member.avatar} alt={member.name} className="w-10 h-10 rounded-full object-cover" />
                        ) : (
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold ${getAvatarColor(member.name)}`}>
                            {getInitials(member.name)}
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900">{member.name}</p>
                          <p className="text-sm text-gray-500">{member.role === 'ProjectManager' ? 'Project Manager' : member.role}</p>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">{member.department || 'No department'}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No members assigned to this project</p>
              )}
            </div>
          )}

          {activeTab === 'tasks' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Tasks</h3>
                {(currentUser?.role === 'Admin' || currentUser?.role === 'ProjectManager') && (
                  <Button onClick={handleAddTask} size="sm">
                    <Plus size={16} className="mr-2" />
                    Add Task
                  </Button>
                )}
              </div>

              {tasks.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No tasks yet</p>
              ) : (
                <div className="space-y-3">
                  {tasks.map((task) => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      onEdit={handleEditTask}
                      onDelete={handleDeleteTask}
                      onClick={() => navigate(`/tasks/${task._id}`)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'activity' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Log</h3>
              {project.activities && project.activities.length > 0 ? (
                <div className="space-y-3">
                  {project.activities.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 mt-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">{activity.action}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {activity.user?.name || 'Unknown'} • {formatDate(activity.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No activity recorded yet</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Task Modal */}
      <Modal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setSelectedTask(null);
        }}
        title={selectedTask ? 'Edit Task' : 'Create Task'}
        size="lg"
      >
        <TaskForm
          task={selectedTask}
          projects={[project]}
          users={users}
          onSubmit={handleTaskSaved}
          onCancel={() => {
            setIsTaskModalOpen(false);
            setSelectedTask(null);
          }}
        />
      </Modal>
    </div>
  );
};

export default ProjectDetails;
