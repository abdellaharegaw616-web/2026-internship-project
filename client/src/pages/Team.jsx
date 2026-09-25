import { useEffect, useState } from 'react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Pencil, Trash2, ChevronRight, UserCheck, Download, Upload, X, Mail, Phone, Building, Shield, RefreshCw, StopCircle } from 'lucide-react';
import Header from '../components/layout/Header';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { getInitials, getAvatarColor, getRoleClass, getRoleLabel } from '../utils/helpers';
import Avatar from '../components/common/Avatar';
import toast from 'react-hot-toast';
import PermissionGuard from '../components/common/PermissionGuard';
import { usePermissions } from '../hooks/usePermissions';

const ROLES = ['SuperAdmin', 'Admin', 'ProjectManager', 'TeamMember'];

// ─── Invite Member Modal ────────────────────────────────────────────
function InviteMemberModal({ onClose, onSave, departments, projects }) {
  const { user } = useAuth();
  const [form, setForm] = useState({ email: '', role: 'TeamMember', department: '', project: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form };
      if (!payload.department) delete payload.department;
      if (!payload.project) delete payload.project;
      
      const response = await api.post('/invitations', payload);
      onSave(response.data.data);
      toast.success('Invitation sent successfully!');
      
      // For development/demo only, show the link:
      if (response.data.data.inviteToken) {
        toast((t) => (
          <span>
            <b>Demo Link:</b> <a href={`/accept-invitation/${response.data.data.inviteToken}`} className="text-blue-400 underline">Click here to accept</a>
          </span>
        ), { duration: 10000 });
      }
      
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'An error occurred');
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
          Invite Team Member
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={labelCls}>Email *</label>
            <div className="relative">
              <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="john@company.com" className={`${inputCls} pl-10`} />
              <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          </div>
          <div>
            <label className={labelCls}>Role *</label>
            <select name="role" value={form.role} onChange={handleChange} className={inputCls}>
              {user.role === 'ProjectManager' ? (
                <option value="TeamMember">Team Member</option>
              ) : (
                ROLES.map(r => {
                  if (r === 'SuperAdmin') return null; // No one can invite a SuperAdmin directly
                  if (user.role === 'Admin' && r === 'Admin') return null;
                  return <option key={r} value={r}>{getRoleLabel(r)}</option>
                })
              )}
            </select>
          </div>
          <div>
            <label className={labelCls}>Department</label>
            <div className="relative">
              <select name="department" value={form.department} onChange={handleChange} className={`${inputCls} pl-10`}>
                <option value="">Select department</option>
                {departments.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
              </select>
              <Building size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>
          {user.role === 'ProjectManager' && (
            <div>
              <label className={labelCls}>Project Assignment *</label>
              <select name="project" value={form.project} onChange={handleChange} required className={inputCls}>
                <option value="">Select project</option>
                {projects.map(p => <option key={p._id} value={p._id}>{p.title}</option>)}
              </select>
            </div>
          )}
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 py-2.5 text-white rounded-xl text-sm font-semibold transition-all disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #2563EB, #3B82F6)' }}>
              {loading ? 'Sending...' : 'Send Invitation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Main Team Page ────────────────────────────────────────────────────────────
export default function Team() {
  const [activeTab, setActiveTab] = useState('members'); // 'members' or 'invitations'
  const [members, setMembers] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [projects, setProjects] = useState([]); // For PMs to invite
  const [loading, setLoading] = useState(true);
  
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  
  const [showModal, setShowModal] = useState(false);
  const [importing, setImporting] = useState(false);
  
  const { user, isSuperAdmin, isAdmin } = useAuth();
  const { hasPermission, PERMISSIONS } = usePermissions();
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const params = { page, limit: 10 };
      if (search) params.search = search;
      if (roleFilter) params.role = roleFilter;
      if (deptFilter) params.department = deptFilter;
      
      const { data } = await api.get('/users', { params });
      if (data.users) {
        setMembers(data.users);
        setTotalPages(data.pages);
        setTotalItems(data.total);
      } else {
        setMembers(data || []);
      }
    } catch (err) {
      toast.error('Failed to load team members');
    } finally {
      setLoading(false);
    }
  };

  const fetchInvitations = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/invitations');
      setInvitations(data.data || []);
    } catch (err) {
      toast.error('Failed to load invitations');
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const { data } = await api.get('/departments');
      setDepartments(data.departments || []);
    } catch { }
  };

  const fetchProjects = async () => {
    if (user.role !== 'ProjectManager') return;
    try {
      const { data } = await api.get('/projects?limit=100');
      setProjects(data.projects || []);
    } catch { }
  };

  useEffect(() => {
    fetchDepartments();
    fetchProjects();
  }, []);

  useEffect(() => {
    if (activeTab === 'members') {
      fetchMembers();
    } else {
      fetchInvitations();
    }
  }, [search, roleFilter, deptFilter, page, activeTab]);

  useEffect(() => {
    setPage(1);
  }, [search, roleFilter, deptFilter, activeTab]);

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this team member? They will lose access to the system.')) return;
    try {
      await api.delete(`/users/${id}`);
      setMembers(members.filter(m => m._id !== id));
      toast.success('Member removed');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete');
    }
  };

  const handleTransferSuperAdmin = async (id) => {
    if (!window.confirm('Are you sure you want to transfer SuperAdmin privileges? You will be demoted to Admin.')) return;
    try {
      await api.post('/users/transfer-superadmin', { targetUserId: id });
      toast.success('SuperAdmin privileges transferred!');
      fetchMembers();
      setTimeout(() => window.location.reload(), 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Transfer failed');
    }
  };

  const handleRevokeInvite = async (id) => {
    if (!window.confirm('Revoke this invitation?')) return;
    try {
      await api.put(`/invitations/${id}/revoke`);
      toast.success('Invitation revoked');
      fetchInvitations();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to revoke');
    }
  };

  const handleDeleteInvite = async (id) => {
    if (!window.confirm('Delete this invitation? This action cannot be undone.')) return;
    try {
      await api.delete(`/invitations/${id}`);
      toast.success('Invitation deleted');
      fetchInvitations();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete');
    }
  };

  const handleExport = async (format = 'csv') => {
    try {
      const response = await api.get(`/users/export?format=${format}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `team.${format === 'excel' ? 'xlsx' : 'csv'}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success(`Exported as ${format === 'excel' ? 'Excel' : 'CSV'}`);
    } catch {
      toast.error('Failed to export');
    }
  };

  const handleImport = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = e.target.result.split(',')[1];
      const format = file.name.endsWith('.csv') ? 'csv' : 'excel';
      setImporting(true);
      try {
        const { data } = await api.post('/users/import', { file: base64, format });
        toast.success(data.message);
        fetchMembers();
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to import');
      } finally {
        setImporting(false);
        event.target.value = '';
      }
    };
    reader.readAsDataURL(file);
  };

  // Stats summary
  const activeCount = members.filter(m => m.isActive !== false).length;
  const adminCount = members.filter(m => m.role === 'Admin').length;
  const pmCount = members.filter(m => m.role === 'ProjectManager').length;

  const selectCls = 'px-4 py-2.5 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-slate-200/80 dark:border-slate-700/80 rounded-xl text-sm text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm cursor-pointer';

  return (
    <div className="page-enter">
      <Header title="Team" subtitle="Manage your team members and invitations" />
      <div className="p-4 md:p-8">
        
        {/* Tabs */}
        <div className="flex border-b border-slate-200/60 dark:border-slate-700/60 mb-6 gap-2">
          <button
            onClick={() => setActiveTab('members')}
            className={`px-5 py-3 font-semibold text-sm transition-all duration-300 relative rounded-t-xl ${activeTab === 'members' ? 'text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-500/10' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50/50 dark:hover:bg-slate-800/30'}`}
          >
            Team Members
            {activeTab === 'members' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 dark:bg-blue-400 rounded-t-full shadow-[0_-2px_8px_rgba(37,99,235,0.4)]"></div>}
          </button>
          <button
            onClick={() => setActiveTab('invitations')}
            className={`px-5 py-3 font-semibold text-sm transition-all duration-300 relative rounded-t-xl ${activeTab === 'invitations' ? 'text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-500/10' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50/50 dark:hover:bg-slate-800/30'}`}
          >
            Invitations
            {activeTab === 'invitations' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 dark:bg-blue-400 rounded-t-full shadow-[0_-2px_8px_rgba(37,99,235,0.4)]"></div>}
          </button>
        </div>

        {activeTab === 'members' && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Members', value: members.length, color: 'text-blue-700 dark:text-blue-400', bg: 'bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/40 dark:to-blue-900/10 border-blue-100 dark:border-blue-800/50' },
              { label: 'Active', value: activeCount, color: 'text-green-700 dark:text-green-400', bg: 'bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-900/40 dark:to-green-900/10 border-green-100 dark:border-green-800/50' },
              { label: 'Admins', value: adminCount, color: 'text-purple-700 dark:text-purple-400', bg: 'bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-900/40 dark:to-purple-900/10 border-purple-100 dark:border-purple-800/50' },
              { label: 'Project Managers', value: pmCount, color: 'text-orange-700 dark:text-orange-400', bg: 'bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-900/40 dark:to-orange-900/10 border-orange-100 dark:border-orange-800/50' },
            ].map(stat => (
              <div key={stat.label} className={`rounded-2xl p-5 ${stat.bg} border backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-black/40`}>
                <p className={`text-3xl font-extrabold ${stat.color} mb-1 drop-shadow-sm`} style={{ fontFamily: 'Poppins, sans-serif' }}>{stat.value}</p>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{stat.label}</p>
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 mb-6 overflow-x-auto pb-2 sm:pb-0">
          <div className="flex-1 relative min-w-[200px]">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email..."
              className="w-full pl-11 pr-4 py-2.5 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-slate-200/80 dark:border-slate-700/80 rounded-xl text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm" />
          </div>
          {activeTab === 'members' && (
            <>
              <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className={selectCls}>
                <option value="">All Roles</option>
                {ROLES.map(r => <option key={r} value={r}>{getRoleLabel(r)}</option>)}
              </select>
              {departments.length > 0 && (
                <select value={deptFilter} onChange={e => setDeptFilter(e.target.value)} className={selectCls}>
                  <option value="">All Departments</option>
                  {departments.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
                </select>
              )}
            </>
          )}
          
          <PermissionGuard permission={PERMISSIONS.MANAGE_USERS}>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => setShowModal(true)}
                className="flex items-center gap-2 px-6 py-2.5 text-white text-sm font-bold rounded-xl whitespace-nowrap transition-all duration-300 hover:scale-105 hover:shadow-blue-500/40"
                style={{ background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)', boxShadow: '0 4px 15px rgba(37,99,235,0.3)' }}>
                <Plus size={18} strokeWidth={2.5} /> Invite Member
              </button>
              {activeTab === 'members' && (
                <>
                  <button onClick={() => handleExport('csv')} title="Export CSV"
                    className="flex items-center gap-2 px-4 py-2.5 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-slate-200/80 dark:border-slate-700/80 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 hover:scale-105 transition-all shadow-sm">
                    <Download size={16} /> CSV
                  </button>
                  <label className="flex items-center gap-2 px-4 py-2.5 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-slate-200/80 dark:border-slate-700/80 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 hover:scale-105 transition-all shadow-sm cursor-pointer">
                    <Upload size={16} /> {importing ? 'Importing...' : 'Import'}
                    <input type="file" accept=".csv,.xlsx,.xls" onChange={handleImport} disabled={importing} className="hidden" />
                  </label>
                </>
              )}
            </div>
          </PermissionGuard>
        </div>

        {/* Members Table */}
        {activeTab === 'members' && (
          <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl rounded-3xl border border-slate-200/60 dark:border-slate-700/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] overflow-hidden relative">
            <div className="overflow-x-auto min-w-full">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="border-b border-slate-200/60 dark:border-slate-700/60 bg-slate-50/50 dark:bg-slate-800/40 backdrop-blur-sm">
                    {['Member', 'Role', 'Department', 'Status', 'Actions'].map(col => (
                      <th key={col} className="text-left px-6 py-5 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/60 dark:divide-slate-800/60">
                  {loading ? (
                    <tr><td colSpan={5} className="text-center py-16 text-slate-400 font-medium">Loading team members...</td></tr>
                  ) : members.length === 0 ? (
                    <tr><td colSpan={5} className="text-center py-16 text-slate-400 dark:text-slate-500">
                      <UserCheck size={48} className="mx-auto mb-4 opacity-30 text-blue-500" />
                      <p className="font-semibold text-lg text-slate-600 dark:text-slate-300">No members found</p>
                      <p className="text-sm mt-1">Try adjusting your filters</p>
                    </td></tr>
                  ) : members.map(m => (
                    <tr key={m._id} className="hover:bg-blue-50/40 dark:hover:bg-blue-900/10 cursor-pointer transition-colors duration-200" onClick={() => navigate(`/app/users/${m._id}`)}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <Avatar user={m} className="w-10 h-10 ring-2 ring-white dark:ring-slate-800 shadow-sm flex-shrink-0" />
                          <div>
                            <p className="text-sm font-bold text-slate-800 dark:text-slate-100 whitespace-nowrap group-hover:text-blue-600 transition-colors">{m.name}</p>
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 whitespace-nowrap">{m.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap"><span className={getRoleClass(m.role)}>{getRoleLabel(m.role)}</span></td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-600 dark:text-slate-300 whitespace-nowrap">{m.department?.name || '—'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`badge ${m.isActive !== false ? 'bg-green-100/80 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100/80 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                          {m.isActive !== false ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
                          <button onClick={() => navigate(`/app/users/${m._id}`)}
                            className="p-2 hover:bg-blue-100/50 dark:hover:bg-blue-900/40 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl transition-all duration-200 hover:scale-110" title="View profile">
                            <ChevronRight size={16} />
                          </button>
                          <PermissionGuard permission={PERMISSIONS.MANAGE_USERS}>
                            {m.role !== 'SuperAdmin' && (
                              <button onClick={() => handleDelete(m._id)}
                                className="p-2 hover:bg-red-100/50 dark:hover:bg-red-900/40 text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded-xl transition-all duration-200 hover:scale-110" title="Remove member">
                                <Trash2 size={16} />
                              </button>
                            )}
                          </PermissionGuard>
                          {isSuperAdmin && m._id !== user?._id && (
                            <button onClick={() => handleTransferSuperAdmin(m._id)}
                              className="p-2 hover:bg-purple-100/50 dark:hover:bg-purple-900/40 text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 rounded-xl transition-all duration-200 hover:scale-110" title="Transfer SuperAdmin Role">
                              <Shield size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Invitations Table */}
        {activeTab === 'invitations' && (
          <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl rounded-3xl border border-slate-200/60 dark:border-slate-700/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] overflow-hidden relative">
            <div className="overflow-x-auto min-w-full">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="border-b border-slate-200/60 dark:border-slate-700/60 bg-slate-50/50 dark:bg-slate-800/40 backdrop-blur-sm">
                    {['Email', 'Role', 'Status', 'Invited By', 'Date', 'Actions'].map(col => (
                      <th key={col} className="text-left px-6 py-5 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/60 dark:divide-slate-800/60">
                  {loading ? (
                    <tr><td colSpan={6} className="text-center py-16 text-slate-400 font-medium">Loading invitations...</td></tr>
                  ) : invitations.length === 0 ? (
                    <tr><td colSpan={6} className="text-center py-16 text-slate-400 dark:text-slate-500">
                      <Mail size={48} className="mx-auto mb-4 opacity-30 text-blue-500" />
                      <p className="font-semibold text-lg text-slate-600 dark:text-slate-300">No invitations found</p>
                      <p className="text-sm mt-1">Pending invites will appear here</p>
                    </td></tr>
                  ) : invitations.map(inv => (
                    <tr key={inv._id} className="hover:bg-slate-50/40 dark:hover:bg-slate-800/30 transition-colors duration-200">
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{inv.email}</p>
                      </td>
                      <td className="px-6 py-4"><span className={getRoleClass(inv.role)}>{getRoleLabel(inv.role)}</span></td>
                      <td className="px-6 py-4">
                        <span className={`badge ${inv.status === 'Pending' ? 'bg-amber-100/80 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : inv.status === 'Accepted' ? 'bg-green-100/80 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100/80 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                          {inv.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-600 dark:text-slate-400">{inv.invitedBy?.name || 'Unknown'}</td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-600 dark:text-slate-400">{new Date(inv.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          {inv.status === 'Pending' && (
                            <button onClick={() => handleRevokeInvite(inv._id)}
                              className="px-3 py-1.5 hover:bg-red-100/50 dark:hover:bg-red-900/40 text-slate-500 hover:text-red-600 dark:hover:text-red-400 rounded-xl transition-all duration-200 flex items-center gap-1.5 text-xs font-semibold" title="Revoke invitation">
                              <StopCircle size={14} /> Revoke
                            </button>
                          )}
                          {inv.status !== 'Pending' && (
                            <button onClick={() => handleDeleteInvite(inv._id)}
                              className="p-2 hover:bg-red-100/50 dark:hover:bg-red-900/40 text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded-xl transition-all duration-200 hover:scale-110" title="Delete invitation">
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {showModal && (
        <InviteMemberModal
          onClose={() => setShowModal(false)}
          onSave={() => fetchInvitations()}
          departments={departments}
          projects={projects}
        />
      )}
    </div>
  );
}
