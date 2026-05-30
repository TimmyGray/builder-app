import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { IUsersService } from './users.interface';

describe('UsersController', () => {
  let controller: UsersController;

  const usersServiceMock = {
    getUserByUsername: jest.fn(),
    updateUser: jest.fn(),
    getAllUsers: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: IUsersService, useValue: usersServiceMock },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
