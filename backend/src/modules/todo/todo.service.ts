import { Injectable, NotFoundException } from '@nestjs/common';
import { TypeormTodoRepository } from './typeorm-todo.repository';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './todo.entity';
import { TodoStatus } from './todo-status.enum';

@Injectable()
export class TodoService {
  constructor(private readonly todoRepository: TypeormTodoRepository) {}

  // Create a new todo
  async create(createTodoDto: CreateTodoDto, userId: string): Promise<Todo> {
    console.log('Creating new todo');

    const todoData = {
      ...createTodoDto,
      userId,
    };

    const todo = await this.todoRepository.create(todoData);

    console.log('Todo created successfully');

    return todo;
  }

  // Retrieve all todos, optionally filtered by status
  async findAll(userId: string, status?: TodoStatus): Promise<Todo[]> {
    console.log('Retrieving todos');

    const todos = await this.todoRepository.findAll(userId, status);

    console.log('Todos retrieved successfully');

    return todos;
  }

  // Retrieve a single todo by its ID
  async findOne(id: string, userId: string): Promise<Todo> {
    console.log('Retrieving todo by ID');

    const todo = await this.todoRepository.findById(id, userId);
    if (!todo) {
      console.log('Todo not found');
      throw new NotFoundException(
        `Todo with ID ${id} not found or not owned by user`,
      );
    }

    console.log('Todo retrieved successfully');

    return todo;
  }

  // Update an existing todo
  async update(
    id: string,
    userId: string,
    updateTodoDto: UpdateTodoDto,
  ): Promise<Todo> {
    console.log('Updating todo');

    const existingTodo = await this.todoRepository.findById(id, userId);
    if (!existingTodo) {
      console.log('Update failed: Todo not found');
      throw new NotFoundException(
        `Todo with ID ${id} not found or not owned by user`,
      );
    }

    const updatedTodo = await this.todoRepository.update(
      id,
      userId,
      updateTodoDto,
    );

    console.log('Todo updated successfully');

    return updatedTodo;
  }

  // Delete a todo by its ID
  async remove(
    id: string,
    userId: string,
  ): Promise<{ status: boolean; message: string }> {
    console.log('Deleting todo');

    const existingTodo = await this.todoRepository.findById(id, userId);
    if (!existingTodo) {
      console.log('Delete failed: Todo not found');
      throw new NotFoundException(
        `Todo with ID ${id} not found or not owned by user`,
      );
    }

    await this.todoRepository.delete(id, userId);

    console.log('Todo deleted successfully');

    return { status: true, message: 'Todo deleted successfully' };
  }
}
