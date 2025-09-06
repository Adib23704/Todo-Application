'use client';

import { useState } from 'react';
import { Todo, TodoStatus } from '@/types';

interface TodoItemProps {
  todo: Todo;
  onUpdate: (
    id: number,
    data: { title?: string; description?: string; status?: TodoStatus }
  ) => void;
  onDelete: (id: number) => void;
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
    <div className='bg-white shadow rounded-lg p-6 border border-gray-200'>
      {isEditing ? (
        <div className='space-y-4'>
          <input
            type='text'
            value={editData.title}
            onChange={e =>
              setEditData(prev => ({ ...prev, title: e.target.value }))
            }
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
            placeholder='Todo title'
          />
          <textarea
            value={editData.description}
            onChange={e =>
              setEditData(prev => ({ ...prev, description: e.target.value }))
            }
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
            placeholder='Todo description'
            rows={3}
          />
          <div className='flex space-x-2'>
            <button
              onClick={handleSave}
              className='px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700'
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className='px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700'
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className='flex justify-between items-start mb-2'>
            <h3 className='text-lg font-semibold text-gray-900'>
              {todo.title}
            </h3>
            <span
              className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(todo.status)}`}
            >
              {todo.status.replace('_', ' ')}
            </span>
          </div>
          <p className='text-gray-600 mb-4'>{todo.description}</p>
          <div className='flex justify-between items-center'>
            <div className='space-x-2'>
              <select
                value={todo.status}
                onChange={e => handleStatusChange(e.target.value as TodoStatus)}
                className='px-2 py-1 border border-gray-300 rounded text-sm text-black focus:outline-none focus:ring-2 focus:ring-indigo-500'
              >
                <option value={TodoStatus.PENDING}>Pending</option>
                <option value={TodoStatus.IN_PROGRESS}>In Progress</option>
                <option value={TodoStatus.DONE}>Done</option>
              </select>
            </div>
            <div className='space-x-2'>
              <button
                onClick={() => setIsEditing(true)}
                className='px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700'
              >
                Edit
              </button>
              <button
                onClick={() => {
                  if (
                    window.confirm('Are you sure you want to delete this todo?')
                  ) {
                    onDelete(todo.id);
                  }
                }}
                className='px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700'
              >
                Delete
              </button>
            </div>
          </div>
          <div className='mt-2 text-xs text-gray-500'>
            Created: {new Date(todo.createdAt).toLocaleDateString()}
            {todo.updatedAt !== todo.createdAt && (
              <span className='ml-2'>
                Updated: {new Date(todo.updatedAt).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
