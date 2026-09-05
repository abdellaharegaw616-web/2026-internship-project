import { useState, useEffect, useRef } from 'react';
import { User, Lock, Save, Eye, EyeOff, Building, Phone, Mail, Shield, CheckCircle, XCircle, Monitor, LogOut, Globe, Clock, History, Camera, Bell, Palette, Info, AlertTriangle, Trash2 } from 'lucide-react';
import Header from '../components/layout/Header';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { getInitials, getAvatarColor, getRoleLabel } from '../utils/helpers';
import Avatar from '../components/common/Avatar';

const TABS = [
  { key: 'profile', label: 'Profile', icon: User },
  { key: 'password', label: 'Password', icon: Lock },
  { key: '2fa', label: '2FA Security', icon: Shield },
  { key: 'sessions', label: 'Sessions', icon: Monitor },
  { key: 'activity', label: 'Activity', icon: History },
  { key: 'appearance', label: 'Appearance', icon: Palette },
  { key: 'danger', label: 'Danger Zone', icon: AlertTriangle },
];

function formatTimeAgo(date) {
  const secs = Math.floor((new Date() - new Date(date)) / 1000);
  if (secs < 60) return 'Just now';
  if (secs < 3600) return `${Math.floor(secs / 60)} min ago`;
  if (secs < 86400) return `${Math.floor(secs / 3600)} hr ago`;
  return `${Math.floor(secs / 86400)} days ago`;
}

const ACTION_LABELS = {
  login: 'Logged in', logout: 'Logged out', password_change: 'Changed password',
  profile_update: 'Updated profile', '2fa_enabled': 'Enabled 2FA',
  '2fa_disabled': 'Disabled 2FA', session_revoked: 'Revoked session',
  account_deleted: 'Account deleted',
};
const ACTION_COLORS = {
  login: 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/40',
  logout: 'text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800',
  password_change: 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/40',
  profile_update: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40',
  '2fa_enabled': 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/40',
  '2fa_disabled': 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40',
  session_revoked: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40',
  account_deleted: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40',
};

