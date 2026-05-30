import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { UsersRepository } from '../users/users.repository';
import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let usersRepository: jest.Mocked<Pick<UsersRepository, 'findOneByUsername'>>;

  const createExecutionContext = (
    headers: Record<string, string | string[] | undefined>,
  ): ExecutionContext => {
    return {
      switchToHttp: () => ({
        getRequest: () => ({ headers }),
      }),
    } as unknown as ExecutionContext;
  };

  beforeEach(() => {
    usersRepository = {
      findOneByUsername: jest.fn(),
    };

    guard = new AuthGuard(usersRepository as unknown as UsersRepository);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('throws ForbiddenException when username header is missing', async () => {
    const context = createExecutionContext({});

    await expect(guard.canActivate(context)).rejects.toThrow(ForbiddenException);
    expect(usersRepository.findOneByUsername).not.toHaveBeenCalled();
  });

  it('throws ForbiddenException when username does not exist in db', async () => {
    usersRepository.findOneByUsername.mockResolvedValue(null);
    const context = createExecutionContext({ username: 'ghost-user' });

    await expect(guard.canActivate(context)).rejects.toThrow(ForbiddenException);
    expect(usersRepository.findOneByUsername).toHaveBeenCalledWith('ghost-user');
  });

  it('should return true when username exists in db', async () => {
    usersRepository.findOneByUsername.mockResolvedValue({ id: 1 } as never);
    const context = createExecutionContext({ username: 'builder-1' });

    await expect(guard.canActivate(context)).resolves.toBe(true);
    expect(usersRepository.findOneByUsername).toHaveBeenCalledWith('builder-1');
  });
});
