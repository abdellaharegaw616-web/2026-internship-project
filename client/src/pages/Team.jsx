import { useEffect, useState } from 'react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Pencil, Trash2, ChevronRight, UserCheck, Download, Upload, X, Mail, Phone, Building, Shield, Camera } from 'lucide-react';
import Header from '../components/layout/Header';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { getInitials, getAvatarColor, getRoleClass, getRoleLabel } from '../utils/helpers';
import toast from 'react-hot-toast';

const ROLES = ['Admin', 'ProjectManager', 'TeamMember'];

// ─── Member Modal (Create / Edit) ────────────────────────────────────────────
function MemberModal({ member, onClose, onSave, departments }) {
  const { darkMode } = useTheme();
  const isEdit = !!member?._id;
  const [form, setForm] = useState(
    isEdit
      ? { name: member.name, email: member.email, role: member.role, department: member.department?._id || member.department || '', phone: member.phone || '', isActive: member.isActive, password: '' }
      : { name: '', email: '', password: '', role: 'TeamMember', department: '', phone: '', isActive: true }
  );
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(member?.avatar || '');
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

  const handleChange = (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm({ ...form, [e.target.name]: val });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let data;
      if (isEdit) {
        const payload = { ...form };
        if (!payload.password) delete payload.password;
        const response = await api.put(`/users/${member._id}`, payload);
        data = response.data;
        
        // Upload avatar if file selected
        if (avatarFile) {
          const formData = new FormData();
          formData.append('avatar', avatarFile);
          const avatarResponse = await api.post('/auth/avatar', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          data.avatar = avatarResponse.data.user.avatar;
        }
      } else {
        const response = await api.post('/users', form);
        data = response.data;
        
        // Upload avatar if file selected
        if (avatarFile) {
          const formData = new FormData();
          formData.append('avatar', avatarFile);
          const avatarResponse = await api.post('/auth/avatar', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          data.avatar = avatarResponse.data.user.avatar;
        }
      }
      onSave(data);
      toast.success(isEdit ? 'Member updated!' : 'Member added!');
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
          {isEdit ? 'Edit Member' : 'Add Team Member'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Avatar Upload Section */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div 
                className={`w-24 h-24 rounded-full flex items-center justify-center cursor-pointer overflow-hidden border-2 border-dashed ${darkMode ? 'border-slate-600 hover:border-blue-500' : 'border-slate-300 hover:border-blue-500'} transition-colors`}
                onClick={() => fileInputRef.current?.click()}
              >
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className={`text-3xl font-semibold ${getAvatarColor(form.role)}`}>{getInitials(form.name)}</span>
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors shadow-lg"
              >
                <Camera size={16} />
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Full Name *</label>
              <div className="relative">
                <input name="name" value={form.name} onChange={handleChange} required placeholder="John Doe" className={`${inputCls} pl-10`} />
                <UserCheck size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>
            <div>
              <label className={labelCls}>Email *</label>
              <div className="relative">
                <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="john@company.com" className={`${inputCls} pl-10`} />
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>
            <div>
              <label className={labelCls}>{isEdit ? 'New Password' : 'Password *'}</label>
              <div className="relative">
                <input name="password" type={showPw ? 'text' : 'password'} value={form.password} onChange={handleChange}
                  required={!isEdit} placeholder={isEdit ? 'Leave blank to keep' : 'Min. 6 chars'}
                  className={`${inputCls} pl-10 pr-10`} />
                <Shield size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                  {showPw ? '🙈' : '👁'}
                </button>
              </div>
            </div>
            <div>
              <label className={labelCls}>Role *</label>
              <select name="role" value={form.role} onChange={handleChange} className={inputCls}>
                {ROLES.map(r => <option key={r} value={r}>{getRoleLabel(r)}</option>)}
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
            <div>
              <label className={labelCls}>Phone</label>
              <div className="relative">
                <input name="phone" value={form.phone} onChange={handleChange} placeholder="+1-555-0000" className={`${inputCls} pl-10`} />
                <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>
          </div>
          {isEdit && (
            <label className="flex items-center gap-2.5 cursor-pointer p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} className="accent-blue-600 w-4 h-4" />
              <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">Active Account</span>
              <span className="text-xs text-slate-400 dark:text-slate-500 ml-auto">{form.isActive ? 'Member can log in' : 'Login disabled'}</span>
            </label>
          )}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 py-2.5 text-white rounded-xl text-sm font-semibold transition-all disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #2563EB, #3B82F6)' }}>
              {loading ? 'Saving...' : isEdit ? 'Save Changes' : 'Add Member'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Main Team Page ────────────────────────────────────────────────────────────
export default function Team() {
  const [members, setMembers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editMember, setEditMember] = useState(null);
  const [importing, setImporting] = useState(false);
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  const fetchMembers = async () => {
    try {
      const params = {};
      if (search) params.search = search;
      if (roleFilter) params.role = roleFilter;
      const { data } = await api.get('/users', { params });
      // Apply local dept filter since API may not support it
      const filtered = deptFilter ? data.filter(m => {
        const dId = m.department?._id || m.department;
        return dId === deptFilter;
      }) : data;
      setMembers(filtered);
    } catch {
      toast.error('Failed to load team members');
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const { data } = await api.get('/departments');
      setDepartments(data.departments || []);
    } catch {
      // Departments might not be available — that's ok
    }
  };

  useEffect(() => {
    fetchMembers();
    fetchDepartments();
  }, [search, roleFilter, deptFilter]);

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this team member? They will lose access to the system.')) return;
    try {
      await api.delete(`/users/${id}`);
      setMembers(members.filter(m => m._id !== id));
      toast.success('Member removed');
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handleSave = (updated) => {
    setMembers(prev => {
      const idx = prev.findIndex(m => m._id === updated._id);
      if (idx >= 0) {
        const arr = [...prev];
        arr[idx] = updated;
        return arr;
      }
      return [updated, ...prev];
    });
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

  const selectCls = 'px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-700 dark:text-slate-300';

  return (
    <div className="page-enter">
      <Header title="Team" subtitle="Manage your team members and their roles" />
      <div className="p-8">
        {/* Stats banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Members', value: members.length, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-950/30' },
            { label: 'Active', value: activeCount, color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-950/30' },
            { label: 'Admins', value: adminCount, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-950/30' },
            { label: 'Project Managers', value: pmCount, color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-950/30' },
          ].map(stat => (
            <div key={stat.label} className={`rounded-xl p-4 ${stat.bg} border border-transparent`}>
              <p className={`text-2xl font-bold ${stat.color}`} style={{ fontFamily: 'Poppins, sans-serif' }}>{stat.value}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Top bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email..."
              className="w-full pl-11 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400" />
          </div>
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
          {isAdmin && (
            <div className="flex gap-2">
              <button onClick={() => { setEditMember(null); setShowModal(true); }}
                className="flex items-center gap-2 px-5 py-2.5 text-white text-sm font-semibold rounded-xl whitespace-nowrap transition-all"
                style={{ background: 'linear-gradient(135deg, #2563EB, #3B82F6)', boxShadow: '0 4px 12px rgba(37,99,235,0.3)' }}>
                <Plus size={16} /> Add Member
              </button>
              <button onClick={() => handleExport('csv')} title="Export CSV"
                className="flex items-center gap-2 px-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                <Download size={15} /> CSV
              </button>
              <label className="flex items-center gap-2 px-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                <Upload size={15} /> {importing ? 'Importing...' : 'Import'}
                <input type="file" accept=".csv,.xlsx,.xls" onChange={handleImport} disabled={importing} className="hidden" />
              </label>
            </div>
          )}
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60">
                  {['Member', 'Role', 'Department', 'Status', 'Actions'].map(col => (
                    <th key={col} className="text-left px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800/60">
                {loading ? (
                  <tr><td colSpan={5} className="text-center py-12 text-slate-400">Loading team members...</td></tr>
                ) : members.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-12 text-slate-400 dark:text-slate-500">
                    <UserCheck size={40} className="mx-auto mb-3 opacity-30" />
                    <p className="font-medium">No members found</p>
                    <p className="text-xs mt-1">Try adjusting your search or filters</p>
                  </td></tr>
                ) : members.map(m => (
                  <tr key={m._id} className="table-row-hover" onClick={() => navigate(`/users/${m._id}`)}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {m.avatar ? (
                          <img src={`${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}${m.avatar}`} alt={m.name} className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-700" />
                        ) : (
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-semibold ${getAvatarColor(m.role)}`}>
                            {getInitials(m.name)}
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{m.name}</p>
                          <p className="text-xs text-slate-400 dark:text-slate-500">{m.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4"><span className={getRoleClass(m.role)}>{getRoleLabel(m.role)}</span></td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{m.department?.name || '—'}</td>
                    <td className="px-6 py-4">
                      <span className={`badge ${m.isActive !== false ? 'badge-done' : 'badge-urgent'}`}>
                        {m.isActive !== false ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                        <button onClick={() => navigate(`/users/${m._id}`)}
                          className="p-1.5 hover:bg-blue-50 dark:hover:bg-blue-950/20 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-colors" title="View profile">
                          <ChevronRight size={15} />
                        </button>
                        {isAdmin && (
                          <>
                            <button onClick={() => { setEditMember(m); setShowModal(true); }}
                              className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 rounded-lg transition-colors" title="Edit member">
                              <Pencil size={15} />
                            </button>
                            <button onClick={() => handleDelete(m._id)}
                              className="p-1.5 hover:bg-red-50 dark:hover:bg-red-950/20 text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg transition-colors" title="Remove member">
                              <Trash2 size={15} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-3 border-t border-slate-100 dark:border-slate-800 text-sm text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>{members.length} member{members.length !== 1 ? 's' : ''} found</span>
            {(roleFilter || deptFilter || search) && (
              <button onClick={() => { setSearch(''); setRoleFilter(''); setDeptFilter(''); }}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
                <X size={12} /> Clear filters
              </button>
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <MemberModal
          member={editMember}
          onClose={() => { setShowModal(false); setEditMember(null); }}
          onSave={handleSave}
          departments={departments}
        />
      )}
    </div>
  );
}
