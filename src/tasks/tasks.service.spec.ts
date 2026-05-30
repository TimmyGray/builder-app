import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksRepository } from './tasks.repository';
import { UsersRepository, UserNotFoundException } from '../users';
import { JobTypeRepository, JobTypeNotFoundException } from '../job-type';
import { TaskStatus } from './tasks.dto';
import { Task } from './tasks.entity';
import { Measure } from '../job-type/job-type.dto';
import { UserJobRole } from '../users/users.dto';

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

  const user = { id: 1, username: 'alice', jobRole: UserJobRole.Builder };
  const jobType = (measure: Measure | null) => ({ id: 2, name: 'Concrete', description: null, measure });

  const buildTask = (overrides: Partial<Task> = {}): Task =>
    ({
      id: 10,
      user,
      jobType: jobType(Measure.CubicMeter),
      status: TaskStatus.TBD,
      quantity: null,
      scopeOfWork: null,
      dateOfCompletion: null,
      createdAt: new Date('2026-01-01'),
      updatedAt: new Date('2026-01-01'),
      ...overrides,
    }) as unknown as Task;

  beforeEach(async () => {
    jest.clearAllMocks();
    usersRepositoryMock.findOneById.mockResolvedValue(user);

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

  describe('createTask scope-of-work rules', () => {
    it('records a quantity for a measured job type', async () => {
      jobTypeRepositoryMock.findOneById.mockResolvedValue(jobType(Measure.CubicMeter));
      tasksRepositoryMock.insert.mockResolvedValue(buildTask({ quantity: 24 }));

      const res = await service.createTask({ userId: 1, jobTypeId: 2, quantity: 24 });

      expect(tasksRepositoryMock.insert).toHaveBeenCalledWith(
        expect.objectContaining({ quantity: 24, scopeOfWork: null }),
      );
      expect(res).toMatchObject({
        jobType: 'Concrete',
        measure: Measure.CubicMeter,
        quantity: 24,
        scopeOfWork: null,
      });
    });

    it('rejects free text for a measured job type', async () => {
      jobTypeRepositoryMock.findOneById.mockResolvedValue(jobType(Measure.CubicMeter));

      await expect(service.createTask({ userId: 1, jobTypeId: 2, scopeOfWork: 'x' }))
        .rejects.toBeInstanceOf(BadRequestException);
      expect(tasksRepositoryMock.insert).not.toHaveBeenCalled();
    });

    it('records free text for an unmeasured job type', async () => {
      jobTypeRepositoryMock.findOneById.mockResolvedValue(jobType(null));
      tasksRepositoryMock.insert.mockResolvedValue(
        buildTask({ jobType: jobType(null) as never, scopeOfWork: 'Swept the site' }),
      );

      const res = await service.createTask({ userId: 1, jobTypeId: 2, scopeOfWork: 'Swept the site' });

      expect(tasksRepositoryMock.insert).toHaveBeenCalledWith(
        expect.objectContaining({ scopeOfWork: 'Swept the site', quantity: null }),
      );
      expect(res).toMatchObject({ measure: null, scopeOfWork: 'Swept the site' });
    });

    it('rejects a quantity for an unmeasured job type', async () => {
      jobTypeRepositoryMock.findOneById.mockResolvedValue(jobType(null));

      await expect(service.createTask({ userId: 1, jobTypeId: 2, quantity: 5 }))
        .rejects.toBeInstanceOf(BadRequestException);
      expect(tasksRepositoryMock.insert).not.toHaveBeenCalled();
    });

    it('rejects providing both a quantity and free text', async () => {
      jobTypeRepositoryMock.findOneById.mockResolvedValue(jobType(Measure.CubicMeter));

      await expect(service.createTask({ userId: 1, jobTypeId: 2, quantity: 5, scopeOfWork: 'x' }))
        .rejects.toBeInstanceOf(BadRequestException);
    });

    it('allows creating a task with no scope reported yet', async () => {
      jobTypeRepositoryMock.findOneById.mockResolvedValue(jobType(Measure.CubicMeter));
      tasksRepositoryMock.insert.mockResolvedValue(buildTask());

      const res = await service.createTask({ userId: 1, jobTypeId: 2 });

      expect(res).toMatchObject({ quantity: null, scopeOfWork: null });
    });

    it('throws when the user does not exist', async () => {
      usersRepositoryMock.findOneById.mockResolvedValue(null);

      await expect(service.createTask({ userId: 99, jobTypeId: 2 }))
        .rejects.toBeInstanceOf(UserNotFoundException);
    });

    it('throws when the job type does not exist', async () => {
      jobTypeRepositoryMock.findOneById.mockResolvedValue(null);

      await expect(service.createTask({ userId: 1, jobTypeId: 99 }))
        .rejects.toBeInstanceOf(JobTypeNotFoundException);
    });
  });

  describe('updateTask scope-of-work rules', () => {
    it('updates the quantity for a measured task', async () => {
      tasksRepositoryMock.findOneById.mockResolvedValue(buildTask());
      tasksRepositoryMock.update.mockResolvedValue(buildTask({ quantity: 30 }));

      const res = await service.updateTask({ id: 10, quantity: 30 });

      expect(tasksRepositoryMock.update).toHaveBeenCalledWith(10, expect.objectContaining({ quantity: 30 }));
      expect(res.quantity).toBe(30);
    });

    it('rejects a quantity for an unmeasured task', async () => {
      tasksRepositoryMock.findOneById.mockResolvedValue(buildTask({ jobType: jobType(null) as never }));

      await expect(service.updateTask({ id: 10, quantity: 30 }))
        .rejects.toBeInstanceOf(BadRequestException);
      expect(tasksRepositoryMock.update).not.toHaveBeenCalled();
    });
  });
});
