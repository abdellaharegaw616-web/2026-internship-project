import { useState, useEffect } from 'react';
import { Award, Plus, Search, AlertTriangle, Trash2, Edit, TrendingUp, BookOpen, Languages, GraduationCap, MoreHorizontal } from 'lucide-react';
import Header from '../components/layout/Header';
import api from '../api/axios';
import toast from 'react-hot-toast';
import Modal from '../components/common/Modal';
import { useAuth } from '../context/AuthContext';

export default function Skills() {
  const { user } = useAuth();
  const [skills, setSkills] = useState([]);
  const [stats, setStats] = useState(null);
  const [expiring, setExpiring] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [certificationFilter, setCertificationFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Technical',
    proficiency: 'Intermediate',
    isCertification: false,
    issuer: '',
    issueDate: '',
    expiryDate: '',
    credentialId: '',
    credentialUrl: '',
    notes: '',
  });
  const [saving, setSaving] = useState(false);

  const isAdmin = user?.role === 'Admin' || user?.role === 'ProjectManager';

  useEffect(() => {
    fetchSkills();
    fetchStats();
    fetchExpiring();
  }, [categoryFilter, certificationFilter]);

  const fetchSkills = async () => {
    setLoading(true);
    try {
      const params = {};
      if (categoryFilter) params.category = categoryFilter;
      if (certificationFilter !== '') params.isCertification = certificationFilter;
      const { data } = await api.get('/skills', { params });
      setSkills(data.skills);
    } catch (err) {
      toast.error('Failed to load skills');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const { data } = await api.get('/skills/stats');
      setStats(data.stats);
    } catch (err) {
      console.error('Failed to load stats');
    }
  };

  const fetchExpiring = async () => {
    try {
      const { data } = await api.get('/skills/expiring');
      setExpiring(data.skills);
    } catch (err) {
      console.error('Failed to load expiring certifications');
    }
  };

  const handleAdd = () => {
    setSelectedSkill(null);
    setFormData({
      name: '',
      category: 'Technical',
      proficiency: 'Intermediate',
      isCertification: false,
      issuer: '',
      issueDate: '',
      expiryDate: '',
      credentialId: '',
      credentialUrl: '',
      notes: '',
    });
    setIsModalOpen(true);
  };

  const handleEdit = (skill) => {
    setSelectedSkill(skill);
    setFormData({
      name: skill.name,
      category: skill.category,
      proficiency: skill.proficiency,
      isCertification: skill.isCertification,
      issuer: skill.issuer || '',
      issueDate: skill.issueDate ? skill.issueDate.split('T')[0] : '',
      expiryDate: skill.expiryDate ? skill.expiryDate.split('T')[0] : '',
      credentialId: skill.credentialId || '',
      credentialUrl: skill.credentialUrl || '',
      notes: skill.notes || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (selectedSkill) {
        await api.put(`/skills/${selectedSkill._id}`, formData);
        toast.success('Skill updated successfully');
      } else {
        await api.post('/skills', formData);
        toast.success('Skill added successfully');
      }
      setIsModalOpen(false);
      fetchSkills();
      fetchStats();
      fetchExpiring();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save skill');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this skill?')) return;
    try {
      await api.delete(`/skills/${id}`);
      toast.success('Skill deleted');
      fetchSkills();
      fetchStats();
      fetchExpiring();
    } catch (err) {
      toast.error('Failed to delete skill');
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      Technical: TrendingUp,
      'Soft Skills': BookOpen,
      Language: Languages,
      Certification: Award,
      Other: GraduationCap,
    };
    return icons[category] || GraduationCap;
  };

  const getCategoryColor = (category) => {
    const colors = {
      Technical: 'bg-blue-100 text-blue-600',
      'Soft Skills': 'bg-purple-100 text-purple-600',
      Language: 'bg-green-100 text-green-600',
      Certification: 'bg-orange-100 text-orange-600',
      Other: 'bg-slate-100 text-slate-600',
    };
    return colors[category] || 'bg-slate-100 text-slate-600';
  };

  const getProficiencyColor = (proficiency) => {
    const colors = {
      Beginner: 'bg-slate-100 text-slate-600',
      Intermediate: 'bg-blue-100 text-blue-600',
      Advanced: 'bg-green-100 text-green-600',
      Expert: 'bg-purple-100 text-purple-600',
    };
    return colors[proficiency] || 'bg-slate-100 text-slate-600';
  };

  const isExpiringSoon = (expiryDate) => {
    if (!expiryDate) return false;
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  };

  const isExpired = (expiryDate) => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  };

  const filteredSkills = skills.filter(skill => {
    const searchLower = searchTerm.toLowerCase();
    return (
      skill.name.toLowerCase().includes(searchLower) ||
      skill.category.toLowerCase().includes(searchLower) ||
      skill.issuer?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="page-enter">
      <Header title="Skills & Certifications" subtitle="Manage your skillset and track certification expiry" />
      <div className="p-8">
        {/* Expiring Certifications Alert */}
        {expiring.length > 0 && (
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 mb-6">
            <div className="flex items-center gap-3">
              <AlertTriangle size={24} className="text-orange-600" />
              <div className="flex-1">
                <p className="font-semibold text-orange-800">
                  {expiring.length} certification{expiring.length > 1 ? 's' : ''} expiring soon
                </p>
                <p className="text-sm text-orange-600">
                  {expiring.map(s => s.name).join(', ')}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
            <div className="bg-white rounded-2xl border border-slate-100 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Award size={20} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
                  <p className="text-xs text-slate-500">Total Skills</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                  <GraduationCap size={20} className="text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-800">{stats.certifications}</p>
                  <p className="text-xs text-slate-500">Certifications</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <TrendingUp size={20} className="text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-800">{stats.technical}</p>
                  <p className="text-xs text-slate-500">Technical</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                  <BookOpen size={20} className="text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-800">{stats.softSkills}</p>
                  <p className="text-xs text-slate-500">Soft Skills</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <Languages size={20} className="text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-800">{stats.languages}</p>
                  <p className="text-xs text-slate-500">Languages</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                  <AlertTriangle size={20} className="text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-800">{stats.expiringSoon}</p>
                  <p className="text-xs text-slate-500">Expiring Soon</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
          >
            <option value="">All Categories</option>
            <option value="Technical">Technical</option>
            <option value="Soft Skills">Soft Skills</option>
            <option value="Language">Language</option>
            <option value="Certification">Certification</option>
            <option value="Other">Other</option>
          </select>
          <select
            value={certificationFilter}
            onChange={(e) => setCertificationFilter(e.target.value)}
            className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
          >
            <option value="">All Types</option>
            <option value="true">Certifications Only</option>
            <option value="false">Skills Only</option>
          </select>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <Plus size={18} /> Add Skill
          </button>
        </div>

        {/* Skills Grid */}
        {loading ? (
          <div className="text-center py-12 text-slate-500">Loading skills...</div>
        ) : filteredSkills.length === 0 ? (
          <div className="text-center py-12 text-slate-500">No skills found</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSkills.map((skill) => {
              const CategoryIcon = getCategoryIcon(skill.category);
              const expiring = isExpiringSoon(skill.expiryDate);
              const expired = isExpired(skill.expiryDate);

              return (
                <div
                  key={skill._id}
                  className={`bg-white rounded-2xl border p-4 hover:shadow-md transition-shadow ${
                    expired ? 'border-red-200 bg-red-50' : expiring ? 'border-orange-200 bg-orange-50' : 'border-slate-100'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${getCategoryColor(skill.category)}`}>
                      <CategoryIcon size={20} />
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleEdit(skill)}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(skill._id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <h3 className="font-semibold text-slate-800 mb-1">{skill.name}</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(skill.category)}`}>
                      {skill.category}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getProficiencyColor(skill.proficiency)}`}>
                      {skill.proficiency}
                    </span>
                  </div>
                  {skill.isCertification && (
                    <div className="space-y-1 text-xs text-slate-500">
                      {skill.issuer && <p>Issuer: {skill.issuer}</p>}
                      {skill.issueDate && <p>Issued: {new Date(skill.issueDate).toLocaleDateString()}</p>}
                      {skill.expiryDate && (
                        <p className={expired ? 'text-red-600 font-medium' : expiring ? 'text-orange-600 font-medium' : ''}>
                          {expired ? 'Expired: ' : expiring ? 'Expiring: ' : 'Expires: '}
                          {new Date(skill.expiryDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={selectedSkill ? 'Edit Skill' : 'Add Skill'}
          size="md"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Skill Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. JavaScript, PMP Certification"
                required
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                >
                  <option value="Technical">Technical</option>
                  <option value="Soft Skills">Soft Skills</option>
                  <option value="Language">Language</option>
                  <option value="Certification">Certification</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Proficiency</label>
                <select
                  value={formData.proficiency}
                  onChange={(e) => setFormData({ ...formData, proficiency: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isCertification"
                checked={formData.isCertification}
                onChange={(e) => setFormData({ ...formData, isCertification: e.target.checked })}
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="isCertification" className="text-sm font-medium text-slate-700">
                This is a certification
              </label>
            </div>
            {formData.isCertification && (
              <div className="space-y-4 border-t border-slate-200 pt-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Issuer</label>
                  <input
                    type="text"
                    value={formData.issuer}
                    onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                    placeholder="e.g. Google, AWS, PMI"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Issue Date</label>
                    <input
                      type="date"
                      value={formData.issueDate}
                      onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Expiry Date</label>
                    <input
                      type="date"
                      value={formData.expiryDate}
                      onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Credential ID</label>
                  <input
                    type="text"
                    value={formData.credentialId}
                    onChange={(e) => setFormData({ ...formData, credentialId: e.target.value })}
                    placeholder="e.g. AWS-12345678"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Credential URL</label>
                  <input
                    type="url"
                    value={formData.credentialUrl}
                    onChange={(e) => setFormData({ ...formData, credentialUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Additional notes..."
                rows={2}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm resize-none"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {saving ? 'Saving...' : selectedSkill ? 'Update' : 'Add'}
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
}
