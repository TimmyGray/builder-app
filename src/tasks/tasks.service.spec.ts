import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { TasksRepository } from './tasks.repository';
import { UsersRepository } from '../users';
import { JobTypeRepository } from '../job-type';

describe('TasksService', () => {
  let service: TasksService;

  const tasksRepositoryMock = {
    insert: jest.fn(),
    findOneById: jest.fn(),
    update: jest.fn(),
    deleteById: jest.fn(),
    findAll: jest.fn(),
  };

  const usersRepositoryMock = {
    findOneById: jest.fn(),
  };

  const jobTypeRepositoryMock = {
    findOneById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TasksRepository, useValue: tasksRepositoryMock },
        { provide: UsersRepository, useValue: usersRepositoryMock },
        { provide: JobTypeRepository, useValue: jobTypeRepositoryMock },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
