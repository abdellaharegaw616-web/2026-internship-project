import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, Building, Calendar, Award, CheckSquare, Clock, Target } from 'lucide-react';
import Header from '../components/layout/Header';
import api from '../api/axios';
import { getInitials, getAvatarColor, getRoleLabel, getRoleClass, getProjectStatusClass, getTaskStatusClass, getPriorityClass, formatDate } from '../utils/helpers';
import toast from 'react-hot-toast';

function CircleProgress({ value }) {
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  return (
    <div className="relative w-24 h-24 flex items-center justify-center">
      <svg width="96" height="96" className="-rotate-90">
        <circle cx="48" cy="48" r={radius} fill="none" stroke="#DBEAFE" strokeWidth="8" />
        <circle cx="48" cy="48" r={radius} fill="none" stroke="#2563EB" strokeWidth="8"
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s ease' }} />
      </svg>
      <span className="absolute text-xl font-bold text-blue-600" style={{ fontFamily: 'Poppins, sans-serif' }}>{value}%</span>
    </div>
  );
}

export default function MemberProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/users/${id}`)
      .then(({ data }) => setData(data))
      .catch(() => toast.error('Failed to load profile'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="p-8">
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    </div>
  );

  if (!data) return (
    <div className="p-8 text-center text-slate-500">Member not found</div>
  );

  const { member, stats, assignedProjects, recentTasks } = data;

  if (!member) return (
    <div className="p-8 text-center text-slate-500">Member data not available</div>
  );

  return (
    <div className="page-enter">
      <Header title="Member Profile" subtitle={member?.name ? `${member.name}'s performance overview` : 'Member performance overview'} />
      <div className="p-8 space-y-6">
        {/* Back */}
        <button onClick={() => navigate('/users')}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors">
          <ArrowLeft size={16} /> Back to Team
        </button>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {member.avatar ? (
              <img src={`${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}${member.avatar}`} alt={member.name} className="w-20 h-20 rounded-2xl object-cover" />
            ) : (
              <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-white text-2xl font-bold ${getAvatarColor(member.role)}`}>
                {getInitials(member.name)}
              </div>
            )}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold text-slate-800" style={{ fontFamily: 'Poppins, sans-serif' }}>{member.name}</h2>
                <span className={getRoleClass(member.role)}>{getRoleLabel(member.role)}</span>
                <span className={`badge ${member.isActive ? 'badge-done' : 'badge-urgent'}`}>
                  {member.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Mail size={14} className="text-blue-500" />
                  {member.email}
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Phone size={14} className="text-blue-500" />
                  {member.phone || '—'}
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Building size={14} className="text-blue-500" />
                  {member.department || '—'}
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Calendar size={14} className="text-blue-500" />
                  Joined {formatDate(member.createdAt)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { label: 'Assigned Tasks', value: stats.assignedTasks, icon: Target, color: 'text-blue-600 bg-blue-50' },
            { label: 'Completed Tasks', value: stats.completedTasks, icon: CheckSquare, color: 'text-green-600 bg-green-50' },
            { label: 'Pending Tasks', value: stats.pendingTasks, icon: Clock, color: 'text-orange-600 bg-orange-50' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 card-hover">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
                <Icon size={18} />
              </div>
              <p className="text-2xl font-bold text-slate-800" style={{ fontFamily: 'Poppins, sans-serif' }}>{value}</p>
              <p className="text-xs text-slate-500 mt-1">{label}</p>
            </div>
          ))}

          {/* Performance Score */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 card-hover flex flex-col items-center justify-center text-center">
            <CircleProgress value={stats.performance} />
            <div className="flex items-center gap-1 mt-2">
              <Award size={14} className="text-blue-500" />
              <p className="text-xs text-slate-500">Performance Score</p>
            </div>
          </div>
        </div>

        {/* Projects & Tasks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Assigned Projects */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100">
              <h3 className="font-semibold text-slate-800" style={{ fontFamily: 'Poppins, sans-serif' }}>Assigned Projects</h3>
            </div>
            <div className="divide-y divide-slate-50">
              {assignedProjects.length === 0 ? (
                <div className="p-6 text-center text-sm text-slate-400">No projects assigned</div>
              ) : assignedProjects.map(p => (
                <div key={p._id} className="flex items-center justify-between px-5 py-3">
                  <p className="text-sm font-medium text-slate-800">{p.title}</p>
                  <span className={getProjectStatusClass(p.status)}>{p.status}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Tasks */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100">
              <h3 className="font-semibold text-slate-800" style={{ fontFamily: 'Poppins, sans-serif' }}>Recent Tasks</h3>
            </div>
            <div className="divide-y divide-slate-50">
              {recentTasks.length === 0 ? (
                <div className="p-6 text-center text-sm text-slate-400">No tasks found</div>
              ) : recentTasks.map(t => (
                <div key={t._id} className="flex items-center justify-between px-5 py-3 gap-3">
                  <p className="text-sm font-medium text-slate-800 truncate flex-1">{t.title}</p>
                  <span className={getPriorityClass(t.priority)}>{t.priority}</span>
                  <span className={getTaskStatusClass(t.status)}>{t.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
