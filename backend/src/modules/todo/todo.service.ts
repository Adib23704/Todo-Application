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
  async create(createTodoDto: CreateTodoDto): Promise<Todo> {
    console.log('Creating new todo');

    const todo = await this.todoRepository.create(createTodoDto);

    console.log('Todo created successfully');

    return todo;
  }

  // Retrieve all todos, optionally filtered by status
  async findAll(status?: TodoStatus): Promise<Todo[]> {
    console.log('Retrieving todos');

    const todos = await this.todoRepository.findAll(status);

    console.log('Todos retrieved successfully');

    return todos;
  }

  // Retrieve a single todo by its ID
  async findOne(id: string): Promise<Todo> {
    console.log('Retrieving todo by ID');

    const todo = await this.todoRepository.findById(id);
    if (!todo) {
      console.log('Todo not found');
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }

    console.log('Todo retrieved successfully');

    return todo;
  }

  // Update an existing todo
  async update(id: string, updateTodoDto: UpdateTodoDto): Promise<Todo> {
    console.log('Updating todo');

    const existingTodo = await this.todoRepository.findById(id);
    if (!existingTodo) {
      console.log('Update failed: Todo not found');
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }

    const updatedTodo = await this.todoRepository.update(id, updateTodoDto);

    console.log('Todo updated successfully');

    return updatedTodo;
  }

  // Delete a todo by its ID
  async remove(id: string): Promise<{ status: boolean; message: string }> {
    console.log('Deleting todo');

    const existingTodo = await this.todoRepository.findById(id);
    if (!existingTodo) {
      console.log('Delete failed: Todo not found');
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }

    await this.todoRepository.delete(id);

    console.log('Todo deleted successfully');

    return { status: true, message: 'Todo deleted successfully' };
  }
}
