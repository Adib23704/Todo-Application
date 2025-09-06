export enum TodoStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

export interface Todo {
  id: number;
  title: string;
  description: string;
  status: TodoStatus;
  createdAt: string;
  updatedAt: string;
  userId: number;
}

export interface CreateTodoDto {
  title: string;
  description: string;
  status?: TodoStatus;
}

export interface UpdateTodoDto {
  title?: string;
  description?: string;
  status?: TodoStatus;
}

export interface User {
  id: number;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface LoginDto {
  username: string;
  password: string;
}

export interface RegisterDto {
  username: string;
  email: string;
  password: string;
}
