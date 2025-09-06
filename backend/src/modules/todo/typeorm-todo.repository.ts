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

  async findAll(userId: string, status?: TodoStatus): Promise<Todo[]> {
    const whereCondition: any = { userId };
    if (status) {
      whereCondition.status = status;
    }

    return await this.todoRepository.find({
      where: whereCondition,
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string, userId: string): Promise<Todo | null> {
    return await this.todoRepository.findOne({
      where: { id, userId },
    });
  }

  async update(id: string, userId: string, data: Partial<Todo>): Promise<Todo> {
    await this.todoRepository.update({ id, userId }, data);
    const updatedTodo = await this.findById(id, userId);
    if (!updatedTodo) {
      throw new Error(`Todo with ID ${id} not found or not owned by user`);
    }
    return updatedTodo;
  }

  async delete(id: string, userId: string): Promise<void> {
    const result = await this.todoRepository.delete({ id, userId });
    if (result.affected === 0) {
      throw new Error(`Todo with ID ${id} not found or not owned by user`);
    }
  }
}
