import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { ITasksService } from './tasks.interface';
import { UsersRepository } from '../users';

describe('TasksController', () => {
  let controller: TasksController;

  const tasksServiceMock = {
    createTask: jest.fn(),
    updateTask: jest.fn(),
    deleteTask: jest.fn(),
    getTaskById: jest.fn(),
    getAllTasks: jest.fn(),
  };

  // Required because the controller is protected by AuthGuard, which injects UsersRepository.
  const usersRepositoryMock = {
    findOneByUsername: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        { provide: ITasksService, useValue: tasksServiceMock },
        { provide: UsersRepository, useValue: usersRepositoryMock },
      ],
    }).compile();

    controller = module.get<TasksController>(TasksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
