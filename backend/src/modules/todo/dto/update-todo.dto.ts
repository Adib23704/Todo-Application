import { IsOptional, IsString, MaxLength, IsEnum } from 'class-validator';
import { TodoStatus } from '../todo-status.enum';

export class UpdateTodoDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(TodoStatus)
  status?: TodoStatus;
}
