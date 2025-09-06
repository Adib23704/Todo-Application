import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TodoItem from '../TodoItem';
import { TodoStatus } from '@/types';

const mockTodo = {
  id: 1,
  title: 'Test Todo',
  description: 'Test Description',
  status: TodoStatus.PENDING,
  createdAt: '2023-01-01T00:00:00.000Z',
  updatedAt: '2023-01-01T00:00:00.000Z',
  userId: 1,
};

describe('TodoItem', () => {
  const mockOnUpdate = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders todo information correctly', () => {
    render(
      <TodoItem
        todo={mockTodo}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('Test Todo')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('PENDING')).toBeInTheDocument();
    expect(screen.getByDisplayValue('PENDING')).toBeInTheDocument();
  });

  it('calls onUpdate when status is changed', async () => {
    const user = userEvent.setup();

    render(
      <TodoItem
        todo={mockTodo}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    );

    const statusSelect = screen.getByDisplayValue('PENDING');
    await user.selectOptions(statusSelect, TodoStatus.IN_PROGRESS);

    expect(mockOnUpdate).toHaveBeenCalledWith(1, {
      status: TodoStatus.IN_PROGRESS,
    });
  });

  it('calls onDelete when delete button is clicked', async () => {
    const user = userEvent.setup();

    window.confirm = jest.fn(() => true);

    render(
      <TodoItem
        todo={mockTodo}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    );

    const deleteButton = screen.getByText('Delete');
    await user.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledWith(1);
    expect(window.confirm).toHaveBeenCalledWith(
      'Are you sure you want to delete this todo?'
    );
  });

  it('does not call onDelete when user cancels confirmation', async () => {
    const user = userEvent.setup();

    window.confirm = jest.fn(() => false);

    render(
      <TodoItem
        todo={mockTodo}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    );

    const deleteButton = screen.getByText('Delete');
    await user.click(deleteButton);

    expect(mockOnDelete).not.toHaveBeenCalled();
  });

  it('enters edit mode when edit button is clicked', async () => {
    const user = userEvent.setup();

    render(
      <TodoItem
        todo={mockTodo}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    );

    const editButton = screen.getByText('Edit');
    await user.click(editButton);

    expect(screen.getByDisplayValue('Test Todo')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Description')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('saves changes when save button is clicked', async () => {
    const user = userEvent.setup();

    render(
      <TodoItem
        todo={mockTodo}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    );

    const editButton = screen.getByText('Edit');
    await user.click(editButton);

    const titleInput = screen.getByDisplayValue('Test Todo');
    await user.clear(titleInput);
    await user.type(titleInput, 'Updated Todo');

    const saveButton = screen.getByText('Save');
    await user.click(saveButton);

    expect(mockOnUpdate).toHaveBeenCalledWith(1, {
      title: 'Updated Todo',
      description: 'Test Description',
    });
  });

  it('cancels changes when cancel button is clicked', async () => {
    const user = userEvent.setup();

    render(
      <TodoItem
        todo={mockTodo}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    );

    const editButton = screen.getByText('Edit');
    await user.click(editButton);

    const titleInput = screen.getByDisplayValue('Test Todo');
    await user.clear(titleInput);
    await user.type(titleInput, 'Updated Todo');

    const cancelButton = screen.getByText('Cancel');
    await user.click(cancelButton);

    expect(mockOnUpdate).not.toHaveBeenCalled();
    expect(screen.getByText('Test Todo')).toBeInTheDocument();
  });

  it('applies correct status color classes', () => {
    const { rerender } = render(
      <TodoItem
        todo={mockTodo}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('PENDING')).toHaveClass(
      'bg-yellow-100',
      'text-yellow-800'
    );

    const inProgressTodo = { ...mockTodo, status: TodoStatus.IN_PROGRESS };
    rerender(
      <TodoItem
        todo={inProgressTodo}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    );
    expect(screen.getByText('IN PROGRESS')).toHaveClass(
      'bg-blue-100',
      'text-blue-800'
    );

    const doneTodo = { ...mockTodo, status: TodoStatus.DONE };
    rerender(
      <TodoItem
        todo={doneTodo}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    );
    expect(screen.getByText('DONE')).toHaveClass(
      'bg-green-100',
      'text-green-800'
    );
  });

  it('shows creation and update dates', () => {
    const todoWithDifferentDates = {
      ...mockTodo,
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-02T00:00:00.000Z',
    };

    render(
      <TodoItem
        todo={todoWithDifferentDates}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText(/Created: 1\/1\/2023/)).toBeInTheDocument();
    expect(screen.getByText(/Updated: 1\/2\/2023/)).toBeInTheDocument();
  });
});
