'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api';
import { Todo, CreateTodoDto, TodoStatus } from '@/types';
import TodoForm from '@/components/TodoForm';
import TodoItem from '@/components/TodoItem';

export default function DashboardPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<TodoStatus | 'ALL'>('ALL');
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    fetchTodos();
  }, [user, router]);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get<Todo[]>('/todos');
      setTodos(response);
    } catch (err: any) {
      setError('Failed to fetch todos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTodo = async (data: CreateTodoDto) => {
    try {
      setCreating(true);
      const newTodo = await apiClient.post<Todo>('/todos', data);
      setTodos(prev => [newTodo, ...prev]);
      setError('');
    } catch (err: any) {
      setError('Failed to create todo');
      console.error(err);
    } finally {
      setCreating(false);
    }
  };

  const handleUpdateTodo = async (id: number, data: { title?: string; description?: string; status?: TodoStatus }) => {
    try {
      const updatedTodo = await apiClient.put<Todo>(`/todos/${id}`, data);
      setTodos(prev => prev.map(todo => todo.id === id ? updatedTodo : todo));
    } catch (err: any) {
      setError('Failed to update todo');
      console.error(err);
    }
  };

  const handleDeleteTodo = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this todo?')) {
      return;
    }

    try {
      await apiClient.delete(`/todos/${id}`);
      setTodos(prev => prev.filter(todo => todo.id !== id));
    } catch (err: any) {
      setError('Failed to delete todo');
      console.error(err);
    }
  };

  const filteredTodos = filter === 'ALL' 
    ? todos 
    : todos.filter(todo => todo.status === filter);

  const getTodoCountByStatus = (status: TodoStatus) => 
    todos.filter(todo => todo.status === status).length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user?.username}!</p>
            </div>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">{todos.length}</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Todos</dt>
                    <dd className="text-lg font-medium text-gray-900">{todos.length}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">{getTodoCountByStatus(TodoStatus.PENDING)}</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Pending</dt>
                    <dd className="text-lg font-medium text-gray-900">{getTodoCountByStatus(TodoStatus.PENDING)}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">{getTodoCountByStatus(TodoStatus.IN_PROGRESS)}</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">In Progress</dt>
                    <dd className="text-lg font-medium text-gray-900">{getTodoCountByStatus(TodoStatus.IN_PROGRESS)}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">{getTodoCountByStatus(TodoStatus.DONE)}</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Completed</dt>
                    <dd className="text-lg font-medium text-gray-900">{getTodoCountByStatus(TodoStatus.DONE)}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <TodoForm onSubmit={handleCreateTodo} loading={creating} />
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-900">Your Todos</h2>
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value as TodoStatus | 'ALL')}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="ALL">All Todos</option>
                    <option value={TodoStatus.PENDING}>Pending</option>
                    <option value={TodoStatus.IN_PROGRESS}>In Progress</option>
                    <option value={TodoStatus.DONE}>Completed</option>
                  </select>
                </div>
              </div>
              <div className="p-6">
                {filteredTodos.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    {filter === 'ALL' ? 'No todos yet. Create your first todo!' : `No ${filter.toLowerCase().replace('_', ' ')} todos.`}
                  </p>
                ) : (
                  <div className="space-y-4">
                    {filteredTodos.map(todo => (
                      <TodoItem
                        key={todo.id}
                        todo={todo}
                        onUpdate={handleUpdateTodo}
                        onDelete={handleDeleteTodo}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}