export default function Settings() {
  const { user, updateUser } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const [tab, setTab] = useState('profile');
  const [profile, setProfile] = useState({ name: user?.name || '', department: user?.department || '', phone: user?.phone || '' });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [showPw, setShowPw] = useState({ cur: false, new: false, confirm: false });
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [twoFactorOTP, setTwoFactorOTP] = useState('');
  const [twoFactorStep, setTwoFactorStep] = useState('idle');
  const [sessions, setSessions] = useState([]);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [activityLogs, setActivityLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deletingAccount, setDeletingAccount] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (tab === 'sessions') fetchSessions();
    else if (tab === 'activity') fetchActivityLogs();
  }, [tab]);

  const fetchSessions = async () => {
    setLoadingSessions(true);
    try {
      const { data } = await api.get('/auth/sessions');
      setSessions(data.sessions);
    } catch { toast.error('Failed to load sessions'); }
    finally { setLoadingSessions(false); }
  };

  const fetchActivityLogs = async () => {
    setLoadingLogs(true);
    try {
      const { data } = await api.get('/auth/activity-logs?limit=20');
      setActivityLogs(data.logs);
    } catch { toast.error('Failed to load activity logs'); }
    finally { setLoadingLogs(false); }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    console.log('File selected:', file);
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    setUploadingAvatar(true);
    const formData = new FormData();
    formData.append('avatar', file);
    
    console.log('Uploading avatar...');
    try {
      const { data } = await api.post('/auth/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      console.log('Upload response:', data);
      updateUser(data.user);
      toast.success('Avatar updated!');
    } catch (err) {
      console.error('Upload error:', err);
      toast.error(err.response?.data?.message || 'Failed to upload avatar');
    } finally {
      setUploadingAvatar(false);
      if (fileInputRef) fileInputRef.value = '';
    }
  };

  const handleRevokeSession = async (sessionId) => {
    try {
      await api.delete(`/auth/sessions/${sessionId}`);
      toast.success('Session revoked');
      fetchSessions();
    } catch { toast.error('Failed to revoke session'); }
  };

  const handleRevokeAllSessions = async () => {
    if (!window.confirm('Revoke all other sessions?')) return;
    try {
      await api.post('/auth/sessions/revoke-all');
      toast.success('All other sessions revoked');
      fetchSessions();
    } catch { toast.error('Failed to revoke sessions'); }
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.put('/auth/profile', profile);
      updateUser(data.user);
      toast.success('Profile updated!');
    } catch { toast.error('Failed to update profile'); }
    finally { setSaving(false); }
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) return toast.error('Passwords do not match');
    if (passwords.newPassword.length < 6) return toast.error('Password must be at least 6 characters');
    setSaving(true);
    try {
      await api.put('/auth/change-password', { currentPassword: passwords.currentPassword, newPassword: passwords.newPassword });
      toast.success('Password changed successfully!');
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally { setSaving(false); }
  };

  const handleGenerate2FAOTP = async () => {
    setSaving(true);
    try {
      await api.post('/auth/2fa/generate');
      setTwoFactorStep('verify');
      toast.success('OTP sent to your email');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to send OTP'); }
    finally { setSaving(false); }
  };

  const handleVerify2FAOTP = async () => {
    setSaving(true);
    try {
      await api.post('/auth/2fa/verify', { otp: twoFactorOTP });
      setTwoFactorStep('enabled');
      setTwoFactorOTP('');
      toast.success('Two-Factor Authentication enabled!');
      updateUser({ ...user, twoFactorEnabled: true });
    } catch (err) { toast.error(err.response?.data?.message || 'Invalid OTP'); }
    finally { setSaving(false); }
  };

  const handleDisable2FA = async () => {
    if (!window.confirm('Disable Two-Factor Authentication?')) return;
    setSaving(true);
    try {
      await api.post('/auth/2fa/disable');
      setTwoFactorStep('idle');
      toast.success('Two-Factor Authentication disabled');
      updateUser({ ...user, twoFactorEnabled: false });
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to disable 2FA'); }
    finally { setSaving(false); }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) return toast.error('Please enter your password');
    if (!window.confirm('Are you sure you want to permanently delete your account? This action cannot be undone.')) return;
    if (!window.confirm('This will delete all your data including projects, tasks, and activity logs. Are you absolutely sure?')) return;

    setDeletingAccount(true);
    try {
      await api.delete('/auth/delete-account', { data: { password: deletePassword } });
      toast.success('Account deleted successfully');
      setTimeout(() => {
        window.location.href = '/login';
      }, 1000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete account');
    } finally {
      setDeletingAccount(false);
      setDeletePassword('');
    }
  };

  const cardCls = 'bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6';
  const inputCls = 'w-full pl-11 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400';
  const labelCls = 'block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5';
  const sectionTitle = 'text-base font-semibold text-slate-800 dark:text-slate-100 mb-5';

  return (
    <div className="page-enter">
      <Header title="Settings" subtitle="Manage your account and preferences" />
      <div className="p-8 max-w-3xl">
        {/* Profile Banner */}
        <div className={`${cardCls} mb-6`}>
          <div className="flex items-center gap-5">
            <div className="relative">
              <Avatar user={user} className="w-16 h-16 rounded-2xl text-xl" />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingAvatar}
                className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 hover:bg-blue-700 transition-colors disabled:opacity-50"
                title="Change avatar"
              >
                {uploadingAvatar ? (
                  <div className="animate-spin h-3 w-3 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <Camera size={11} className="text-white" />
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100" style={{ fontFamily: 'Poppins, sans-serif' }}>{user?.name}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">{user?.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="badge badge-pm">{getRoleLabel(user?.role)}</span>
                {user?.twoFactorEnabled && (
                  <span className="badge badge-done text-xs">2FA Active</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl overflow-x-auto">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button key={key} onClick={() => setTab(key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap flex-shrink-0 ${
                tab === key ? 'bg-white dark:bg-slate-900 text-blue-700 dark:text-blue-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
              }`}>
              <Icon size={14} /> {label}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {tab === 'profile' && (
          <div className={cardCls}>
            <h3 className={sectionTitle}>Personal Information</h3>
            <form onSubmit={handleProfileSave} className="space-y-4">
              <div>
                <label className={labelCls}>Full Name</label>
                <div className="relative">
                  <User size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })}
                    placeholder="Your full name" className={inputCls} />
                </div>
              </div>
              <div>
                <label className={labelCls}>Email Address</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input value={user?.email} disabled
                    className="w-full pl-11 pr-4 py-2.5 bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-400 dark:text-slate-500 cursor-not-allowed" />
                </div>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1.5 flex items-center gap-1">
                  <Info size={11} /> Email cannot be changed for security reasons.
                </p>
              </div>
              <div>
                <label className={labelCls}>Department</label>
                <div className="relative">
                  <Building size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input value={profile.department} onChange={e => setProfile({ ...profile, department: e.target.value })}
                    placeholder="e.g. Frontend Team" className={inputCls} />
                </div>
              </div>
              <div>
                <label className={labelCls}>Phone</label>
                <div className="relative">
                  <Phone size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input value={profile.phone} onChange={e => setProfile({ ...profile, phone: e.target.value })}
                    placeholder="+1-555-0000" className={inputCls} />
                </div>
              </div>
              <button type="submit" disabled={saving}
                className="flex items-center gap-2 px-6 py-2.5 text-white rounded-xl text-sm font-semibold transition-all disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, #2563EB, #3B82F6)' }}>
                <Save size={15} /> {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        )}

        {/* Password Tab */}
        {tab === 'password' && (
          <div className={cardCls}>
            <h3 className={sectionTitle}>Change Password</h3>
            <form onSubmit={handlePasswordSave} className="space-y-4">
              {[
                { key: 'currentPassword', label: 'Current Password', showKey: 'cur' },
                { key: 'newPassword', label: 'New Password', showKey: 'new' },
                { key: 'confirmPassword', label: 'Confirm New Password', showKey: 'confirm' },
              ].map(({ key, label, showKey }) => (
                <div key={key}>
                  <label className={labelCls}>{label}</label>
                  <div className="relative">
                    <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type={showPw[showKey] ? 'text' : 'password'}
                      value={passwords[key]} onChange={e => setPasswords({ ...passwords, [key]: e.target.value })}
                      placeholder="••••••••" required minLength={6}
                      className="w-full pl-11 pr-11 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-200" />
                    <button type="button" onClick={() => setShowPw(p => ({ ...p, [showKey]: !p[showKey] }))}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                      {showPw[showKey] ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
              ))}
              <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 rounded-xl p-3 text-xs text-blue-700 dark:text-blue-400">
                Password must be at least 6 characters. Use a strong, unique password.
              </div>
              <button type="submit" disabled={saving}
                className="flex items-center gap-2 px-6 py-2.5 text-white rounded-xl text-sm font-semibold disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, #2563EB, #3B82F6)' }}>
                <Save size={15} /> {saving ? 'Changing...' : 'Change Password'}
              </button>
            </form>
          </div>
        )}

        {/* 2FA Tab */}
        {tab === '2fa' && (
          <div className={cardCls}>
            <h3 className={sectionTitle}>Two-Factor Authentication</h3>
            {user?.twoFactorEnabled || twoFactorStep === 'enabled' ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900/50 rounded-xl">
                  <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-950/60 flex items-center justify-center flex-shrink-0">
                    <CheckCircle size={22} className="text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-green-800 dark:text-green-300">2FA is Enabled</p>
                    <p className="text-sm text-green-600 dark:text-green-400 mt-0.5">Your account is protected with two-factor authentication</p>
                  </div>
                </div>
                <button onClick={handleDisable2FA} disabled={saving}
                  className="flex items-center gap-2 px-4 py-2.5 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-xl text-sm font-medium hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors disabled:opacity-50">
                  <XCircle size={16} /> {saving ? 'Disabling...' : 'Disable 2FA'}
                </button>
              </div>
            ) : twoFactorStep === 'verify' ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 rounded-xl">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/60 flex items-center justify-center flex-shrink-0">
                    <Mail size={22} className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-blue-800 dark:text-blue-300">Check Your Email</p>
                    <p className="text-sm text-blue-600 dark:text-blue-400 mt-0.5">Enter the 6-digit OTP sent to {user?.email}</p>
                  </div>
                </div>
                <div>
                  <label className={labelCls}>OTP Code</label>
                  <input type="text" value={twoFactorOTP}
                    onChange={e => setTwoFactorOTP(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="123456" maxLength={6}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-lg text-center tracking-[0.5em] font-mono text-slate-800 dark:text-slate-200" />
                </div>
                <div className="flex gap-2">
                  <button onClick={handleVerify2FAOTP} disabled={saving || twoFactorOTP.length !== 6}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-white rounded-xl text-sm font-medium disabled:opacity-50"
                    style={{ background: 'linear-gradient(135deg, #2563EB, #3B82F6)' }}>
                    <CheckCircle size={16} /> {saving ? 'Verifying...' : 'Verify & Enable'}
                  </button>
                  <button onClick={() => { setTwoFactorStep('idle'); setTwoFactorOTP(''); }}
                    className="px-4 py-2.5 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
                  <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
                    <Shield size={22} className="text-slate-500 dark:text-slate-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-slate-100">2FA is Disabled</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Enable two-factor authentication for extra security</p>
                  </div>
                </div>
                <button onClick={handleGenerate2FAOTP} disabled={saving}
                  className="flex items-center gap-2 px-4 py-2.5 text-white rounded-xl text-sm font-medium disabled:opacity-50"
                  style={{ background: 'linear-gradient(135deg, #2563EB, #3B82F6)' }}>
                  <Shield size={16} /> {saving ? 'Sending OTP...' : 'Enable 2FA'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Sessions Tab */}
        {tab === 'sessions' && (
          <div className={cardCls}>
            <div className="flex items-center justify-between mb-5">
              <h3 className={sectionTitle} style={{ marginBottom: 0 }}>Active Sessions</h3>
              {sessions.length > 1 && (
                <button onClick={handleRevokeAllSessions}
                  className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium transition-colors">
                  Revoke All Others
                </button>
              )}
            </div>
            {loadingSessions ? (
              <div className="text-center py-10 text-slate-400 dark:text-slate-500">Loading sessions...</div>
            ) : sessions.length === 0 ? (
              <div className="text-center py-10 text-slate-400 dark:text-slate-500">
                <Monitor size={36} className="mx-auto mb-2 opacity-40" />
                <p>No active sessions</p>
              </div>
            ) : (
              <div className="space-y-3">
                {sessions.map(session => (
                  <div key={session._id}
                    className={`p-4 rounded-xl border ${session.isCurrent ? 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900/50' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${session.isCurrent ? 'bg-blue-100 dark:bg-blue-950/60' : 'bg-slate-200 dark:bg-slate-700'}`}>
                          <Monitor size={20} className={session.isCurrent ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-medium text-slate-800 dark:text-slate-100 text-sm">{session.device} · {session.browser}</p>
                            {session.isCurrent && (
                              <span className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 rounded-full font-medium">Current</span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                            <span className="flex items-center gap-1"><Globe size={12} /> {session.os}</span>
                            <span className="flex items-center gap-1"><Clock size={12} /> {formatTimeAgo(session.lastActivity)}</span>
                          </div>
                          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">IP: {session.ipAddress}</p>
                        </div>
                      </div>
                      {!session.isCurrent && (
                        <button onClick={() => handleRevokeSession(session._id)}
                          className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors" title="Revoke">
                          <LogOut size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Activity Tab */}
        {tab === 'activity' && (
          <div className={cardCls}>
            <h3 className={sectionTitle}>Activity Log</h3>
            {loadingLogs ? (
              <div className="text-center py-10 text-slate-400 dark:text-slate-500">Loading activity logs...</div>
            ) : activityLogs.length === 0 ? (
              <div className="text-center py-10 text-slate-400 dark:text-slate-500">
                <History size={36} className="mx-auto mb-2 opacity-40" />
                <p>No activity recorded</p>
              </div>
            ) : (
              <div className="space-y-2">
                {activityLogs.map(log => (
                  <div key={log._id} className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                    <div className={`p-2 rounded-lg flex-shrink-0 ${ACTION_COLORS[log.action] || 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-700'}`}>
                      <History size={15} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium text-slate-800 dark:text-slate-100 text-sm">{ACTION_LABELS[log.action] || log.action}</p>
                        <span className="text-xs text-slate-400 dark:text-slate-500">{formatTimeAgo(log.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
                        {log.device && <span>{log.device}</span>}
                        {log.browser && <span>· {log.browser}</span>}
                        {log.ipAddress && <span>· {log.ipAddress}</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Appearance Tab */}
        {tab === 'appearance' && (
          <div className={cardCls}>
            <h3 className={sectionTitle}>Appearance</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${darkMode ? 'bg-slate-700' : 'bg-blue-50'}`}>
                    <Palette size={20} className={darkMode ? 'text-slate-300' : 'text-blue-600'} />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-slate-100 text-sm">Theme</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{darkMode ? 'Dark mode is active' : 'Light mode is active'}</p>
                  </div>
                </div>
                <button onClick={toggleDarkMode}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${darkMode ? 'bg-blue-600' : 'bg-slate-200'}`}>
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${darkMode ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center">
                    <Bell size={20} className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-slate-100 text-sm">Notifications</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Configure your notification preferences</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {[
                    { label: 'Task assignments', desc: 'Notify when a task is assigned to you' },
                    { label: 'Due date reminders', desc: 'Notify before task due dates' },
                    { label: 'Project updates', desc: 'Notify on project status changes' },
                  ].map(pref => (
                    <label key={pref.label} className="flex items-center gap-3 p-2 hover:bg-slate-100 dark:hover:bg-slate-700/60 rounded-lg cursor-pointer transition-colors">
                      <input type="checkbox" defaultChecked className="accent-blue-600 w-4 h-4" />
                      <div>
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{pref.label}</p>
                        <p className="text-xs text-slate-400 dark:text-slate-500">{pref.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Danger Zone Tab */}
        {tab === 'danger' && (
          <div className={cardCls}>
            <h3 className={sectionTitle}>Danger Zone</h3>
            <div className="p-4 bg-red-50 dark:bg-red-950/20 border-2 border-red-200 dark:border-red-900/50 rounded-xl">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-950/60 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle size={24} className="text-red-600 dark:text-red-400" />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-red-900 dark:text-red-300 mb-2">Delete Account Permanently</h4>
                  <p className="text-sm text-red-700 dark:text-red-400 mb-4">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                  <ul className="text-sm text-red-700 dark:text-red-400 mb-4 space-y-1">
                    <li>• All your personal data will be permanently deleted</li>
                    <li>• Your projects and tasks will be removed</li>
                    <li>• Activity logs will be erased</li>
                    <li>• You will be logged out from all devices</li>
                  </ul>
                  {user?.role === 'SuperAdmin' && (
                    <div className="p-3 bg-red-100 dark:bg-red-950/40 border border-red-300 dark:border-red-800 rounded-lg mb-4">
                      <p className="text-sm font-semibold text-red-800 dark:text-red-300">
                        ⚠️ SuperAdmin accounts cannot be deleted directly. Transfer the SuperAdmin role to another user first.
                      </p>
                    </div>
                  )}
                  <div className="space-y-3">
                    <div>
                      <label className={labelCls}>Confirm with password</label>
                      <div className="relative">
                        <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="password"
                          value={deletePassword}
                          onChange={(e) => setDeletePassword(e.target.value)}
                          placeholder="Enter your password to confirm"
                          disabled={user?.role === 'SuperAdmin' || deletingAccount}
                          className="w-full pl-11 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-red-300 dark:border-red-800 rounded-xl text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                      </div>
                    </div>
                    <button
                      onClick={handleDeleteAccount}
                      disabled={user?.role === 'SuperAdmin' || deletingAccount || !deletePassword}
                      className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Trash2 size={16} />
                      {deletingAccount ? 'Deleting Account...' : 'Delete My Account Permanently'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
