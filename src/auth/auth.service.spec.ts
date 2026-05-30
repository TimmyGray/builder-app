import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersRepository } from '../users';
import { AuthConfig } from './auth.config';

describe('AuthService', () => {
  let service: AuthService;

  const usersRepositoryMock = {
    insert: jest.fn(),
    findOneByUsername: jest.fn(),
    findOneByUsernameWithPassword: jest.fn(),
    deleteByUsername: jest.fn(),
  };

  const authConfigMock: AuthConfig = { rounds: 10 };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersRepository, useValue: usersRepositoryMock },
        { provide: AuthConfig, useValue: authConfigMock },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
