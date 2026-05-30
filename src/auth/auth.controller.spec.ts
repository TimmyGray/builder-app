import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { IAuthService } from './auth.interface';
import { UsersRepository } from '../users';

describe('AuthController', () => {
  let controller: AuthController;

  const authServiceMock = {
    signIn: jest.fn(),
    signUp: jest.fn(),
    signOut: jest.fn(),
    deleteUser: jest.fn(),
  };

  // Required because some routes are protected by AuthGuard, which injects UsersRepository.
  const usersRepositoryMock = {
    findOneByUsername: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: IAuthService, useValue: authServiceMock },
        { provide: UsersRepository, useValue: usersRepositoryMock },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
