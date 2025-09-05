import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { Todo } from './modules/todo/todo.entity';
import { User } from './modules/auth/user.entity';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'todo_app',
  synchronize: false,
  logging: true,
  entities: [Todo, User],
  migrations: ['src/migrations/*.ts'],
  subscribers: [],
});