import { useEffect, useState } from 'react';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, LineChart, Line
} from 'recharts';
import {
  FolderKanban, CheckSquare, Users, TrendingUp,
  Clock, AlertTriangle, Activity, Download, HeartPulse, BarChart3
} from 'lucide-react';
import Header from '../components/layout/Header';
import api from '../api/axios';
import { timeAgo, formatDate } from '../utils/helpers';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const TASK_STATUS_COLORS = {
  'Todo': '#94A3B8',
  'In Progress': '#2563EB',
  'Review': '#7C3AED',
  'Done': '#22C55E',
};
const PROJECT_STATUS_COLORS = {
  'Planning': '#3B82F6',
  'Active': '#22C55E',
  'On Hold': '#F59E0B',
  'Completed': '#64748B',
};
const HEALTH_STYLES = {
  Healthy: 'bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 border-green-100 dark:border-green-900/50',
  'At Risk': 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border-amber-100 dark:border-amber-900/50',
  Critical: 'bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 border-red-100 dark:border-red-900/50',
};
const WORKLOAD_STYLES = {
  Low: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300',
  Medium: 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400',
  High: 'bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-400',
};

function getGreeting(name) {
  const hour = new Date().getHours();
  const firstName = name?.split(' ')[0] || 'there';
  if (hour < 12) return `Good morning, ${firstName}! ☀️`;
  if (hour < 17) return `Good afternoon, ${firstName}! 👋`;
  return `Good evening, ${firstName}! 🌙`;
}

const StatCard = ({ icon: Icon, label, value, gradient, sub }) => (
  <div className={`rounded-2xl p-6 text-white card-hover ${gradient}`}>
    <div className="flex items-start justify-between">
      <div>
        <p className="text-white/80 text-sm font-medium">{label}</p>
        <p className="text-4xl font-bold mt-1" style={{ fontFamily: 'Poppins, sans-serif' }}>{value}</p>
        {sub && <p className="text-white/70 text-xs mt-2">{sub}</p>}
      </div>
      <div className="bg-white/20 rounded-xl p-3">
        <Icon size={22} className="text-white" />
      </div>
    </div>
  </div>
);

