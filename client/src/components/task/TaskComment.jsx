import React, { useState } from 'react';
import { timeAgo, getInitials, getAvatarColor } from '../../utils/helpers';
import Avatar from '../common/Avatar';
import Button from '../common/Button';
import { Send, Trash2 } from 'lucide-react';

const TaskComment = ({ comments, onAddComment, onDeleteComment, currentUserId }) => {
  const [newComment, setNewComment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(newComment);
      setNewComment('');
    }
  };

  return (
    <div className="space-y-4">
      {/* Add Comment Form */}
      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <Button type="submit" variant="primary" size="sm">
          <Send size={16} />
        </Button>
      </form>

      {/* Comments List */}
      <div className="space-y-3">
        {comments?.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">No comments yet</p>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
              <Avatar user={comment.user} className="w-8 h-8 text-xs flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-gray-900 text-sm">{comment.user?.name}</span>
                  <span className="text-xs text-gray-500">{timeAgo(comment.createdAt)}</span>
                </div>
                <p className="text-sm text-gray-700 break-words">{comment.text}</p>
              </div>
              {comment.user?._id === currentUserId && (
                <button
                  onClick={() => onDeleteComment(comment._id)}
                  className="p-1 rounded hover:bg-red-100 text-red-600 transition-colors flex-shrink-0"
                  title="Delete comment"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TaskComment;
