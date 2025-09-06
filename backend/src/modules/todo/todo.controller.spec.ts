import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';
import { TypeormTodoRepository } from './typeorm-todo.repository';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Todo } from './todo.entity';
import { TodoStatus } from './todo-status.enum';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

describe('TodoController (e2e)', () => {
  let app: INestApplication;

  const mockTodoRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockJwtAuthGuard = {
    canActivate: jest.fn(() => true),
  };

  const mockUser = {
    id: '1',
    username: 'testuser',
    email: 'test@example.com',
  };

  const mockTodo: Todo = {
    id: '1',
    title: 'Test Todo',
    description: 'Test Description',
    status: TodoStatus.PENDING,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [TodoController],
      providers: [
        TodoService,
        {
          provide: TypeormTodoRepository,
          useValue: mockTodoRepository,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtAuthGuard)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());

    app.use((req: any, res: any, next: any) => {
      req.user = mockUser;
      next();
    });

    await app.init();
  });

  afterEach(async () => {
    await app.close();
    jest.clearAllMocks();
  });

  describe('/todos (POST)', () => {
    const createTodoDto: CreateTodoDto = {
      title: 'New Todo',
      description: 'New Description',
    };

    it('should create a new todo successfully', async () => {
      const expectedTodo = { ...mockTodo, ...createTodoDto, id: '2' };
      mockTodoRepository.create.mockResolvedValue(expectedTodo);

      const response = await request(app.getHttpServer())
        .post('/todos')
        .send(createTodoDto)
        .expect(201);

      expect(response.body).toMatchObject({
        id: '2',
        title: 'New Todo',
        description: 'New Description',
        status: 'PENDING',
      });

      expect(mockTodoRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          ...createTodoDto,
        }),
      );
    });

    it('should return 400 for invalid input', async () => {
      const invalidDto = {
        title: '',
        description: 'Valid description',
      };

      await request(app.getHttpServer())
        .post('/todos')
        .send(invalidDto)
        .expect(400);
    });
  });

  describe('/todos (GET)', () => {
    it('should return all todos for the authenticated user', async () => {
      const mockTodos = [
        mockTodo,
        { ...mockTodo, id: '2', title: 'Second Todo' },
      ];
      mockTodoRepository.findAll.mockResolvedValue(mockTodos);

      const response = await request(app.getHttpServer())
        .get('/todos')
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toMatchObject({
        id: '1',
        title: 'Test Todo',
        status: 'PENDING',
      });

      expect(mockTodoRepository.findAll).toHaveBeenCalled();
    });

    it('should return empty array when no todos exist', async () => {
      mockTodoRepository.findAll.mockResolvedValue([]);

      const response = await request(app.getHttpServer())
        .get('/todos')
        .expect(200);

      expect(response.body).toEqual([]);
    });
  });

  describe('/todos/:id (GET)', () => {
    it('should return a specific todo', async () => {
      mockTodoRepository.findById.mockResolvedValue(mockTodo);

      const response = await request(app.getHttpServer())
        .get('/todos/1')
        .expect(200);

      expect(response.body).toMatchObject({
        id: '1',
        title: 'Test Todo',
        status: 'PENDING',
      });

      expect(mockTodoRepository.findById).toHaveBeenCalledWith('1');
    });

    it('should return 404 when todo not found', async () => {
      mockTodoRepository.findById.mockResolvedValue(null);

      await request(app.getHttpServer()).get('/todos/999').expect(404);
    });
  });

  describe('/todos/:id (PUT)', () => {
    const updateTodoDto: UpdateTodoDto = {
      title: 'Updated Todo',
    };

    it('should update a todo successfully', async () => {
      const updatedTodo = { ...mockTodo, ...updateTodoDto };
      mockTodoRepository.findById.mockResolvedValue(mockTodo);
      mockTodoRepository.update.mockResolvedValue(updatedTodo);

      const response = await request(app.getHttpServer())
        .put('/todos/1')
        .send(updateTodoDto)
        .expect(200);

      expect(response.body).toMatchObject({
        id: '1',
        title: 'Updated Todo',
      });

      expect(mockTodoRepository.update).toHaveBeenCalledWith(
        '1',
        updateTodoDto,
      );
    });

    it('should return 404 when updating non-existent todo', async () => {
      mockTodoRepository.findById.mockResolvedValue(null);

      await request(app.getHttpServer())
        .put('/todos/999')
        .send(updateTodoDto)
        .expect(404);
    });
  });

  describe('/todos/:id (DELETE)', () => {
    it('should delete a todo successfully', async () => {
      mockTodoRepository.findById.mockResolvedValue(mockTodo);
      mockTodoRepository.delete.mockResolvedValue(undefined);

      await request(app.getHttpServer()).delete('/todos/1').expect(204);

      expect(mockTodoRepository.delete).toHaveBeenCalledWith('1');
    });

    it('should return 404 when deleting non-existent todo', async () => {
      mockTodoRepository.findById.mockResolvedValue(null);

      await request(app.getHttpServer()).delete('/todos/999').expect(404);
    });
  });

  describe('Authorization', () => {
    beforeEach(() => {
      mockJwtAuthGuard.canActivate.mockReset();
    });

    it('should require authentication for all endpoints', async () => {
      mockJwtAuthGuard.canActivate.mockReturnValue(false);

      await request(app.getHttpServer()).get('/todos').expect(403);

      await request(app.getHttpServer())
        .post('/todos')
        .send({ title: 'Test', description: 'Test' })
        .expect(403);

      await request(app.getHttpServer()).get('/todos/1').expect(403);

      await request(app.getHttpServer())
        .put('/todos/1')
        .send({ title: 'Updated' })
        .expect(403);

      await request(app.getHttpServer()).delete('/todos/1').expect(403);
    });
  });
});
