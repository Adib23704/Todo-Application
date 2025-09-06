import { Todo } from './todo.entity';
import { TodoStatus } from './todo-status.enum';

export interface TodoRepository {
  create(todo: Partial<Todo>): Promise<Todo>;
  findAll(userId: string, status?: TodoStatus): Promise<Todo[]>;
  findById(id: string, userId: string): Promise<Todo | null>;
  update(id: string, userId: string, data: Partial<Todo>): Promise<Todo>;
  delete(id: string, userId: string): Promise<void>;
}
