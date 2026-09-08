import { useEffect, useState, useRef } from 'react';
import { Search, Plus, X, CheckSquare, Send, Paperclip, AlertTriangle, Pencil, Trash2, Filter } from 'lucide-react';
import Header from '../components/layout/Header';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import {
  getTaskStatusClass, getPriorityClass, formatDate, getInitials,
  getAvatarColor, isOverdue, timeAgo, formatFileSize, getFileUrl
} from '../utils/helpers';
import Avatar from '../components/common/Avatar';
import toast from 'react-hot-toast';

const STATUSES = ['Todo', 'In Progress', 'Review', 'Done'];
const PRIORITIES = ['Low', 'Medium', 'High', 'Urgent'];

// ─── Task Drawer ───────────────────────────────────────────────────────────────
function TaskDrawer({ taskId, onClose, onUpdate, onDelete, canManage }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [editStatus, setEditStatus] = useState('');
  const [deleting, setDeleting] = useState(false);
  const fileRef = useRef();
  const { user } = useAuth();

  useEffect(() => {
    api.get(`/tasks/${taskId}`)
      .then(({ data }) => { setData(data); setEditStatus(data.task.status); })
      .catch(() => toast.error('Failed to load task'))
      .finally(() => setLoading(false));
  }, [taskId]);

  const handleStatusChange = async (newStatus) => {
    try {
      const { data: res } = await api.put(`/tasks/${taskId}`, { status: newStatus });
      setData(d => ({ ...d, task: res.task }));
      setEditStatus(newStatus);
      onUpdate(res.task);
      toast.success('Status updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setSubmitting(true);
    try {
      const { data: res } = await api.post(`/tasks/${taskId}/comments`, { text: comment });
      setData(d => ({
        ...d,
        task: { ...d.task, comments: [...(d.task.comments || []), res.comment] },
      }));
      setComment('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add comment');
    } finally { setSubmitting(false); }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      await api.post(`/tasks/${taskId}/attachments`, formData);
      toast.success('File attached!');
      const { data: refreshed } = await api.get(`/tasks/${taskId}`);
      setData(refreshed);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally { e.target.value = ''; }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this task permanently?')) return;
    setDeleting(true);
    try {
      await api.delete(`/tasks/${taskId}`);
      onDelete(taskId);
      toast.success('Task deleted');
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete task');
      setDeleting(false);
    }
  };

  return (
    <>
      <div className="drawer-overlay" onClick={onClose} />
      <div className="drawer-panel">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
          </div>
        ) : !data ? (
          <div className="p-8 text-center text-slate-500 dark:text-slate-400">Task not found</div>
        ) : (
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-start gap-3 p-6 border-b border-slate-100 dark:border-slate-800">
              <div className="flex-1">
                <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 leading-snug" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {data.task.title}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{data.task.project?.title}</p>
              </div>
              <div className="flex items-center gap-1">
                {canManage && (
                  <button onClick={handleDelete} disabled={deleting}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors disabled:opacity-50"
                    title="Delete task">
                    <Trash2 size={16} />
                  </button>
                )}
                <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                <span className={getTaskStatusClass(data.task.status)}>{data.task.status}</span>
                <span className={getPriorityClass(data.task.priority)}>{data.task.priority}</span>
                {isOverdue(data.task.dueDate, data.task.status) && (
                  <span className="badge badge-urgent overdue-pulse">
                    <AlertTriangle size={11} className="mr-1" /> Overdue
                  </span>
                )}
              </div>

              {/* Description */}
              {data.task.description && (
                <div>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-2">Description</p>
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{data.task.description}</p>
                </div>
              )}

              {/* Details grid */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 mb-1">Assigned To</p>
                  {data.task.assignedTo ? (
                    <div className="flex items-center gap-2">
                      <Avatar user={data.task.assignedTo} className="w-6 h-6 text-[10px]" />
                      <span className="text-slate-700 dark:text-slate-300">{data.task.assignedTo?.name}</span>
                    </div>
                  ) : <span className="text-slate-400 dark:text-slate-500">Unassigned</span>}
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 mb-1">Due Date</p>
                  <p className={`${isOverdue(data.task.dueDate, data.task.status) ? 'text-red-500' : 'text-slate-700 dark:text-slate-300'}`}>
                    {formatDate(data.task.dueDate)}
                  </p>
                </div>
              </div>

              {/* Status change */}
              <div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-2">Update Status</p>
                <div className="flex flex-wrap gap-2">
                  {STATUSES.map(s => (
                    <button key={s} onClick={() => handleStatusChange(s)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                        editStatus === s
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-300'
                      }`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Attachments */}
              {(data.task.attachments || []).length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-2">Attachments</p>
                  <div className="space-y-2">
                    {data.task.attachments.map((att, i) => (
                      <div key={i} className="flex items-center gap-3 p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl">
                        <Paperclip size={14} className="text-blue-500 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-slate-700 dark:text-slate-300 truncate">{att.originalName}</p>
                          <p className="text-xs text-slate-400 dark:text-slate-500">{formatFileSize(att.size)}</p>
                        </div>
                        <a href={getFileUrl(`/uploads/${att.filename}`)} target="_blank" rel="noreferrer"
                          className="text-xs text-blue-600 dark:text-blue-400 hover:underline">View</a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Activity */}
              {(data.task.activities || []).length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-2">Activity</p>
                  <div className="space-y-2">
                    {data.task.activities.slice(-5).map((act, i) => (
                      <div key={i} className="flex gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600 mt-1.5 flex-shrink-0" />
                        <span>{act.action} · {timeAgo(act.createdAt)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Comments */}
              <div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-3">Comments ({(data.task.comments || []).length})</p>
                <div className="space-y-4">
                  {(data.task.comments || []).length === 0 && (
                    <p className="text-sm text-slate-400 dark:text-slate-500 text-center py-4">No comments yet. Be the first to comment!</p>
                  )}
                  {(data.task.comments || []).map(c => (
                    <div key={c._id} className="flex gap-3">
                      <Avatar user={c.user} className="w-7 h-7 text-xs flex-shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">{c.user?.name}</span>
                          <span className="text-xs text-slate-400 dark:text-slate-500">{timeAgo(c.createdAt)}</span>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-800 rounded-xl px-3 py-2 text-sm text-slate-700 dark:text-slate-300">{c.text}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Comment input */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <form onSubmit={handleComment} className="flex gap-2">
                <input value={comment} onChange={e => setComment(e.target.value)} placeholder="Add a comment..."
                  className="flex-1 px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400" />
                <button type="submit" disabled={submitting || !comment.trim()}
                  className="p-2.5 bg-blue-600 text-white rounded-xl disabled:opacity-50 hover:bg-blue-700 transition-colors">
                  <Send size={15} />
                </button>
              </form>
              <div className="flex justify-end">
                <input ref={fileRef} type="file" className="hidden" onChange={handleFileUpload} />
                <button onClick={() => fileRef.current?.click()}
                  className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  <Paperclip size={13} /> Attach file
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// ─── Create / Edit Task Modal ──────────────────────────────────────────────────
function TaskModal({ task, onClose, onSave, projects, members }) {
  const isEdit = !!task?._id;
  const [form, setForm] = useState({
    title: task?.title || '',
    description: task?.description || '',
    status: task?.status || 'Todo',
    priority: task?.priority || 'Medium',
    dueDate: task?.dueDate ? task.dueDate.slice(0, 10) : '',
    assignedTo: task?.assignedTo?._id || task?.assignedTo || '',
    project: task?.project?._id || task?.project || '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form };
      if (!payload.assignedTo) delete payload.assignedTo;
      if (!payload.dueDate) delete payload.dueDate;

      let result;
      if (isEdit) {
        const { data } = await api.put(`/tasks/${task._id}`, payload);
        result = data.task;
      } else {
        const { data } = await api.post('/tasks', payload);
        result = data.task;
      }
      onSave(result, isEdit);
      toast.success(isEdit ? 'Task updated!' : 'Task created!');
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || `Failed to ${isEdit ? 'update' : 'create'} task`);
    } finally {
      setLoading(false);
    }
  };

  const inputCls = 'w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-200';
  const labelCls = 'block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2 className="text-xl font-bold mb-6" style={{ fontFamily: 'Poppins, sans-serif', color: 'var(--color-text-primary)' }}>
          {isEdit ? 'Edit Task' : 'Create New Task'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={labelCls}>Task Title *</label>
            <input name="title" value={form.title} onChange={handleChange} required placeholder="e.g. Build Login API" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={3} placeholder="Task details..."
              className={`${inputCls} resize-none`} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Project *</label>
              <select name="project" value={form.project} onChange={handleChange} required className={inputCls}>
                <option value="">Select project</option>
                {projects.map(p => <option key={p._id} value={p._id}>{p.title}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Assign To</label>
              <select name="assignedTo" value={form.assignedTo} onChange={handleChange} className={inputCls}>
                <option value="">Unassigned</option>
                {members.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Status</label>
              <select name="status" value={form.status} onChange={handleChange} className={inputCls}>
                {STATUSES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Priority</label>
              <select name="priority" value={form.priority} onChange={handleChange} className={inputCls}>
                {PRIORITIES.map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div className="col-span-2">
              <label className={labelCls}>Due Date</label>
              <input name="dueDate" type="date" value={form.dueDate} onChange={handleChange} className={inputCls} />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 py-2.5 text-white rounded-xl text-sm font-semibold disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #2563EB, #3B82F6)' }}>
              {loading ? (isEdit ? 'Saving...' : 'Creating...') : (isEdit ? 'Save Changes' : 'Create Task')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Main Tasks Page ───────────────────────────────────────────────────────────
export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const { canManage } = useAuth();

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const params = { page, limit: 10 };
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      if (priorityFilter) params.priority = priorityFilter;
      const { data } = await api.get('/tasks', { params });
      
      if (data.tasks) {
        setTasks(data.tasks);
        setTotalPages(data.pages || 1);
        setTotalItems(data.total || data.count);
      } else {
        setTasks(data || []);
      }
    } catch {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTasks(); }, [search, statusFilter, priorityFilter, page]);

  useEffect(() => { setPage(1); }, [search, statusFilter, priorityFilter]);

  useEffect(() => {
    api.get('/projects').then(({ data }) => setProjects(data.projects || [])).catch(() => {});
    api.get('/projects/team/members').then(({ data }) => setMembers(data.members || [])).catch(() => {});
  }, []);

  const handleTaskUpdate = (updatedTask) => {
    setTasks(ts => ts.map(t => t._id === updatedTask._id ? { ...t, ...updatedTask } : t));
  };

  const handleTaskDelete = (taskId) => {
    setTasks(ts => ts.filter(t => t._id !== taskId));
    setSelectedTaskId(null);
  };

  const handleTaskSave = (saved, isEdit) => {
    if (isEdit) {
      setTasks(ts => ts.map(t => t._id === saved._id ? saved : t));
    } else {
      setTasks(ts => [saved, ...ts]);
    }
  };

  const openEdit = (e, task) => {
    e.stopPropagation();
    setEditTask(task);
    setShowModal(true);
  };

  const selectCls = 'px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-700 dark:text-slate-300';

  return (
    <div className="page-enter">
      <Header title="Tasks" subtitle="Manage and track all tasks across your projects" />
      <div className="p-4 md:p-8">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tasks..."
              className="w-full pl-11 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400" />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className={selectCls}>
            <option value="">All Status</option>
            {STATUSES.map(s => <option key={s}>{s}</option>)}
          </select>
          <select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)} className={selectCls}>
            <option value="">All Priority</option>
            {PRIORITIES.map(p => <option key={p}>{p}</option>)}
          </select>
          {canManage && (
            <button
              onClick={() => { setEditTask(null); setShowModal(true); }}
              className="flex items-center justify-center gap-2 px-5 py-2.5 text-white text-sm font-semibold rounded-xl whitespace-nowrap"
              style={{ background: 'linear-gradient(135deg, #2563EB, #3B82F6)', boxShadow: '0 4px 12px rgba(37,99,235,0.3)' }}>
              <Plus size={16} /> New Task
            </button>
          )}
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto min-w-full">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60">
                  {['Task Name', 'Project', 'Assigned To', 'Status', 'Priority', 'Due Date', ...(canManage ? ['Actions'] : [])].map(col => (
                    <th key={col} className="text-left px-5 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800/60">
                {loading ? (
                  <tr><td colSpan={canManage ? 7 : 6} className="text-center py-12 text-slate-400">Loading tasks...</td></tr>
                ) : tasks.length === 0 ? (
                  <tr><td colSpan={canManage ? 7 : 6} className="text-center py-12 text-slate-400 dark:text-slate-500">
                    <CheckSquare size={40} className="mx-auto mb-3 opacity-30" />
                    <p className="font-medium">No tasks found</p>
                    <p className="text-xs mt-1">Try adjusting your filters or create a new task</p>
                  </td></tr>
                ) : tasks.map(t => {
                  const overdue = isOverdue(t.dueDate, t.status);
                  return (
                    <tr key={t._id} className="table-row-hover" onClick={() => setSelectedTaskId(t._id)}>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-1 h-8 rounded-full flex-shrink-0 ${
                            t.priority === 'Urgent' ? 'bg-red-500' :
                            t.priority === 'High' ? 'bg-orange-500' :
                            t.priority === 'Medium' ? 'bg-blue-500' : 'bg-slate-300'
                          }`} />
                          <div className="min-w-0">
                           <p className="text-sm font-medium text-slate-800 dark:text-slate-100 line-clamp-1 whitespace-nowrap">{t.title}</p>
                            {t.description && <p className="text-xs text-slate-400 dark:text-slate-500 line-clamp-1 mt-0.5">{t.description}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">{t.project?.title || '—'}</td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        {t.assignedTo ? (
                          <div className="flex items-center gap-2">
                            <Avatar user={t.assignedTo} className="w-7 h-7 text-xs flex-shrink-0" />
                            <span className="text-sm text-slate-700 dark:text-slate-300">{t.assignedTo?.name}</span>
                          </div>
                        ) : <span className="text-sm text-slate-400 dark:text-slate-500">—</span>}
                      </td>
                      <td className="px-5 py-4"><span className={getTaskStatusClass(t.status)}>{t.status}</span></td>
                      <td className="px-5 py-4"><span className={getPriorityClass(t.priority)}>{t.priority}</span></td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <p className={`text-sm ${overdue ? 'text-red-500 font-medium' : 'text-slate-600 dark:text-slate-400'}`}>
                          {formatDate(t.dueDate)}
                        </p>
                        {overdue && <p className="text-xs text-red-400 flex items-center gap-1 mt-0.5"><AlertTriangle size={10} /> Overdue</p>}
                      </td>
                      {canManage && (
                        <td className="px-5 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                            <button onClick={(e) => openEdit(e, t)}
                              className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/20 rounded-lg transition-colors">
                              <Pencil size={14} />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 text-sm text-slate-500 dark:text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50 dark:bg-slate-900">
            <span>{totalItems} task{totalItems !== 1 ? 's' : ''} found</span>
            
            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-xs">Page {page} of {totalPages}</span>
                <button 
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}

            {(statusFilter || priorityFilter || search) && (
              <button onClick={() => { setSearch(''); setStatusFilter(''); setPriorityFilter(''); }}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
                <X size={12} /> Clear filters
              </button>
            )}
          </div>
        </div>
      </div>

      {selectedTaskId && (
        <TaskDrawer
          taskId={selectedTaskId}
          onClose={() => setSelectedTaskId(null)}
          onUpdate={handleTaskUpdate}
          onDelete={handleTaskDelete}
          canManage={canManage}
        />
      )}
      {showModal && (
        <TaskModal
          task={editTask}
          onClose={() => { setShowModal(false); setEditTask(null); }}
          onSave={handleTaskSave}
          projects={projects}
          members={members}
        />
      )}
    </div>
  );
}
