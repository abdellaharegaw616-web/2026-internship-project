import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import projectService from '../../services/projectService';
import taskService from '../../services/taskService';
import userService from '../../services/userService';
import StatCard from '../../components/dashboard/StatCard';
import TaskChart from '../../components/dashboard/TaskChart';
import ProjectChart from '../../components/dashboard/ProjectChart';
import { getInitials, getAvatarColor, formatDate, getDaysRemaining } from '../../utils/helpers';
import { FolderKanban, CheckSquare, Users, TrendingUp, Calendar, AlertCircle } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recentProjects, setRecentProjects] = useState([]);
  const [recentTasks, setRecentTasks] = useState([]);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [taskStats, projects, tasks, users] = await Promise.all([
        taskService.getTaskStats(),
        projectService.getAllProjects(),
        taskService.getAllTasks(),
        userService.getAllUsers(),
      ]);

      setStats({
        totalProjects: projects.length,
        activeProjects: projects.filter(p => p.status === 'Active').length,
        totalTasks: tasks.length,
        completedTasks: tasks.filter(t => t.status === 'Done').length,
        totalUsers: users.length,
        taskStats,
      });

      setRecentProjects(projects.slice(0, 6));
      setRecentTasks(tasks.slice(0, 5));

      // Get upcoming deadlines (tasks due in next 7 days)
      const now = new Date();
      const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      const upcoming = tasks
        .filter(t => {
          if (!t.dueDate || t.status === 'Done') return false;
          const dueDate = new Date(t.dueDate);
          return dueDate >= now && dueDate <= weekFromNow;
        })
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
        .slice(0, 5);

      setUpcomingDeadlines(upcoming);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const taskChartData = stats?.taskStats ? [
    { label: 'Todo', value: stats.taskStats.byStatus.Todo || 0 },
    { label: 'In Progress', value: stats.taskStats.byStatus['In Progress'] || 0 },
    { label: 'Review', value: stats.taskStats.byStatus.Review || 0 },
    { label: 'Done', value: stats.taskStats.byStatus.Done || 0 },
  ] : [];

  const projectChartData = recentProjects.map(project => ({
    id: project._id,
    name: project.name,
    progress: project.progress || 0,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.name}!</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Projects"
          value={stats?.totalProjects || 0}
          icon={FolderKanban}
          color="blue"
          trend={{ positive: true, value: 12 }}
          onClick={() => navigate('/projects')}
        />
        <StatCard
          title="Active Projects"
          value={stats?.activeProjects || 0}
          icon={TrendingUp}
          color="green"
          trend={{ positive: true, value: 8 }}
          onClick={() => navigate('/projects')}
        />
        <StatCard
          title="Total Tasks"
          value={stats?.totalTasks || 0}
          icon={CheckSquare}
          color="purple"
          trend={{ positive: true, value: 15 }}
          onClick={() => navigate('/tasks')}
        />
        <StatCard
          title="Completed Tasks"
          value={stats?.completedTasks || 0}
          icon={Users}
          color="orange"
          trend={{ positive: true, value: 20 }}
          onClick={() => navigate('/tasks')}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TaskChart data={taskChartData} />
        <ProjectChart data={projectChartData} />
      </div>

      {/* Recent Projects & Upcoming Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Projects</h2>
            <button
              onClick={() => navigate('/projects')}
              className="text-blue-600 hover:underline text-sm"
            >
              View All
            </button>
          </div>
          {recentProjects.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No projects yet</p>
          ) : (
            <div className="space-y-3">
              {recentProjects.map((project) => {
                const daysRemaining = getDaysRemaining(project.endDate);
                const isOverdue = daysRemaining !== null && daysRemaining < 0;
                
                return (
                  <div
                    key={project._id}
                    onClick={() => navigate(`/projects/${project._id}`)}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{project.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-24 bg-gray-200 rounded-full h-1.5">
                          <div
                            className="bg-blue-600 h-1.5 rounded-full"
                            style={{ width: `${project.progress || 0}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-600">{project.progress || 0}%</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs ${isOverdue ? 'text-red-600' : 'text-gray-500'}`}>
                        {formatDate(project.endDate)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Upcoming Deadlines */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Upcoming Deadlines</h2>
            <button
              onClick={() => navigate('/tasks')}
              className="text-blue-600 hover:underline text-sm"
            >
              View All
            </button>
          </div>
          {upcomingDeadlines.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No upcoming deadlines</p>
          ) : (
            <div className="space-y-3">
              {upcomingDeadlines.map((task) => {
                const daysRemaining = getDaysRemaining(task.dueDate);
                
                return (
                  <div
                    key={task._id}
                    onClick={() => navigate(`/tasks/${task._id}`)}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <Calendar size={16} className="text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">{task.title}</p>
                        <p className="text-xs text-gray-500">{task.project?.name || 'No project'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs font-medium ${
                        daysRemaining === 0 ? 'text-red-600' :
                        daysRemaining <= 2 ? 'text-orange-600' :
                        'text-gray-600'
                      }`}>
                        {daysRemaining === 0 ? 'Due today' :
                         daysRemaining === 1 ? 'Tomorrow' :
                         `${daysRemaining} days`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Recent Tasks */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Tasks</h2>
          <button
            onClick={() => navigate('/tasks')}
            className="text-blue-600 hover:underline text-sm"
          >
            View All
          </button>
        </div>
        {recentTasks.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No tasks yet</p>
        ) : (
          <div className="space-y-3">
            {recentTasks.map((task) => (
              <div
                key={task._id}
                onClick={() => navigate(`/tasks/${task._id}`)}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  {task.assignedTo?.avatar ? (
                    <img src={task.assignedTo.avatar} alt={task.assignedTo.name} className="w-8 h-8 rounded-full object-cover" />
                  ) : (
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold ${getAvatarColor(task.assignedTo?.name)}`}>
                      {getInitials(task.assignedTo?.name)}
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-gray-900">{task.title}</p>
                    <p className="text-xs text-gray-500">{task.project?.name || 'No project'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500">{formatDate(task.dueDate)}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    task.status === 'Done' ? 'bg-green-100 text-green-800' :
                    task.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                    task.status === 'Review' ? 'bg-purple-100 text-purple-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {task.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
