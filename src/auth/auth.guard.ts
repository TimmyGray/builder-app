import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { UsersRepository } from '../users/users.repository';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly usersRepository: UsersRepository) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const headerValue = request.headers['username'];
    const username =
      typeof headerValue === 'string'
        ? headerValue.trim()
        : Array.isArray(headerValue)
          ? (headerValue[0] ?? '').trim()
          : '';

    if (!username) {
      throw new ForbiddenException('Authentication required: username header is missing.');
    }

    const user = await this.usersRepository.findOneByUsername(username);
    if (!user) {
      throw new ForbiddenException('Authentication required: user not found.');
    }
    return true;
  }
}