function SkeletonCard() {
  return (
    <div className="rounded-2xl p-6 bg-slate-100 dark:bg-slate-800/50 animate-pulse">
      <div className="flex justify-between">
        <div className="space-y-2">
          <div className="h-3 w-24 bg-slate-200 dark:bg-slate-700 rounded" />
          <div className="h-8 w-16 bg-slate-200 dark:bg-slate-700 rounded" />
        </div>
        <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-xl" />
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { darkMode } = useTheme();
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [utilization, setUtilization] = useState(null);
  const [loading, setLoading] = useState(true);

  const gridColor = darkMode ? '#334155' : '#f1f5f9';
  const tickColor = darkMode ? '#64748B' : '#94A3B8';

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [{ data: dashboardData }, utilizationResult] = await Promise.all([
          api.get('/dashboard'),
          api.get('/dashboard/team-utilization').catch(() => null),
        ]);
        setData(dashboardData);
        if (utilizationResult?.data) setUtilization(utilizationResult.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, []);

  const handleExportReport = () => {
    const stats = data?.stats || {};
    const projectHealth = data?.projectHealth || [];
    const teamUtilization = utilization?.utilization || [];
    const burndownData = data?.burndown || [];

    const lines = [
      ['Task Flow Dashboard Report'],
      ['Generated', new Date().toLocaleString()],
      [],
      ['Summary'],
      ['Total Projects', stats.totalProjects ?? 0],
      ['Total Tasks', stats.totalTasks ?? 0],
      ['Completed Tasks', stats.completedTasks ?? 0],
      ['Overdue Tasks', stats.overdueTasks ?? 0],
      ['Team Members', stats.totalTeamMembers ?? 0],
      [],
      ['Project Health'],
      ['Project', 'Health', 'Progress', 'Overdue Tasks', 'Budget Usage'],
      ...projectHealth.map(p => [p.title, p.health, `${p.progress}%`, p.overdueTasks, `${p.budgetUsage}%`]),
      [],
      ['Team Utilization'],
      ['Member', 'Workload', 'Total Tasks', 'Completion Rate', 'Overdue Tasks'],
      ...teamUtilization.map(m => [m.name, m.workload, m.totalTasks, `${m.completionRate}%`, m.overdueTasks]),
      [],
      ['Burndown'],
      ['Date', 'Open Tasks'],
      ...burndownData.map(p => [p.date, p.openTasks]),
    ];
    const csv = lines.map(row => row.map(v => `"${String(v ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `taskflow-dashboard-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="page-enter">
        <Header title="Dashboard" subtitle="Overview of your workspace" />
        <div className="p-8 space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {[1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-72 bg-slate-100 dark:bg-slate-800/50 rounded-2xl animate-pulse" />
            <div className="h-72 bg-slate-100 dark:bg-slate-800/50 rounded-2xl animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  const tasksPieData = (data?.tasksByStatus || []).map(({ _id, count }) => ({ name: _id, value: count }));
  const projectsBarData = (data?.projectsByStatus || []).map(({ _id, count }) => ({ name: _id, count }));
  const stats = data?.stats || {};
  const projectHealth = data?.projectHealth || [];
  const teamUtilization = utilization?.utilization || [];
  const burndownData = (data?.burndown || []).map(item => ({
    ...item,
    label: new Date(`${item.date}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  }));
  const highRiskProjects = projectHealth.filter(p => p.health !== 'Healthy').length;

  const cardBg = 'bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm';

  return (
    <div className="page-enter">
      <Header title="Dashboard" subtitle={getGreeting(user?.name)} />
      <div className="p-4 md:p-8 space-y-6 md:space-y-8">
        {/* Top bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">Workspace Intelligence</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Health, workload, and delivery signals from live project data.</p>
          </div>
          <button
            onClick={handleExportReport}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white rounded-xl bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            <Download size={16} /> Export Report
          </button>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          <StatCard icon={FolderKanban} label="Total Projects" value={stats.totalProjects ?? 0} gradient="stat-blue" sub="Across all teams" />
          <StatCard icon={CheckSquare} label="Total Tasks" value={stats.totalTasks ?? 0} gradient="stat-green" sub={`${stats.completedTasks ?? 0} completed`} />
          <StatCard icon={AlertTriangle} label="Overdue Tasks" value={stats.overdueTasks ?? 0} gradient="stat-orange" sub={`${highRiskProjects} project${highRiskProjects === 1 ? '' : 's'} need attention`} />
          <StatCard icon={Users} label="Team Members" value={stats.totalTeamMembers ?? 0} gradient="stat-purple" sub="All roles" />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Donut Chart */}
          <div className={`rounded-2xl p-6 ${cardBg}`}>
            <div className="flex items-center gap-2 mb-6">
              <Activity size={18} className="text-blue-600" />
              <h3 className="font-semibold text-slate-800 dark:text-slate-100" style={{ fontFamily: 'Poppins, sans-serif' }}>Tasks by Status</h3>
            </div>
            {tasksPieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={tasksPieData} cx="50%" cy="50%" innerRadius={65} outerRadius={95} paddingAngle={3} dataKey="value">
                    {tasksPieData.map(({ name }) => (
                      <Cell key={name} fill={TASK_STATUS_COLORS[name] || '#94A3B8'} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val, name) => [val, name]} contentStyle={{ background: darkMode ? '#1E293B' : '#fff', border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`, borderRadius: 10, color: darkMode ? '#f1f5f9' : '#1e293b' }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-48 text-slate-400 dark:text-slate-500 text-sm">No task data yet</div>
            )}
          </div>

          {/* Bar Chart */}
          <div className={`rounded-2xl p-6 ${cardBg}`}>
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp size={18} className="text-blue-600" />
              <h3 className="font-semibold text-slate-800 dark:text-slate-100" style={{ fontFamily: 'Poppins, sans-serif' }}>Projects by Status</h3>
            </div>
            {projectsBarData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={projectsBarData} barSize={32}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: tickColor }} />
                  <YAxis tick={{ fontSize: 12, fill: tickColor }} allowDecimals={false} />
                  <Tooltip contentStyle={{ background: darkMode ? '#1E293B' : '#fff', border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`, borderRadius: 10, color: darkMode ? '#f1f5f9' : '#1e293b' }} />
                  <Bar dataKey="count" name="Projects" radius={[6, 6, 0, 0]}>
                    {projectsBarData.map(({ name }) => (
                      <Cell key={name} fill={PROJECT_STATUS_COLORS[name] || '#94A3B8'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-48 text-slate-400 dark:text-slate-500 text-sm">No project data yet</div>
            )}
          </div>
        </div>

        {/* Burndown + Health */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className={`xl:col-span-2 rounded-2xl p-6 ${cardBg}`}>
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 size={18} className="text-blue-600" />
              <h3 className="font-semibold text-slate-800 dark:text-slate-100" style={{ fontFamily: 'Poppins, sans-serif' }}>14-Day Burndown</h3>
            </div>
            {burndownData.length > 0 ? (
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={burndownData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                  <XAxis dataKey="label" tick={{ fontSize: 12, fill: tickColor }} />
                  <YAxis tick={{ fontSize: 12, fill: tickColor }} allowDecimals={false} />
                  <Tooltip contentStyle={{ background: darkMode ? '#1E293B' : '#fff', border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`, borderRadius: 10, color: darkMode ? '#f1f5f9' : '#1e293b' }} />
                  <Line type="monotone" dataKey="openTasks" name="Open Tasks" stroke="#2563EB" strokeWidth={3} dot={{ r: 3, fill: '#2563EB' }} activeDot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-48 text-slate-400 dark:text-slate-500 text-sm">No burndown data yet</div>
            )}
          </div>

          <div className={`rounded-2xl p-6 ${cardBg}`}>
            <div className="flex items-center gap-2 mb-5">
              <HeartPulse size={18} className="text-blue-600" />
              <h3 className="font-semibold text-slate-800 dark:text-slate-100" style={{ fontFamily: 'Poppins, sans-serif' }}>Project Health</h3>
            </div>
            <div className="space-y-3">
              {projectHealth.length === 0 ? (
                <div className="py-10 text-center text-slate-400 dark:text-slate-500 text-sm">No active projects to score</div>
              ) : projectHealth.map(project => (
                <div key={project._id} className="border border-slate-100 dark:border-slate-800 rounded-xl p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">{project.title}</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{project.totalTasks} tasks · {project.overdueTasks} overdue</p>
                    </div>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full border ${HEALTH_STYLES[project.health] || HEALTH_STYLES.Healthy}`}>
                      {project.health}
                    </span>
                  </div>
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                      <span>Progress</span>
                      <span>{project.progress}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600 rounded-full progress-bar" style={{ width: `${project.progress}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Team Utilization */}
        {teamUtilization.length > 0 && (
          <div className={`rounded-2xl overflow-hidden ${cardBg}`}>
            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Users size={18} className="text-blue-600" />
                <h3 className="font-semibold text-slate-800 dark:text-slate-100" style={{ fontFamily: 'Poppins, sans-serif' }}>Team Utilization</h3>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">{utilization.teamStats?.avgCompletionRate ?? 0}% avg completion</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-6">
              {teamUtilization.slice(0, 6).map(member => (
                <div key={member.userId} className="border border-slate-100 dark:border-slate-800 rounded-xl p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">{member.name}</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{member.role} · {member.totalTasks} tasks</p>
                    </div>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${WORKLOAD_STYLES[member.workload] || WORKLOAD_STYLES.Low}`}>
                      {member.workload}
                    </span>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                      <span>Completion</span>
                      <span>{member.completionRate}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full" style={{ width: `${member.completionRate}%` }} />
                    </div>
                    {member.overdueTasks > 0 && (
                      <p className="text-xs text-red-500 mt-2">{member.overdueTasks} overdue task{member.overdueTasks === 1 ? '' : 's'}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upcoming Tasks */}
        <div className={`rounded-2xl overflow-hidden ${cardBg}`}>
          <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Clock size={18} className="text-blue-600" />
              <h3 className="font-semibold text-slate-800 dark:text-slate-100" style={{ fontFamily: 'Poppins, sans-serif' }}>Upcoming Tasks</h3>
            </div>
          </div>
          <div className="divide-y divide-slate-50 dark:divide-slate-800">
            {(data?.upcomingTasks || []).length === 0 ? (
              <div className="p-8 text-center text-slate-400 dark:text-slate-500 text-sm">No upcoming tasks</div>
            ) : (
              data.upcomingTasks.map(task => (
                <div key={task._id} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                  <div className="w-9 h-9 rounded-xl bg-orange-100 dark:bg-orange-950/40 flex items-center justify-center flex-shrink-0">
                    <Clock size={16} className="text-orange-600 dark:text-orange-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate">{task.title}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                      {task.project?.title} · Due: {formatDate(task.dueDate)}
                    </p>
                  </div>
                  <span className={`badge ${
                    task.status === 'Done' ? 'badge-done' :
                    task.status === 'In Progress' ? 'badge-inprogress' :
                    task.status === 'Review' ? 'badge-review' : 'badge-todo'
                  }`}>{task.status}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className={`rounded-2xl overflow-hidden ${cardBg}`}>
          <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Activity size={18} className="text-blue-600" />
              <h3 className="font-semibold text-slate-800 dark:text-slate-100" style={{ fontFamily: 'Poppins, sans-serif' }}>Recent Activities</h3>
            </div>
          </div>
          <div className="divide-y divide-slate-50 dark:divide-slate-800">
            {(data?.recentTasks || []).length === 0 ? (
              <div className="p-8 text-center text-slate-400 dark:text-slate-500 text-sm">No recent activity</div>
            ) : (
              data.recentTasks.map(task => (
                <div key={task._id} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                  <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950/40 flex items-center justify-center flex-shrink-0">
                    <CheckSquare size={16} className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate">{task.title}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                      {task.project?.title} · {timeAgo(task.updatedAt)}
                    </p>
                  </div>
                  <span className={`badge ${
                    task.status === 'Done' ? 'badge-done' :
                    task.status === 'In Progress' ? 'badge-inprogress' :
                    task.status === 'Review' ? 'badge-review' : 'badge-todo'
                  }`}>{task.status}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
