import { Injectable } from '@nestjs/common';
import { IAuthService } from './auth.interface';
import {
    UserResponseDto,
    UsersRepository,
    UserJobRole,
    UserAlreadyExistsException,
    CreateUserDto,
    UserNotFoundException,
    UserDeletionException,
    DeleteUserDto
} from '../users';
import * as bcrypt from 'bcrypt';
import { AuthConfig } from './auth.config';
import { InvalidCredentialsException, UnauthorizedUserException } from './auth.errors';
import { UserCreationException } from '../users/users.errors';

@Injectable()
export class AuthService implements IAuthService {
    constructor(
        private readonly usersRepository: UsersRepository,
        private readonly authConfig: AuthConfig
    ) { }

    private async encryptPassword(password: string): Promise<string> {
        return bcrypt.hash(password, this.authConfig.rounds);
    }

    private validatePassword(password: string, hashedPassword: string): boolean {
        return bcrypt.compareSync(password, hashedPassword);
    }

    async signIn(username: string, password: string): Promise<UserResponseDto> {
        const user = await this.usersRepository.findOneByUsernameWithPassword(username);
        if (!user) {
            throw new InvalidCredentialsException();
        }

        const isPasswordValid = this.validatePassword(password, user.password);
        if (!isPasswordValid) {
            throw new InvalidCredentialsException();
        }

        return {
            username: user.username,
            jobRole: user.jobRole as UserJobRole,
            id: user.id,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };
    }

    async signUp(createUserDto: CreateUserDto): Promise<UserResponseDto> {
        const { username, password, jobRole } = createUserDto;
        const user = await this.usersRepository.findOneByUsername(username);
        if (user) {
            throw new UserAlreadyExistsException(`User with username ${username} already exists. Try a different username.`);
        }
        const hashedPassword = await this.encryptPassword(password);
        try {
            const newUser = await this.usersRepository.insert({
                username,
                password: hashedPassword,
                jobRole
            });
            return {
                username: newUser.username,
                jobRole: newUser.jobRole as UserJobRole,
                id: newUser.id,
                createdAt: newUser.createdAt,
                updatedAt: newUser.updatedAt
            };
        } catch (error) {
            throw new UserCreationException(`Failed to create user with username ${username}.`);
        }
    }

    async signOut(_token: string): Promise<void> {
        // Just a placeholder for now.
    }

    async deleteUser(deleteUserDto: DeleteUserDto): Promise<string> {
        const { username, password } = deleteUserDto;
        const user = await this.usersRepository.findOneByUsernameWithPassword(username);
        if (!user) {
            throw new UserNotFoundException(`User with username ${username} not found.`);
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedUserException('Invalid credentials. User deletion failed.');
        }

        try {
            await this.usersRepository.deleteByUsername(username);
        } catch (error) {
            throw new UserDeletionException(`Failed to delete user with username ${username}.`);
        }
        return `User ${username} deleted successfully.`;
    }
}
