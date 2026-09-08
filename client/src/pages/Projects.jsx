import { useEffect, useState } from 'react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Trash2, ChevronRight, FolderKanban, Copy, Archive, LayoutTemplate, Pencil, X, Camera } from 'lucide-react';
import Header from '../components/layout/Header';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { getProjectStatusClass, getPriorityClass, formatDate, getDaysRemaining, getInitials, getAvatarColor, formatCurrency } from '../utils/helpers';
import Avatar from '../components/common/Avatar';
import toast from 'react-hot-toast';

const STATUSES = ['Planning', 'Active', 'On Hold', 'Completed'];
const PRIORITIES = ['Low', 'Medium', 'High', 'Urgent'];

// ─── Project Modal (Create / Edit) ────────────────────────────────────────────
function ProjectModal({ project, onClose, onSave, members, templates }) {
  const { darkMode } = useTheme();
  const isEdit = !!project?._id;
  const [mode, setMode] = useState('blank');
  const [form, setForm] = useState({
    title: project?.title || '',
    description: project?.description || '',
    status: project?.status || 'Planning',
    priority: project?.priority || 'Medium',
    startDate: project?.startDate ? project.startDate.slice(0, 10) : '',
    endDate: project?.endDate ? project.endDate.slice(0, 10) : '',
    members: project?.members?.map(m => m._id || m) || [],
    estimatedBudget: project?.estimatedBudget || '',
  });
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [loading, setLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(project?.avatar || '');
  const fileInputRef = React.useRef(null);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Image must be less than 10MB');
        return;
      }
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const toggleMember = (id) => {
    setForm(f => ({
      ...f,
      members: f.members.includes(id) ? f.members.filter(m => m !== id) : [...f.members, id],
    }));
  };

  const applyTemplate = (templateId) => {
    setSelectedTemplate(templateId);
    const tpl = templates.find(t => t._id === templateId);
    if (tpl) {
      setForm(f => ({
        ...f,
        title: tpl.name,
        description: tpl.description,
        status: tpl.defaultStatus,
        priority: tpl.defaultPriority,
        estimatedBudget: tpl.estimatedBudget || '',
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let data;
      if (isEdit) {
        ({ data } = await api.put(`/projects/${project._id}`, {
          ...form,
          estimatedBudget: form.estimatedBudget ? parseFloat(form.estimatedBudget) : 0,
        }));
        
        // Upload avatar if file selected
        if (avatarFile) {
          const formData = new FormData();
          formData.append('avatar', avatarFile);
          const avatarResponse = await api.post(`/projects/${data.project._id}/avatar`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          data.project.avatar = avatarResponse.data.project.avatar;
        }
        
        onSave(data.project, true);
        toast.success('Project updated!');
      } else if (mode === 'template' && selectedTemplate) {
        ({ data } = await api.post(`/projects/from-template/${selectedTemplate}`, {
          title: form.title,
          members: form.members,
          startDate: form.startDate || undefined,
        }));
        
        // Upload avatar if file selected
        if (avatarFile) {
          const formData = new FormData();
          formData.append('avatar', avatarFile);
          const avatarResponse = await api.post(`/projects/${data.project._id}/avatar`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          data.project.avatar = avatarResponse.data.project.avatar;
        }
        
        onSave(data.project, false);
        toast.success('Project created from template!');
      } else {
        ({ data } = await api.post('/projects', {
          ...form,
          estimatedBudget: form.estimatedBudget ? parseFloat(form.estimatedBudget) : 0,
        }));
        
        // Upload avatar if file selected
        if (avatarFile) {
          const formData = new FormData();
          formData.append('avatar', avatarFile);
          const avatarResponse = await api.post(`/projects/${data.project._id}/avatar`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          data.project.avatar = avatarResponse.data.project.avatar;
        }
        
        onSave(data.project, false);
        toast.success('Project created!');
      }
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save project');
    } finally {
      setLoading(false);
    }
  };

  const inputCls = 'w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-200';
  const labelCls = 'block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: 680 }} onClick={e => e.stopPropagation()}>
        <h2 className="text-xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif', color: 'var(--color-text-primary)' }}>
          {isEdit ? 'Edit Project' : 'Create New Project'}
        </h2>

        {!isEdit && (
          <div className="flex gap-2 mb-6">
            <button type="button" onClick={() => setMode('blank')}
              className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-colors ${mode === 'blank' ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-400' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'}`}>
              Blank Project
            </button>
            <button type="button" onClick={() => setMode('template')}
              className={`flex-1 py-2 rounded-xl text-sm font-medium border flex items-center justify-center gap-1.5 transition-colors ${mode === 'template' ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-400' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'}`}>
              <LayoutTemplate size={14} /> From Template
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Avatar Upload Section */}
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div 
                className={`w-20 h-20 rounded-xl flex items-center justify-center cursor-pointer overflow-hidden border-2 border-dashed ${darkMode ? 'border-slate-600 hover:border-blue-500' : 'border-slate-300 hover:border-blue-500'} transition-colors`}
                onClick={() => fileInputRef.current?.click()}
              >
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Project" className="w-full h-full object-cover" />
                ) : (
                  <FolderKanban size={32} className={darkMode ? 'text-slate-400' : 'text-slate-500'} />
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors shadow-lg"
              >
                <Camera size={14} />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleAvatarChange}
                accept="image/*"
                className="hidden"
              />
            </div>
          </div>
          {/* Template picker */}
          {mode === 'template' && !isEdit && (
            <div>
              <label className={labelCls}>Select Template</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                {templates.length === 0 ? (
                  <p className="text-sm text-slate-400 dark:text-slate-500 col-span-2">No templates available</p>
                ) : templates.map(t => (
                  <button key={t._id} type="button" onClick={() => applyTemplate(t._id)}
                    className={`text-left p-3 rounded-xl border text-sm transition-colors ${selectedTemplate === t._id ? 'border-blue-400 bg-blue-50 dark:bg-blue-950/40' : 'border-slate-200 dark:border-slate-700'}`}>
                    <p className="font-medium text-slate-800 dark:text-slate-100">{t.name}</p>
                    <p className="text-xs mt-0.5 text-slate-500 dark:text-slate-400">{t.category} · {t.defaultDurationDays}d · {formatCurrency(t.estimatedBudget)}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className={labelCls}>Project Title *</label>
            <input name="title" value={form.title} onChange={handleChange} required placeholder="e.g. E-Commerce Website" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={2} placeholder="Project overview..."
              className={`${inputCls} resize-none`} />
          </div>

          {(mode === 'blank' || isEdit) && (
            <div className="grid grid-cols-2 gap-4">
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
              <div>
                <label className={labelCls}>Start Date</label>
                <input name="startDate" type="date" value={form.startDate} onChange={handleChange} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>End Date</label>
                <input name="endDate" type="date" value={form.endDate} onChange={handleChange} className={inputCls} />
              </div>
              <div className="col-span-2">
                <label className={labelCls}>Estimated Budget ($)</label>
                <input name="estimatedBudget" type="number" min="0" value={form.estimatedBudget} onChange={handleChange} className={inputCls} placeholder="0" />
              </div>
            </div>
          )}

          {mode === 'template' && !isEdit && (
            <div>
              <label className={labelCls}>Start Date</label>
              <input name="startDate" type="date" value={form.startDate} onChange={handleChange} className={inputCls} />
            </div>
          )}

          <div>
            <label className={labelCls}>Assign Team Members</label>
            <div className="max-h-36 overflow-y-auto space-y-1 border border-slate-200 dark:border-slate-700 rounded-xl p-2">
              {members.length === 0 ? (
                <p className="text-sm text-slate-400 dark:text-slate-500 p-2">No team members available</p>
              ) : members.map(m => (
                <label key={m._id} className="flex items-center gap-3 p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg cursor-pointer">
                  <input type="checkbox" checked={form.members.includes(m._id)} onChange={() => toggleMember(m._id)} className="accent-blue-600" />
                  <Avatar user={m} className="w-7 h-7 text-[10px]" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">{m.name}</span>
                  <span className="text-xs text-slate-400 dark:text-slate-500 ml-auto">{m.department?.name || m.role}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800">
              Cancel
            </button>
            <button type="submit" disabled={loading || (mode === 'template' && !selectedTemplate && !isEdit)}
              className="flex-1 py-2.5 text-white rounded-xl text-sm font-semibold disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #2563EB, #3B82F6)' }}>
              {loading ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Main Projects Page ────────────────────────────────────────────────────────
export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [showArchived, setShowArchived] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const { canManage, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const params = { archived: showArchived ? 'true' : 'false', page, limit: 10 };
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      if (priorityFilter) params.priority = priorityFilter;
      const { data } = await api.get('/projects', { params });
      
      if (data.projects) {
        setProjects(data.projects);
        setTotalPages(data.pages || 1);
        setTotalItems(data.total || data.count);
      } else {
        setProjects(data || []);
      }
    } catch {
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProjects(); }, [search, statusFilter, priorityFilter, showArchived, page]);

  useEffect(() => { setPage(1); }, [search, statusFilter, priorityFilter, showArchived]);

  useEffect(() => {
    api.get('/projects/team/members').then(({ data }) => setMembers(data.members || [])).catch(() => {});
    api.get('/project-templates').then(({ data }) => setTemplates(data.templates || [])).catch(() => {});
  }, []);

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm('Delete this project and all its tasks? This cannot be undone.')) return;
    try {
      await api.delete(`/projects/${id}`);
      setProjects(projects.filter(p => p._id !== id));
      toast.success('Project deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handleClone = async (e, id) => {
    e.stopPropagation();
    try {
      const { data } = await api.post(`/projects/${id}/clone`);
      toast.success('Project cloned!');
      navigate(`/projects/${data.project._id}`);
    } catch {
      toast.error('Clone failed');
    }
  };

  const handleArchive = async (e, id, isArchived) => {
    e.stopPropagation();
    try {
      if (isArchived) {
        await api.put(`/projects/${id}/unarchive`);
        toast.success('Project restored');
      } else {
        await api.put(`/projects/${id}/archive`);
        toast.success('Project archived');
      }
      fetchProjects();
    } catch {
      toast.error('Archive action failed');
    }
  };

  const handleSave = (project, isEdit) => {
    if (isEdit) {
      setProjects(ps => ps.map(p => p._id === project._id ? { ...p, ...project } : p));
    } else {
      setProjects(ps => [project, ...ps]);
    }
  };

  const openEdit = (e, project) => {
    e.stopPropagation();
    setEditProject(project);
    setShowModal(true);
  };

  const selectCls = 'px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-700 dark:text-slate-300';

  return (
    <div className="page-enter">
      <Header title="Projects" subtitle="Track all projects and their progress" />
      <div className="p-4 md:p-8">
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search projects..."
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
          <button
            onClick={() => setShowArchived(!showArchived)}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 border rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${showArchived ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-400' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'}`}>
            <Archive size={15} /> {showArchived ? 'Archived' : 'Active'}
          </button>
          {canManage && (
            <button
              onClick={() => { setEditProject(null); setShowModal(true); }}
              className="flex items-center justify-center gap-2 px-5 py-2.5 text-white text-sm font-semibold rounded-xl whitespace-nowrap"
              style={{ background: 'linear-gradient(135deg, #2563EB, #3B82F6)', boxShadow: '0 4px 12px rgba(37,99,235,0.3)' }}>
              <Plus size={16} /> New Project
            </button>
          )}
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto min-w-full">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60">
                  {['Project Name', 'Status', 'Priority', 'Progress', 'Budget', 'End Date', 'Team', 'Actions'].map(col => (
                    <th key={col} className="text-left px-5 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800/60">
                {loading ? (
                  <tr><td colSpan={8} className="text-center py-12 text-slate-400">Loading projects...</td></tr>
                ) : projects.length === 0 ? (
                  <tr><td colSpan={8} className="text-center py-12 text-slate-400 dark:text-slate-500">
                    <FolderKanban size={40} className="mx-auto mb-3 opacity-30" />
                    <p className="font-medium">{showArchived ? 'No archived projects' : 'No projects found'}</p>
                    <p className="text-xs mt-1">
                      {showArchived 
                        ? 'No projects have been archived yet.' 
                        : canManage 
                          ? 'Create your first project to get started.' 
                          : 'Join your first project to get started.'}
                    </p>
                  </td></tr>
                ) : projects.map(p => {
                  const days = getDaysRemaining(p.endDate);
                  return (
                    <tr key={p._id} className="table-row-hover" onClick={() => navigate(`/projects/${p._id}`)}>
                      <td className="px-5 py-4">
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 whitespace-nowrap">{p.title}</p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 line-clamp-1">{p.description}</p>
                      </td>
                      <td className="px-5 py-4"><span className={getProjectStatusClass(p.status)}>{p.status}</span></td>
                      <td className="px-5 py-4"><span className={getPriorityClass(p.priority)}>{p.priority}</span></td>
                      <td className="px-5 py-4 min-w-32">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                            <div className="h-full rounded-full progress-bar bg-blue-600" style={{ width: `${p.progress}%` }} />
                          </div>
                          <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 w-8">{p.progress}%</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <p className="text-sm text-slate-600 dark:text-slate-400">{formatCurrency(p.estimatedBudget || 0)}</p>
                        {p.actualCost > 0 && (
                          <p className="text-xs text-slate-400 dark:text-slate-500">Spent: {formatCurrency(p.actualCost)}</p>
                        )}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <p className="text-sm text-slate-600 dark:text-slate-400">{formatDate(p.endDate)}</p>
                        {days !== null && !p.isArchived && (
                          <p className={`text-xs mt-0.5 ${days < 0 ? 'text-red-500' : days <= 7 ? 'text-orange-500' : 'text-slate-400 dark:text-slate-500'}`}>
                            {days < 0 ? `${Math.abs(days)}d overdue` : `${days}d left`}
                          </p>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex avatar-stack">
                          {(p.members || []).slice(0, 3).map(m => (
                            <Avatar key={m._id} user={m} className="avatar w-7 h-7 text-[10px]" />
                          ))}
                          {p.members?.length > 3 && (
                            <div className="avatar w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-semibold text-slate-600 dark:text-slate-300">
                              +{p.members.length - 3}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                          {canManage && (
                            <>
                              <button onClick={e => openEdit(e, p)} title="Edit"
                                className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg transition-colors">
                                <Pencil size={14} />
                              </button>
                              <button onClick={e => handleClone(e, p._id)} title="Clone"
                                className="p-1.5 hover:bg-blue-50 dark:hover:bg-blue-950/20 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-colors">
                                <Copy size={14} />
                              </button>
                              <button onClick={e => handleArchive(e, p._id, p.isArchived)} title={p.isArchived ? 'Restore' : 'Archive'}
                                className="p-1.5 hover:bg-amber-50 dark:hover:bg-amber-950/20 text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 rounded-lg transition-colors">
                                <Archive size={14} />
                              </button>
                            </>
                          )}
                          <button onClick={() => navigate(`/projects/${p._id}`)} title="View"
                            className="p-1.5 hover:bg-blue-50 dark:hover:bg-blue-950/20 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-colors">
                            <ChevronRight size={14} />
                          </button>
                          {isAdmin && (
                            <button onClick={e => handleDelete(e, p._id)} title="Delete"
                              className="p-1.5 hover:bg-red-50 dark:hover:bg-red-950/20 text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg transition-colors">
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 text-sm text-slate-500 dark:text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50 dark:bg-slate-900">
            <span>{totalItems} project{totalItems !== 1 ? 's' : ''} found</span>
            
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
      {showModal && (
        <ProjectModal
          project={editProject}
          onClose={() => { setShowModal(false); setEditProject(null); }}
          onSave={handleSave}
          members={members}
          templates={templates}
        />
      )}
    </div>
  );
}
