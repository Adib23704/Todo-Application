import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from './todo.entity';
import { TodoStatus } from './todo-status.enum';
import { TodoRepository } from './todo.repository.interface';

@Injectable()
export class TypeormTodoRepository implements TodoRepository {
  constructor(
    @InjectRepository(Todo)
    private readonly todoRepository: Repository<Todo>,
  ) {}

  async create(todoData: Partial<Todo>): Promise<Todo> {
    const todo = this.todoRepository.create(todoData);
    return await this.todoRepository.save(todo);
  }

  async findAll(status?: TodoStatus): Promise<Todo[]> {
    if (status) {
      return await this.todoRepository.find({
        where: { status },
        order: { createdAt: 'DESC' },
      });
    }
    return await this.todoRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string): Promise<Todo | null> {
    return await this.todoRepository.findOne({ where: { id } });
  }

  async update(id: string, data: Partial<Todo>): Promise<Todo> {
    await this.todoRepository.update(id, data);
    const updatedTodo = await this.findById(id);
    if (!updatedTodo) {
      throw new Error(`Todo with ID ${id} not found`);
    }
    return updatedTodo;
  }

  async delete(id: string): Promise<void> {
    const result = await this.todoRepository.delete(id);
    if (result.affected === 0) {
      throw new Error(`Todo with ID ${id} not found`);
    }
  }
}