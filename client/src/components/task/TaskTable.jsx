import React from 'react';
import Table from '../common/Table';
import { getTaskStatusClass, getPriorityClass, formatDate, isOverdue } from '../../utils/helpers';
import { Edit, Trash2, Eye } from 'lucide-react';

const TaskTable = ({ tasks, onEdit, onDelete, onView }) => {
  const columns = [
    {
      key: 'title',
      label: 'Task',
      render: (value, row) => (
        <div>
          <p className="font-medium text-gray-900">{value}</p>
          <p className="text-xs text-gray-500">{row.project?.name || 'No project'}</p>
        </div>
      )
    },
    {
      key: 'assignedTo',
      label: 'Assigned To',
      render: (value) => value?.name || '—'
    },
    {
      key: 'priority',
      label: 'Priority',
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityClass(value)}`}>
          {value}
        </span>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTaskStatusClass(value)}`}>
          {value}
        </span>
      )
    },
    {
      key: 'dueDate',
      label: 'Due Date',
      render: (value, row) => (
        <span className={isOverdue(value, row.status) ? 'text-red-600 font-medium' : ''}>
          {formatDate(value)}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => onView && onView(row)}
            className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
            title="View"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={() => onEdit && onEdit(row)}
            className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
            title="Edit"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => onDelete && onDelete(row)}
            className="p-1.5 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )
    }
  ];

  return <Table columns={columns} data={tasks} emptyMessage="No tasks found" />;
};

export default TaskTable;
