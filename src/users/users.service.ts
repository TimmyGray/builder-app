import { Injectable } from '@nestjs/common';
import { IUsersService } from './users.interface';
import { UserResponseDto, UserJobRole, UpdateUserDto } from './users.dto';
import { UsersRepository } from './users.repository';
import { UserNotFoundException, UserUpdateException, InternalUsersServiceException } from './users.errors';

@Injectable()
export class UsersService implements IUsersService {
    constructor(private readonly usersRepository: UsersRepository) { }

    async getUserByUsername(username: string): Promise<UserResponseDto> {
        const user = await this.usersRepository.findOneByUsername(username);
        if (!user) {
            throw new UserNotFoundException(`The user with username "${username}" was not found.`);
        }

        return {
            id: user.id,
            username: user.username,
            jobRole: user.jobRole as UserJobRole,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        }
    }

    async updateUser(updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
        const { id, username } = updateUserDto;
        const existingUser = await this.usersRepository.findOneById(id);
        if (!existingUser) {
            throw new UserNotFoundException(`The user with id "${id}" was not found.`);
        }

        try {
            const updatedUser = await this.usersRepository.updateUsername(id, username);
            return {
                id: updatedUser.id,
                username: updatedUser.username,
                jobRole: updatedUser.jobRole as UserJobRole,
                createdAt: updatedUser.createdAt,
                updatedAt: updatedUser.updatedAt
            };
        } catch (error) {
            throw new UserUpdateException(`Failed to update user with id "${id}"`);
        }
    }

    async getAllUsers(): Promise<UserResponseDto[]> {
        try {
            const users = await this.usersRepository.findAll();
            return users.map(user => ({
                id: user.id,
                username: user.username,
                jobRole: user.jobRole as UserJobRole,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }));
        } catch (error) {
            throw new InternalUsersServiceException();
        }
    }
}
