'use client';

import { useState } from 'react';
import { CreateTodoDto, TodoStatus } from '@/types';

interface TodoFormProps {
  onSubmit: (data: CreateTodoDto) => void;
  loading?: boolean;
}

export default function TodoForm({ onSubmit, loading = false }: TodoFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: TodoStatus.PENDING,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    onSubmit(formData);
    setFormData({
      title: '',
      description: '',
      status: TodoStatus.PENDING,
    });
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className='bg-white shadow rounded-lg p-6 border border-gray-200'>
      <h2 className='text-lg font-semibold text-gray-900 mb-4'>Add New Todo</h2>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <label
            htmlFor='title'
            className='block text-sm font-medium text-gray-700 mb-1'
          >
            Title
          </label>
          <input
            type='text'
            id='title'
            name='title'
            required
            value={formData.title}
            onChange={handleChange}
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
            placeholder='Enter todo title...'
          />
        </div>

        <div>
          <label
            htmlFor='description'
            className='block text-sm font-medium text-gray-700 mb-1'
          >
            Description
          </label>
          <textarea
            id='description'
            name='description'
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
            placeholder='Enter todo description...'
          />
        </div>

        <div>
          <label
            htmlFor='status'
            className='block text-sm font-medium text-gray-700 mb-1'
          >
            Status
          </label>
          <select
            id='status'
            name='status'
            value={formData.status}
            onChange={handleChange}
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
          >
            <option value={TodoStatus.PENDING}>Pending</option>
            <option value={TodoStatus.IN_PROGRESS}>In Progress</option>
            <option value={TodoStatus.DONE}>Done</option>
          </select>
        </div>

        <button
          type='submit'
          disabled={loading || !formData.title.trim()}
          className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed'
        >
          {loading ? 'Adding...' : 'Add Todo'}
        </button>
      </form>
    </div>
  );
}
