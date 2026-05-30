import { Test, TestingModule } from '@nestjs/testing';
import { JobTypeService } from './job-type.service';
import { JobTypeRepository } from './job-type.repository';
import { Measure } from './job-type.dto';
import { JobTypeAlreadyExistsException } from './job-type.errors';

describe('JobTypeService', () => {
  let service: JobTypeService;

  const jobTypeRepositoryMock = {
    insert: jest.fn(),
    findOneById: jest.fn(),
    findOneByName: jest.fn(),
    update: jest.fn(),
    deleteById: jest.fn(),
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JobTypeService,
        { provide: JobTypeRepository, useValue: jobTypeRepositoryMock },
      ],
    }).compile();

    service = module.get<JobTypeService>(JobTypeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createJobType', () => {
    it('persists description and measure', async () => {
      jobTypeRepositoryMock.findOneByName.mockResolvedValue(null);
      jobTypeRepositoryMock.insert.mockResolvedValue({
        id: 1, name: 'Concrete', description: 'Pouring', measure: Measure.CubicMeter,
      });

      const res = await service.createJobType({ name: 'Concrete', description: 'Pouring', measure: Measure.CubicMeter });

      expect(jobTypeRepositoryMock.insert).toHaveBeenCalledWith({
        name: 'Concrete', description: 'Pouring', measure: Measure.CubicMeter,
      });
      expect(res).toEqual({ id: 1, name: 'Concrete', description: 'Pouring', measure: Measure.CubicMeter });
    });

    it('defaults description and measure to null when omitted', async () => {
      jobTypeRepositoryMock.findOneByName.mockResolvedValue(null);
      jobTypeRepositoryMock.insert.mockResolvedValue({ id: 2, name: 'Cleanup', description: null, measure: null });

      const res = await service.createJobType({ name: 'Cleanup' });

      expect(jobTypeRepositoryMock.insert).toHaveBeenCalledWith({ name: 'Cleanup', description: null, measure: null });
      expect(res).toEqual({ id: 2, name: 'Cleanup', description: null, measure: null });
    });

    it('rejects a duplicate name', async () => {
      jobTypeRepositoryMock.findOneByName.mockResolvedValue({ id: 5, name: 'Concrete' });

      await expect(service.createJobType({ name: 'Concrete' }))
        .rejects.toBeInstanceOf(JobTypeAlreadyExistsException);
    });
  });

  describe('updateJobType', () => {
    it('updates name, description and measure together', async () => {
      jobTypeRepositoryMock.findOneById.mockResolvedValue({ id: 1, name: 'Concrete', description: null, measure: null });
      jobTypeRepositoryMock.findOneByName.mockResolvedValue(null);
      jobTypeRepositoryMock.update.mockResolvedValue({
        id: 1, name: 'Concrete', description: 'Updated', measure: Measure.SquareMeter,
      });

      const res = await service.updateJobType({
        id: 1, name: 'Concrete', description: 'Updated', measure: Measure.SquareMeter,
      });

      expect(jobTypeRepositoryMock.update).toHaveBeenCalledWith(1, {
        name: 'Concrete', description: 'Updated', measure: Measure.SquareMeter,
      });
      expect(res.measure).toBe(Measure.SquareMeter);
    });
  });
});
