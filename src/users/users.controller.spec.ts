import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { IUsersService } from './users.interface';
import { UsersRepository } from './users.repository';

describe('UsersController', () => {
  let controller: UsersController;

  const usersServiceMock = {
    getUserByUsername: jest.fn(),
    updateUser: jest.fn(),
    getAllUsers: jest.fn(),
  };

  // Required because the controller is protected by AuthGuard, which injects UsersRepository.
  const usersRepositoryMock = {
    findOneByUsername: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: IUsersService, useValue: usersServiceMock },
        { provide: UsersRepository, useValue: usersRepositoryMock },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
