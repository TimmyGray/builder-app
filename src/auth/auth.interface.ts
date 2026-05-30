import { CreateUserDto, UserResponseDto, DeleteUserDto } from '../users';

export abstract class IAuthService {
    abstract signIn(username: string, password: string): Promise<UserResponseDto>;
    abstract signUp(createUserDto: CreateUserDto): Promise<UserResponseDto>;
    abstract signOut(token: string): Promise<void>;
    abstract deleteUser(deleteUserDto: DeleteUserDto): Promise<string>;
}
