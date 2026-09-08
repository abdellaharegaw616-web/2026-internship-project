import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, CheckSquare, Clock, Target, Users, Activity, Pencil, Trash2, X, Save,
  Flag, DollarSign, Paperclip, GanttChart, Copy, Archive, ArchiveRestore, Plus, Upload, Download
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import Header from '../components/layout/Header';
import ProjectGantt from '../components/project/ProjectGantt';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import {
  getProjectStatusClass, getPriorityClass, getTaskStatusClass,
  formatDate, getDaysRemaining, getInitials, getAvatarColor, timeAgo,
  formatCurrency, formatFileSize
} from '../utils/helpers';
import Avatar from '../components/common/Avatar';
import toast from 'react-hot-toast';

function CircleProgress({ value }) {
  const r = 42, c = 2 * Math.PI * r;
  return (
    <div className="relative w-28 h-28 flex items-center justify-center">
      <svg width="112" height="112" className="-rotate-90">
        <circle cx="56" cy="56" r={r} fill="none" stroke="#DBEAFE" strokeWidth="8" />
        <circle cx="56" cy="56" r={r} fill="none" stroke="#2563EB" strokeWidth="8"
          strokeDasharray={c} strokeDashoffset={c - (value / 100) * c}
          strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s ease' }} />
      </svg>
      <span className="absolute text-2xl font-bold text-blue-600" style={{ fontFamily: 'Poppins, sans-serif' }}>{value}%</span>
    </div>
  );
}

const STATUS_COLORS = { 'Todo': '#94A3B8', 'In Progress': '#2563EB', 'Review': '#7C3AED', 'Done': '#22C55E' };
const TABS = [
  { id: 'overview', label: 'Overview', icon: Target },
  { id: 'timeline', label: 'Timeline', icon: GanttChart },
  { id: 'milestones', label: 'Milestones', icon: Flag },
  { id: 'budget', label: 'Budget', icon: DollarSign },
  { id: 'files', label: 'Files', icon: Paperclip },
];

