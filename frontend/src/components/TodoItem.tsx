'use client';

import { useState } from 'react';
import { Todo, TodoStatus } from '@/types';

interface TodoItemProps {
  todo: Todo;
  onUpdate: (
    id: string,
    data: { title?: string; description?: string; status?: TodoStatus }
  ) => void;
  onDelete: (id: string) => void;
}

export default function TodoItem({ todo, onUpdate, onDelete }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: todo.title,
    description: todo.description,
  });

  const handleSave = () => {
    onUpdate(todo.id, editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({
      title: todo.title,
      description: todo.description,
    });
    setIsEditing(false);
  };

  const handleStatusChange = (status: TodoStatus) => {
    onUpdate(todo.id, { status });
  };

  const getStatusColor = (status: TodoStatus) => {
    switch (status) {
      case TodoStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800';
      case TodoStatus.IN_PROGRESS:
        return 'bg-blue-100 text-blue-800';
      case TodoStatus.DONE:
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className='bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200'>
      {isEditing ? (
        <div className='p-4 space-y-4'>
          <input
            type='text'
            value={editData.title}
            onChange={e =>
              setEditData(prev => ({ ...prev, title: e.target.value }))
            }
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
            placeholder='Todo title'
          />
          <textarea
            value={editData.description}
            onChange={e =>
              setEditData(prev => ({ ...prev, description: e.target.value }))
            }
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
            placeholder='Todo description'
            rows={3}
          />
          <div className='flex justify-end space-x-2'>
            <button
              onClick={handleCancel}
              className='px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500'
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className='px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500'
            >
              Save Changes
            </button>
          </div>
        </div>
      ) : (
        <div className='p-4'>
          <div className='flex items-start justify-between mb-3'>
            <div className='flex-1 min-w-0'>
              <h3 className='text-lg font-medium text-gray-900 truncate'>
                {todo.title}
              </h3>
              {todo.description && (
                <p className='mt-1 text-sm text-gray-600 line-clamp-2'>
                  {todo.description}
                </p>
              )}
            </div>
            <div className='ml-4 flex-shrink-0'>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(todo.status)}`}
              >
                {todo.status.replace('_', ' ')}
              </span>
            </div>
          </div>

          <div className='flex items-center justify-between pt-3 border-t border-gray-100'>
            <div className='flex items-center space-x-3'>
              <select
                value={todo.status}
                onChange={e => handleStatusChange(e.target.value as TodoStatus)}
                className='text-sm border border-gray-300 rounded-md px-2 py-1 text-black focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
              >
                <option value={TodoStatus.PENDING}>📋 Pending</option>
                <option value={TodoStatus.IN_PROGRESS}>⏳ In Progress</option>
                <option value={TodoStatus.DONE}>✅ Done</option>
              </select>

              <div className='text-xs text-gray-500'>
                {new Date(todo.createdAt).toLocaleDateString()}
                {todo.updatedAt !== todo.createdAt && (
                  <span className='ml-1'>(updated)</span>
                )}
              </div>
            </div>

            <div className='flex items-center space-x-2'>
              <button
                onClick={() => setIsEditing(true)}
                className='inline-flex items-center px-3 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500'
                title='Edit todo'
              >
                ✏️ Edit
              </button>
              <button
                onClick={() => onDelete(todo.id)}
                className='inline-flex items-center px-3 py-1 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500'
                title='Delete todo'
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
