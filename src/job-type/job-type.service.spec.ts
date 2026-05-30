import { Test, TestingModule } from '@nestjs/testing';
import { JobTypeService } from './job-type.service';
import { JobTypeRepository } from './job-type.repository';

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
});
