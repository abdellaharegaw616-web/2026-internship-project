import React from 'react';
import Table from '../common/Table';
import { getProjectStatusClass, formatDate } from '../../utils/helpers';
import { Edit, Trash2, Eye } from 'lucide-react';

const ProjectTable = ({ projects, onEdit, onDelete, onView }) => {
  const columns = [
    {
      key: 'name',
      label: 'Project',
      render: (value, row) => (
        <div>
          <p className="font-medium text-gray-900">{value}</p>
          <p className="text-xs text-gray-500">{row.description?.substring(0, 50)}...</p>
        </div>
      )
    },
    {
      key: 'team',
      label: 'Team',
      render: (value) => value?.name || '—'
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getProjectStatusClass(value)}`}>
          {value}
        </span>
      )
    },
    {
      key: 'progress',
      label: 'Progress',
      render: (value) => (
        <div className="flex items-center gap-2">
          <div className="w-24 bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${value || 0}%` }}
            />
          </div>
          <span className="text-sm text-gray-600">{value || 0}%</span>
        </div>
      )
    },
    {
      key: 'endDate',
      label: 'Due Date',
      render: (value) => formatDate(value)
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

  return <Table columns={columns} data={projects} emptyMessage="No projects found" />;
};

export default ProjectTable;
