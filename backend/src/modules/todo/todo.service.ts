import { Injectable, NotFoundException } from '@nestjs/common';
import { TypeormTodoRepository } from './typeorm-todo.repository';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './todo.entity';
import { TodoStatus } from './todo-status.enum';

@Injectable()
export class TodoService {
  constructor(
    private readonly todoRepository: TypeormTodoRepository,
  ) {}

  async create(createTodoDto: CreateTodoDto): Promise<Todo> {
    return await this.todoRepository.create(createTodoDto);
  }

  async findAll(status?: TodoStatus): Promise<Todo[]> {
    return await this.todoRepository.findAll(status);
  }

  async findOne(id: string): Promise<Todo> {
    const todo = await this.todoRepository.findById(id);
    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }
    return todo;
  }

  async update(id: string, updateTodoDto: UpdateTodoDto): Promise<Todo> {
    const existingTodo = await this.todoRepository.findById(id);
    if (!existingTodo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }
    
    return await this.todoRepository.update(id, updateTodoDto);
  }

  async remove(id: string): Promise<void> {
    const existingTodo = await this.todoRepository.findById(id);
    if (!existingTodo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }
    
    await this.todoRepository.delete(id);
  }
}