export default function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { canManage, isAdmin, user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [activeTab, setActiveTab] = useState('overview');
  const [newMilestone, setNewMilestone] = useState({ title: '', dueDate: '' });
  const [costForm, setCostForm] = useState({ description: '', amount: '', category: 'General' });
  const fileInputRef = useRef(null);

  const fetchProject = () => {
    api.get(`/projects/${id}`)
      .then(({ data: res }) => {
        setData(res);
        setEditForm({
          title: res.project.title,
          description: res.project.description,
          status: res.project.status,
          priority: res.project.priority,
          estimatedBudget: res.project.estimatedBudget || 0,
        });
      })
      .catch(() => toast.error('Failed to load project'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProject(); }, [id]);

  const handleUpdate = async () => {
    try {
      const { data: res } = await api.put(`/projects/${id}`, editForm);
      setData(prev => ({
        ...prev,
        project: res.project
      }));
      setEditing(false);
      toast.success('Project updated!');
    } catch { toast.error('Update failed'); }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this project and all its tasks?')) return;
    try {
      await api.delete(`/projects/${id}`);
      navigate('/projects');
      toast.success('Project deleted');
    } catch { toast.error('Delete failed'); }
  };

  const handleClone = async () => {
    try {
      const { data: res } = await api.post(`/projects/${id}/clone`);
      toast.success('Project cloned!');
      navigate(`/projects/${res.project._id}`);
    } catch { toast.error('Clone failed'); }
  };

  const handleArchive = async () => {
    try {
      if (data.project.isArchived) {
        await api.put(`/projects/${id}/unarchive`);
        toast.success('Project restored');
        setData(prev => ({ ...prev, project: { ...prev.project, isArchived: false } }));
      } else {
        await api.put(`/projects/${id}/archive`);
        toast.success('Project archived');
        setData(prev => ({ ...prev, project: { ...prev.project, isArchived: true } }));
      }
    } catch { toast.error('Archive action failed'); }
  };

  const handleAddMilestone = async (e) => {
    e.preventDefault();
    if (!newMilestone.title) return;
    try {
      const { data: res } = await api.post(`/projects/${id}/milestones`, newMilestone);
      setNewMilestone({ title: '', dueDate: '' });
      setData(prev => ({ ...prev, project: res.project }));
      toast.success('Milestone added');
    } catch { toast.error('Failed to add milestone'); }
  };

  const toggleMilestone = async (milestoneId, completed) => {
    try {
      await api.put(`/projects/${id}/milestones/${milestoneId}`, { completed: !completed });
      setData(prev => ({
        ...prev,
        project: {
          ...prev.project,
          milestones: prev.project.milestones.map(m => m._id === milestoneId ? { ...m, completed: !completed } : m)
        }
      }));
    } catch { toast.error('Failed to update milestone'); }
  };

  const deleteMilestone = async (milestoneId) => {
    try {
      await api.delete(`/projects/${id}/milestones/${milestoneId}`);
      setData(prev => ({
        ...prev,
        project: {
          ...prev.project,
          milestones: prev.project.milestones.filter(m => m._id !== milestoneId)
        }
      }));
      toast.success('Milestone removed');
    } catch { toast.error('Failed to delete milestone'); }
  };

  const handleAddCost = async (e) => {
    e.preventDefault();
    if (!costForm.description || !costForm.amount) return;
    try {
      const { data: res } = await api.post(`/projects/${id}/costs`, { ...costForm, amount: parseFloat(costForm.amount) });
      setCostForm({ description: '', amount: '', category: 'General' });
      setData(prev => ({ ...prev, project: res.project }));
      toast.success('Cost entry added');
    } catch { toast.error('Failed to add cost'); }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      const { data: res } = await api.post(`/projects/${id}/attachments`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setData(prev => ({ ...prev, project: res.project }));
      toast.success('File uploaded');
    } catch { toast.error('Upload failed'); }
    e.target.value = '';
  };

  const handleDeleteAttachment = async (attachmentId) => {
    try {
      await api.delete(`/projects/${id}/attachments/${attachmentId}`);
      setData(prev => ({
        ...prev,
        project: {
          ...prev.project,
          attachments: prev.project.attachments.filter(a => a._id !== attachmentId)
        }
      }));
      toast.success('File removed');
    } catch { toast.error('Delete failed'); }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
    </div>
  );

  if (!data) return <div className="p-8 text-center text-slate-500">Project not found</div>;

  const { project, tasks, tasksByStatus } = data;
  const chartData = Object.entries(tasksByStatus).map(([name, count]) => ({ name, count }));
  const days = getDaysRemaining(project.endDate);
  const budgetUsedPct = project.estimatedBudget > 0
    ? Math.min(100, Math.round((project.actualCost / project.estimatedBudget) * 100))
    : 0;

  return (
    <div className="page-enter">
      <Header title={project.title} subtitle="Project details and task overview" />
      <div className="p-4 md:p-8 space-y-6">
        <button onClick={() => navigate('/projects')}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800">
          <ArrowLeft size={16} /> Back to Projects
        </button>

        {/* Header card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          {editing ? (
            <div className="space-y-4">
              <input value={editForm.title} onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                className="w-full text-xl font-bold border-b border-slate-200 py-1 focus:border-blue-500 outline-none" />
              <textarea value={editForm.description} onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                className="w-full text-sm text-slate-600 border border-slate-200 rounded-xl p-3 resize-none" rows={2} />
              <div className="flex flex-wrap gap-3">
                <select value={editForm.status} onChange={e => setEditForm({ ...editForm, status: e.target.value })}
                  className="px-3 py-2 border border-slate-200 rounded-xl text-sm">
                  {['Planning', 'Active', 'On Hold', 'Completed'].map(s => <option key={s}>{s}</option>)}
                </select>
                <select value={editForm.priority} onChange={e => setEditForm({ ...editForm, priority: e.target.value })}
                  className="px-3 py-2 border border-slate-200 rounded-xl text-sm">
                  {['Low', 'Medium', 'High', 'Critical'].map(p => <option key={p}>{p}</option>)}
                </select>
                <input type="number" placeholder="Estimated Budget" value={editForm.estimatedBudget}
                  onChange={e => setEditForm({ ...editForm, estimatedBudget: e.target.value })}
                  className="px-3 py-2 border border-slate-200 rounded-xl text-sm w-40" />
                <button onClick={handleUpdate} className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium">
                  <Save size={14} /> Save
                </button>
                <button onClick={() => setEditing(false)} className="p-2 text-slate-500 hover:bg-slate-100 rounded-xl">
                  <X size={16} />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold text-slate-800" style={{ fontFamily: 'Poppins, sans-serif' }}>{project.title}</h2>
                  <span className={getProjectStatusClass(project.status)}>{project.status}</span>
                  <span className={getPriorityClass(project.priority)}>{project.priority}</span>
                  {project.isArchived && <span className="badge badge-onhold">Archived</span>}
                  {days !== null && (
                    <span className={`badge ${days < 0 ? 'badge-urgent' : days <= 7 ? 'badge-high' : 'badge-medium'}`}>
                      {days < 0 ? `${Math.abs(days)}d overdue` : `${days}d left`}
                    </span>
                  )}
                </div>
                <p className="text-slate-500 text-sm">{project.description}</p>
                <div className="flex gap-4 mt-3 text-xs text-slate-400">
                  <span>Start: {formatDate(project.startDate)}</span>
                  <span>End: {formatDate(project.endDate)}</span>
                  <span>Budget: {formatCurrency(project.estimatedBudget)}</span>
                </div>
              </div>
              {canManage && (
                <div className="flex gap-2">
                  <button onClick={handleClone} title="Clone project"
                    className="p-2.5 hover:bg-blue-50 text-slate-500 hover:text-blue-600 rounded-xl transition-colors">
                    <Copy size={16} />
                  </button>
                  <button onClick={handleArchive} title={project.isArchived ? 'Restore' : 'Archive'}
                    className="p-2.5 hover:bg-amber-50 text-slate-500 hover:text-amber-600 rounded-xl transition-colors">
                    {project.isArchived ? <ArchiveRestore size={16} /> : <Archive size={16} />}
                  </button>
                  <button onClick={() => setEditing(true)}
                    className="p-2.5 hover:bg-slate-100 text-slate-500 rounded-xl transition-colors">
                    <Pencil size={16} />
                  </button>
                  {isAdmin && (
                    <button onClick={handleDelete}
                      className="p-2.5 hover:bg-red-50 text-slate-500 hover:text-red-600 rounded-xl transition-colors">
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit overflow-x-auto">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === id ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}>
              <Icon size={15} /> {label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === 'overview' && (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                { label: 'Total Tasks', value: tasks.length, icon: Target, color: 'text-blue-600 bg-blue-50' },
                { label: 'Completed', value: tasksByStatus['Done'] || 0, icon: CheckSquare, color: 'text-green-600 bg-green-50' },
                { label: 'Pending', value: tasks.length - (tasksByStatus['Done'] || 0), icon: Clock, color: 'text-orange-600 bg-orange-50' },
                { label: 'Milestones', value: `${(project.milestones || []).filter(m => m.completed).length}/${(project.milestones || []).length}`, icon: Flag, color: 'text-purple-600 bg-purple-50' },
              ].map(({ label, value, icon: Icon, color }) => (
                <div key={label} className="bg-white rounded-2xl border border-slate-100 p-5 card-hover">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
                    <Icon size={18} />
                  </div>
                  <p className="text-2xl font-bold text-slate-800" style={{ fontFamily: 'Poppins, sans-serif' }}>{value}</p>
                  <p className="text-xs text-slate-500 mt-1">{label}</p>
                </div>
              ))}
              <div className="bg-white rounded-2xl border border-slate-100 p-5 card-hover flex flex-col items-center justify-center col-span-2 lg:col-span-1">
                <CircleProgress value={project.progress || 0} />
                <p className="text-xs text-slate-500 mt-2">Overall Progress</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-100 p-5">
                <h3 className="font-semibold text-slate-800 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>Tasks by Status</h3>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={chartData} barSize={28}>
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                    <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                      {chartData.map(({ name }) => <Cell key={name} fill={STATUS_COLORS[name] || '#94a3b8'} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Users size={16} className="text-blue-600" />
                  <h3 className="font-semibold text-slate-800" style={{ fontFamily: 'Poppins, sans-serif' }}>Team Members</h3>
                </div>
                <div className="space-y-3">
                  {(project.members || []).length === 0 ? (
                    <p className="text-sm text-slate-400">No team members assigned</p>
                  ) : project.members.map(m => (
                    <div key={m._id} className="flex items-center gap-3">
                      <Avatar user={m} className="w-8 h-8 text-xs" />
                      <div>
                        <p className="text-sm font-medium text-slate-700">{m.name}</p>
                        <p className="text-xs text-slate-400">{m.role === 'ProjectManager' ? 'Project Manager' : m.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Activity size={16} className="text-blue-600" />
                  <h3 className="font-semibold text-slate-800" style={{ fontFamily: 'Poppins, sans-serif' }}>Activity</h3>
                </div>
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {(project.activities || []).slice(0, 8).map((act, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-slate-700">{act.action}</p>
                        <p className="text-xs text-slate-400">{timeAgo(act.createdAt)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100">
                <h3 className="font-semibold text-slate-800" style={{ fontFamily: 'Poppins, sans-serif' }}>Project Tasks</h3>
              </div>
              <div className="divide-y divide-slate-50">
                {tasks.length === 0 ? (
                  <div className="p-8 text-center text-sm text-slate-400">No tasks yet</div>
                ) : tasks.map(t => (
                  <div key={t._id} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">{t.title}</p>
                      {t.assignedTo && (
                        <div className="flex items-center gap-1.5 mt-1">
                          <Avatar user={t.assignedTo} className="w-4 h-4 text-[8px]" />
                          <span className="text-xs text-slate-400">{t.assignedTo?.name}</span>
                        </div>
                      )}
                    </div>
                    <span className={getPriorityClass(t.priority)}>{t.priority}</span>
                    <span className={getTaskStatusClass(t.status)}>{t.status}</span>
                    <span className="text-xs text-slate-400">{formatDate(t.dueDate)}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === 'timeline' && (
          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <h3 className="font-semibold text-slate-800 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>Project Timeline</h3>
            <ProjectGantt project={project} tasks={tasks} milestones={project.milestones} />
          </div>
        )}

        {activeTab === 'milestones' && (
          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-slate-800" style={{ fontFamily: 'Poppins, sans-serif' }}>Milestones</h3>
              <span className="text-sm text-slate-500">
                {(project.milestones || []).filter(m => m.completed).length} of {(project.milestones || []).length} completed
              </span>
            </div>

            {canManage && (
              <form onSubmit={handleAddMilestone} className="flex flex-wrap gap-3 mb-6 p-4 bg-slate-50 rounded-xl">
                <input placeholder="Milestone title" value={newMilestone.title}
                  onChange={e => setNewMilestone({ ...newMilestone, title: e.target.value })}
                  className="flex-1 min-w-48 px-3 py-2 border border-slate-200 rounded-xl text-sm" required />
                <input type="date" value={newMilestone.dueDate}
                  onChange={e => setNewMilestone({ ...newMilestone, dueDate: e.target.value })}
                  className="px-3 py-2 border border-slate-200 rounded-xl text-sm" />
                <button type="submit" className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium">
                  <Plus size={14} /> Add
                </button>
              </form>
            )}

            <div className="space-y-3">
              {(project.milestones || []).length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-8">No milestones yet</p>
              ) : (project.milestones || []).map(m => (
                <div key={m._id} className={`flex items-center gap-4 p-4 rounded-xl border ${m.completed ? 'bg-green-50 border-green-100' : 'bg-white border-slate-100'}`}>
                  <button onClick={() => canManage && toggleMilestone(m._id, m.completed)} disabled={!canManage}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${m.completed ? 'bg-green-500 border-green-500 text-white' : 'border-slate-300 hover:border-blue-500'}`}>
                    {m.completed && <CheckSquare size={12} />}
                  </button>
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${m.completed ? 'text-slate-500 line-through' : 'text-slate-800'}`}>{m.title}</p>
                    <p className="text-xs text-slate-400">Due: {formatDate(m.dueDate)}</p>
                  </div>
                  {canManage && (
                    <button onClick={() => deleteMilestone(m._id)} className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg">
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'budget' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="bg-white rounded-2xl border border-slate-100 p-5">
                <p className="text-xs text-slate-500 mb-1">Estimated Budget</p>
                <p className="text-2xl font-bold text-slate-800">{formatCurrency(project.estimatedBudget)}</p>
              </div>
              <div className="bg-white rounded-2xl border border-slate-100 p-5">
                <p className="text-xs text-slate-500 mb-1">Actual Cost</p>
                <p className="text-2xl font-bold text-slate-800">{formatCurrency(project.actualCost)}</p>
              </div>
              <div className="bg-white rounded-2xl border border-slate-100 p-5">
                <p className="text-xs text-slate-500 mb-1">Variance</p>
                <p className={`text-2xl font-bold ${project.budgetVariance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(project.budgetVariance)}
                </p>
              </div>
            </div>

            {project.estimatedBudget > 0 && (
              <div className="bg-white rounded-2xl border border-slate-100 p-5">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-500">Budget Used</span>
                  <span className="font-semibold text-slate-700">{budgetUsedPct}%</span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${budgetUsedPct > 100 ? 'bg-red-500' : budgetUsedPct > 80 ? 'bg-amber-500' : 'bg-blue-600'}`}
                    style={{ width: `${Math.min(100, budgetUsedPct)}%` }} />
                </div>
              </div>
            )}

            {canManage && (
              <form onSubmit={handleAddCost} className="bg-white rounded-2xl border border-slate-100 p-5">
                <h4 className="font-medium text-slate-800 mb-4">Add Cost Entry</h4>
                <div className="flex flex-wrap gap-3">
                  <input placeholder="Description" value={costForm.description}
                    onChange={e => setCostForm({ ...costForm, description: e.target.value })}
                    className="flex-1 min-w-48 px-3 py-2 border border-slate-200 rounded-xl text-sm" required />
                  <input type="number" placeholder="Amount" value={costForm.amount} min="0" step="0.01"
                    onChange={e => setCostForm({ ...costForm, amount: e.target.value })}
                    className="w-32 px-3 py-2 border border-slate-200 rounded-xl text-sm" required />
                  <select value={costForm.category} onChange={e => setCostForm({ ...costForm, category: e.target.value })}
                    className="px-3 py-2 border border-slate-200 rounded-xl text-sm">
                    {['General', 'Software', 'Infrastructure', 'Labor', 'Marketing', 'Other'].map(c => <option key={c}>{c}</option>)}
                  </select>
                  <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium">Add Entry</button>
                </div>
              </form>
            )}

            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100">
                <h4 className="font-medium text-slate-800">Cost History</h4>
              </div>
              {(project.costEntries || []).length === 0 ? (
                <p className="p-6 text-sm text-slate-400 text-center">No cost entries yet</p>
              ) : (
                <div className="divide-y divide-slate-50">
                  {(project.costEntries || []).slice().reverse().map(entry => (
                    <div key={entry._id} className="flex items-center gap-4 px-6 py-3">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-800">{entry.description}</p>
                        <p className="text-xs text-slate-400">{entry.category} · {formatDate(entry.date)}</p>
                      </div>
                      <span className="text-sm font-semibold text-slate-700">{formatCurrency(entry.amount)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'files' && (
          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-slate-800" style={{ fontFamily: 'Poppins, sans-serif' }}>File Attachments</h3>
              <button onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium">
                <Upload size={14} /> Upload File
              </button>
              <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileUpload}
                accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.gif,.txt" />
            </div>

            {(project.attachments || []).length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <Paperclip size={32} className="mx-auto mb-2 opacity-40" />
                <p className="text-sm">No files attached yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(project.attachments || []).map(att => (
                  <div key={att._id} className="flex items-center gap-3 p-4 border border-slate-100 rounded-xl hover:bg-slate-50">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                      <Paperclip size={16} className="text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">{att.originalName}</p>
                      <p className="text-xs text-slate-400">{formatFileSize(att.size)}</p>
                    </div>
                    <a href={`/uploads/${att.filename}`} target="_blank" rel="noopener noreferrer"
                      className="p-2 text-slate-400 hover:text-blue-600 rounded-lg">
                      <Download size={15} />
                    </a>
                    {(canManage || att.uploadedBy?._id === user?._id || att.uploadedBy === user?._id) && (
                      <button onClick={() => handleDeleteAttachment(att._id)}
                        className="p-2 text-slate-400 hover:text-red-500 rounded-lg">
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
