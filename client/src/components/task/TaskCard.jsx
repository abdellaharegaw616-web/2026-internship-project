import React from 'react';
import { getTaskStatusClass, getPriorityClass, formatDate, isOverdue, getDaysRemaining } from '../../utils/helpers';
import { Calendar, Clock, User, Edit, Trash2, MessageSquare } from 'lucide-react';

const TaskCard = ({ task, onEdit, onDelete, onClick }) => {
  const isTaskOverdue = isOverdue(task.dueDate, task.status);
  const daysRemaining = getDaysRemaining(task.dueDate);

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">{task.title}</h3>
          <p className="text-xs text-gray-500">{task.project?.name || 'No project'}</p>
        </div>
        <div className="flex gap-1 ml-2">
          <button
            onClick={(e) => { e.stopPropagation(); onEdit && onEdit(task); }}
            className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
            title="Edit"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete && onDelete(task); }}
            className="p-1.5 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTaskStatusClass(task.status)}`}>
          {task.status}
        </span>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityClass(task.priority)}`}>
          {task.priority}
        </span>
      </div>

      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{task.description}</p>

      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2 text-gray-600">
          <User size={14} />
          <span>{task.assignedTo?.name || 'Unassigned'}</span>
        </div>
        <div className={`flex items-center gap-2 ${isTaskOverdue ? 'text-red-600' : 'text-gray-600'}`}>
          <Calendar size={14} />
          <span>{formatDate(task.dueDate)}</span>
        </div>
        {task.estimatedHours && (
          <div className="flex items-center gap-2 text-gray-600">
            <Clock size={14} />
            <span>{task.estimatedHours}h estimated</span>
          </div>
        )}
      </div>

      {daysRemaining !== null && task.status !== 'Done' && (
        <div className={`mt-3 text-xs ${isTaskOverdue ? 'text-red-600' : daysRemaining <= 3 ? 'text-orange-600' : 'text-gray-500'}`}>
          {isTaskOverdue ? `Overdue by ${Math.abs(daysRemaining)} days` : daysRemaining === 0 ? 'Due today' : `${daysRemaining} days remaining`}
        </div>
      )}

      {task.comments?.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-500">
          <MessageSquare size={14} />
          <span>{task.comments.length} comment{task.comments.length > 1 ? 's' : ''}</span>
        </div>
      )}
    </div>
  );
};

export default TaskCard;
