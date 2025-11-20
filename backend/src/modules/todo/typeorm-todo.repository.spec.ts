import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Todo } from './todo.entity';
import { TodoStatus } from './todo-status.enum';
import { TypeormTodoRepository } from './typeorm-todo.repository';

// Mock repository for testing
const mockTodoRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  clear: jest.fn(),
};

describe('TypeormTodoRepository', () => {
  let repository: TypeormTodoRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TypeormTodoRepository,
        {
          provide: getRepositoryToken(Todo),
          useValue: mockTodoRepository,
        },
      ],
    }).compile();

    repository = module.get<TypeormTodoRepository>(TypeormTodoRepository);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new todo', async () => {
      const todoData = {
        title: 'Test Todo',
        description: 'Test Description',
      };

      const mockTodo = {
        id: 'test-id',
        title: 'Test Todo',
        description: 'Test Description',
        status: TodoStatus.PENDING,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockTodoRepository.create.mockReturnValue(mockTodo);
      mockTodoRepository.save.mockResolvedValue(mockTodo);

      const createdTodo = await repository.create(todoData);

      expect(mockTodoRepository.create).toHaveBeenCalledWith(todoData);
      expect(mockTodoRepository.save).toHaveBeenCalledWith(mockTodo);
      expect(createdTodo).toEqual(mockTodo);
    });
  });

  describe('findAll', () => {
    it('should return all todos ordered by createdAt DESC', async () => {
      const mockTodos = [
        { id: '1', title: 'Todo 1', status: TodoStatus.PENDING },
        { id: '2', title: 'Todo 2', status: TodoStatus.DONE },
      ];

      mockTodoRepository.find.mockResolvedValue(mockTodos);

      const todos = await repository.findAll('user-id-1');

      expect(mockTodoRepository.find).toHaveBeenCalledWith({
        where: { userId: 'user-id-1' },
        order: { createdAt: 'DESC' },
      });
      expect(todos).toEqual(mockTodos);
    });

    it('should filter todos by status', async () => {
      const mockPendingTodos = [
        { id: '1', title: 'Pending Todo', status: TodoStatus.PENDING },
      ];

      mockTodoRepository.find.mockResolvedValue(mockPendingTodos);

      const pendingTodos = await repository.findAll(
        'user-id-1',
        TodoStatus.PENDING,
      );

      expect(mockTodoRepository.find).toHaveBeenCalledWith({
        where: { userId: 'user-id-1', status: TodoStatus.PENDING },
        order: { createdAt: 'DESC' },
      });
      expect(pendingTodos).toEqual(mockPendingTodos);
    });
  });

  describe('findById', () => {
    it('should return a todo by id', async () => {
      const mockTodo = { id: 'test-id', title: 'Find Me' };
      mockTodoRepository.findOne.mockResolvedValue(mockTodo);

      const foundTodo = await repository.findById('test-id', 'user-id-1');

      expect(mockTodoRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'test-id', userId: 'user-id-1' },
      });
      expect(foundTodo).toEqual(mockTodo);
    });

    it('should return null if todo not found', async () => {
      mockTodoRepository.findOne.mockResolvedValue(null);

      const foundTodo = await repository.findById(
        'non-existent-id',
        'user-id-1',
      );

      expect(foundTodo).toBeNull();
    });
  });

  describe('update', () => {
    it('should update a todo', async () => {
      const mockUpdatedTodo = {
        id: 'test-id',
        title: 'Updated Title',
        status: TodoStatus.DONE,
      };

      mockTodoRepository.update.mockResolvedValue({ affected: 1 });
      mockTodoRepository.findOne.mockResolvedValue(mockUpdatedTodo);

      const updatedTodo = await repository.update('test-id', 'user-id-1', {
        title: 'Updated Title',
        status: TodoStatus.DONE,
      });

      expect(mockTodoRepository.update).toHaveBeenCalledWith(
        { id: 'test-id', userId: 'user-id-1' },
        {
          title: 'Updated Title',
          status: TodoStatus.DONE,
        },
      );
      expect(updatedTodo).toEqual(mockUpdatedTodo);
    });

    it('should throw error if todo not found', async () => {
      mockTodoRepository.update.mockResolvedValue({ affected: 1 });
      mockTodoRepository.findOne.mockResolvedValue(null);

      await expect(
        repository.update('non-existent-id', 'user-id-1', { title: 'Updated' }),
      ).rejects.toThrow(
        'Todo with ID non-existent-id not found or not owned by user',
      );
    });
  });

  describe('delete', () => {
    it('should delete a todo successfully', async () => {
      mockTodoRepository.delete.mockResolvedValue({ affected: 1 });

      await repository.delete('test-id', 'user-id-1');

      expect(mockTodoRepository.delete).toHaveBeenCalledWith({
        id: 'test-id',
        userId: 'user-id-1',
      });
    });

    it('should throw error if todo not found', async () => {
      mockTodoRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(
        repository.delete('non-existent-id', 'user-id-1'),
      ).rejects.toThrow(
        'Todo with ID non-existent-id not found or not owned by user',
      );
    });
  });
});
