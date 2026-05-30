import { UserResponseDto, UpdateUserDto } from "./users.dto";

export abstract class IUsersService {
    abstract getUserByUsername(username: string): Promise<UserResponseDto>;
    abstract updateUser(updateUserDto: UpdateUserDto): Promise<UserResponseDto>;
    abstract getAllUsers(): Promise<UserResponseDto[]>;
}
