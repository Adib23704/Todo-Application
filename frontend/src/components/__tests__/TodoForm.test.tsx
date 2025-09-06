import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TodoForm from '../TodoForm';
import { TodoStatus } from '@/types';

describe('TodoForm', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders form fields correctly', () => {
    render(<TodoForm onSubmit={mockOnSubmit} />);

    expect(screen.getByLabelText('Title *')).toBeInTheDocument();
    expect(screen.getByLabelText('Description')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: '+ Add Todo' })
    ).toBeInTheDocument();
  });

  it('submits form with correct data', async () => {
    const user = userEvent.setup();

    render(<TodoForm onSubmit={mockOnSubmit} />);

    const titleInput = screen.getByLabelText('Title *');
    const descriptionInput = screen.getByLabelText('Description');
    const submitButton = screen.getByRole('button', { name: '+ Add Todo' });

    await user.type(titleInput, 'Test Todo');
    await user.type(descriptionInput, 'Test Description');
    await user.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledWith({
      title: 'Test Todo',
      description: 'Test Description',
    });
  });

  it('resets form after submission', async () => {
    const user = userEvent.setup();

    render(<TodoForm onSubmit={mockOnSubmit} />);

    const titleInput = screen.getByLabelText('Title *');
    const descriptionInput = screen.getByLabelText('Description');
    const submitButton = screen.getByRole('button', { name: '+ Add Todo' });

    await user.type(titleInput, 'Test Todo');
    await user.type(descriptionInput, 'Test Description');
    await user.click(submitButton);

    await waitFor(() => {
      expect(titleInput).toHaveValue('');
      expect(descriptionInput).toHaveValue('');
    });
  });

  it('does not submit when title is empty', async () => {
    const user = userEvent.setup();

    render(<TodoForm onSubmit={mockOnSubmit} />);

    const descriptionInput = screen.getByLabelText('Description');
    const submitButton = screen.getByRole('button', { name: '+ Add Todo' });

    await user.type(descriptionInput, 'Test Description');
    await user.click(submitButton);

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('does not submit when title contains only whitespace', async () => {
    const user = userEvent.setup();

    render(<TodoForm onSubmit={mockOnSubmit} />);

    const titleInput = screen.getByLabelText('Title *');
    const submitButton = screen.getByRole('button', { name: '+ Add Todo' });

    await user.type(titleInput, '   ');
    await user.click(submitButton);

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('disables submit button when loading', () => {
    render(<TodoForm onSubmit={mockOnSubmit} loading={true} />);

    const submitButton = screen.getByRole('button', { name: 'Creating...' });

    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveClass(
      'disabled:opacity-50',
      'disabled:cursor-not-allowed'
    );
  });

  it('disables submit button when title is empty', async () => {
    const user = userEvent.setup();

    render(<TodoForm onSubmit={mockOnSubmit} />);

    const submitButton = screen.getByRole('button', { name: '+ Add Todo' });

    expect(submitButton).toBeDisabled();

    const titleInput = screen.getByLabelText('Title *');
    await user.type(titleInput, 'Test');

    expect(submitButton).toBeEnabled();

    await user.clear(titleInput);

    expect(submitButton).toBeDisabled();
  });


  it('handles form submission with Enter key', async () => {
    const user = userEvent.setup();

    render(<TodoForm onSubmit={mockOnSubmit} />);

    const titleInput = screen.getByLabelText('Title *');
    await user.type(titleInput, 'Test Todo{enter}');

    expect(mockOnSubmit).toHaveBeenCalledWith({
      title: 'Test Todo',
      description: '',
    });
  });
});
