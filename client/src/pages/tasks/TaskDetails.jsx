import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import taskService from '../../services/taskService';
import { getTaskStatusClass, getPriorityClass, formatDate, isOverdue, getDaysRemaining, getInitials, getAvatarColor, timeAgo } from '../../utils/helpers';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import TaskForm from '../../components/task/TaskForm';
import TaskComment from '../../components/task/TaskComment';
import { ArrowLeft, Edit, Trash2, Calendar, Clock, User, MessageSquare, Paperclip } from 'lucide-react';

const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchTask();
  }, [id]);

  const fetchTask = async () => {
    try {
      setLoading(true);
      const data = await taskService.getTaskById(id);
      setTask(data);
    } catch (error) {
      console.error('Error fetching task:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditTask = () => {
    setIsModalOpen(true);
  };

  const handleDeleteTask = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskService.deleteTask(id);
        navigate('/tasks');
      } catch (error) {
        console.error('Error deleting task:', error);
        alert('Failed to delete task');
      }
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    try {
      await taskService.updateTaskStatus(id, newStatus);
      fetchTask();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  const handleAddComment = async (text) => {
    try {
      await taskService.addComment(id, { text });
      fetchTask();
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await taskService.deleteComment(id, commentId);
      fetchTask();
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      await taskService.uploadAttachment(id, formData);
      fetchTask();
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file');
    }
  };

  const handleDeleteAttachment = async (attachmentId) => {
    if (window.confirm('Are you sure you want to delete this attachment?')) {
      try {
        await taskService.deleteAttachment(id, attachmentId);
        fetchTask();
      } catch (error) {
        console.error('Error deleting attachment:', error);
        alert('Failed to delete attachment');
      }
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Task not found</p>
        <button onClick={() => navigate('/tasks')} className="mt-4 text-blue-600 hover:underline">
          Go back to tasks
        </button>
      </div>
    );
  }

  const isTaskOverdue = isOverdue(task.dueDate, task.status);
  const daysRemaining = getDaysRemaining(task.dueDate);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/tasks')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Tasks
        </button>
        <div className="flex gap-2">
          <Button onClick={handleEditTask} variant="secondary">
            <Edit size={16} className="mr-2" />
            Edit
          </Button>
          <Button onClick={handleDeleteTask} variant="danger">
            <Trash2 size={16} className="mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Task Info */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{task.title}</h1>
            <p className="text-gray-600 mt-1">{task.project?.name || 'No project'}</p>
          </div>
          <div className="flex gap-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTaskStatusClass(task.status)}`}>
              {task.status}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityClass(task.priority)}`}>
              {task.priority}
            </span>
          </div>
        </div>

        <p className="text-gray-700 mb-6">{task.description}</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-2 text-gray-600">
            <User size={18} />
            <span>{task.assignedTo?.name || 'Unassigned'}</span>
          </div>
          <div className={`flex items-center gap-2 ${isTaskOverdue ? 'text-red-600' : 'text-gray-600'}`}>
            <Calendar size={18} />
            <span>{formatDate(task.dueDate)}</span>
          </div>
          {task.estimatedHours && (
            <div className="flex items-center gap-2 text-gray-600">
              <Clock size={18} />
              <span>{task.estimatedHours}h estimated</span>
            </div>
          )}
        </div>

        {daysRemaining !== null && task.status !== 'Done' && (
          <div className={`mt-4 text-sm ${isTaskOverdue ? 'text-red-600' : daysRemaining <= 3 ? 'text-orange-600' : 'text-gray-500'}`}>
            {isTaskOverdue ? `Overdue by ${Math.abs(daysRemaining)} days` : daysRemaining === 0 ? 'Due today' : `${daysRemaining} days remaining`}
          </div>
        )}

        {/* Status Update */}
        <div className="mt-6 pt-6 border-t border-gray-100">
          <label className="block text-sm font-medium text-gray-700 mb-2">Update Status</label>
          <div className="flex gap-2">
            {['Todo', 'In Progress', 'Review', 'Done'].map((status) => (
              <button
                key={status}
                onClick={() => handleUpdateStatus(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  task.status === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Comments */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare size={20} className="text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Comments</h2>
        </div>
        <TaskComment
          comments={task.comments || []}
          onAddComment={handleAddComment}
          onDeleteComment={handleDeleteComment}
          currentUserId={currentUser?._id}
        />
      </div>

      {/* Attachments */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Paperclip size={20} className="text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Attachments</h2>
          </div>
          <label className="cursor-pointer">
            <input
              type="file"
              onChange={handleFileUpload}
              className="hidden"
              accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.gif,.txt,.zip"
            />
            <Button variant="secondary" size="sm">
              <Paperclip size={16} className="mr-2" />
              Upload File
            </Button>
          </label>
        </div>
        {task.attachments && task.attachments.length > 0 ? (
          <div className="space-y-2">
            {task.attachments.map((attachment) => (
              <div key={attachment._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Paperclip size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-700">{attachment.originalName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">{formatFileSize(attachment.size)}</span>
                  {(attachment.uploadedBy === currentUser?._id || currentUser?.role === 'Admin') && (
                    <button
                      onClick={() => handleDeleteAttachment(attachment._id)}
                      className="p-1 rounded hover:bg-red-100 text-red-600 transition-colors"
                      title="Delete attachment"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 text-center py-4">No attachments yet</p>
        )}
      </div>

      {/* Activity */}
      {task.activities && task.activities.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Activity Log</h2>
          <div className="space-y-3">
            {task.activities.slice().reverse().map((activity) => (
              <div key={activity._id} className="flex items-start gap-3 text-sm">
                {activity.user?.avatar ? (
                  <img src={activity.user.avatar} alt={activity.user.name} className="w-8 h-8 rounded-full object-cover" />
                ) : (
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold ${getAvatarColor(activity.user?.name)}`}>
                    {getInitials(activity.user?.name)}
                  </div>
                )}
                <div className="flex-1">
                  <p className="text-gray-700">
                    <span className="font-medium">{activity.user?.name}</span> {activity.action}
                  </p>
                  <p className="text-gray-500 text-xs">{timeAgo(activity.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Edit Task"
        size="lg"
      >
        <TaskForm
          task={task}
          projects={[task.project]}
          users={[task.assignedTo]}
          onSubmit={() => {
            fetchTask();
            setIsModalOpen(false);
          }}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default TaskDetails;
