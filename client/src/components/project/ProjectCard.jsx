import React from 'react';
import { getProjectStatusClass, formatDate, getDaysRemaining } from '../../utils/helpers';
import { Calendar, Users, TrendingUp, Edit, Trash2 } from 'lucide-react';

const ProjectCard = ({ project, onEdit, onDelete, onClick }) => {
  const daysRemaining = getDaysRemaining(project.endDate);
  const isOverdue = daysRemaining !== null && daysRemaining < 0;

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 text-lg mb-1">{project.name}</h3>
          <p className="text-sm text-gray-500 line-clamp-2">{project.description}</p>
        </div>
        <div className="flex gap-1 ml-2">
          <button
            onClick={(e) => { e.stopPropagation(); onEdit && onEdit(project); }}
            className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
            title="Edit"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete && onDelete(project); }}
            className="p-1.5 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getProjectStatusClass(project.status)}`}>
          {project.status}
        </span>
        <span className="text-xs text-gray-500">•</span>
        <span className="text-xs text-gray-500">{project.priority}</span>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Progress</span>
          <span className="font-medium text-gray-900">{project.progress || 0}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{ width: `${project.progress || 0}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="flex items-center gap-2 text-gray-600">
          <Users size={14} />
          <span>{project.team?.name || 'No team'}</span>
        </div>
        <div className={`flex items-center gap-2 ${isOverdue ? 'text-red-600' : 'text-gray-600'}`}>
          <Calendar size={14} />
          <span>{formatDate(project.endDate)}</span>
        </div>
      </div>

      {daysRemaining !== null && (
        <div className={`mt-3 text-xs ${isOverdue ? 'text-red-600' : daysRemaining <= 7 ? 'text-orange-600' : 'text-gray-500'}`}>
          {isOverdue ? `Overdue by ${Math.abs(daysRemaining)} days` : daysRemaining === 0 ? 'Due today' : `${daysRemaining} days remaining`}
        </div>
      )}
    </div>
  );
};

export default ProjectCard;
