import { Controller, Body, Get, Patch, Param, UseGuards } from '@nestjs/common';
import { IUsersService } from './users.interface';
import { UserResponseDto, UpdateUserDto } from './users.dto';
import {
    ApiTags,
    ApiOperation,
    ApiBody,
    ApiNotFoundResponse,
    ApiOkResponse
} from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';

@UseGuards(AuthGuard)
@ApiTags('Users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: IUsersService) { }

    @Get()
    @ApiOperation({ summary: 'Get all users' })
    @ApiOkResponse({ description: 'List of users', type: [UserResponseDto] })
    getAllUsers(): Promise<UserResponseDto[]> {
        return this.usersService.getAllUsers();
    }

    @Get(':username')
    @ApiOperation({ summary: 'Get a user by username' })
    @ApiNotFoundResponse({ description: 'User not found' })
    @ApiOkResponse({ description: 'The user', type: UserResponseDto })
    getUserByUsername(@Param('username') username: string): Promise<UserResponseDto> {
        return this.usersService.getUserByUsername(username);
    }

    @Patch()
    @ApiOperation({ summary: 'Update a user' })
    @ApiBody({
        description: 'Data for updating a user', type: UpdateUserDto, examples: {
            basic: {
                summary: 'Basic example',
                value: {
                    id: 1,
                    username: 'John Smith'
                }
            }
        }
    })
    @ApiNotFoundResponse({ description: 'User not found' })
    @ApiOkResponse({ description: 'Updated user', type: UserResponseDto })
    updateUser(@Body() updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
        return this.usersService.updateUser(updateUserDto);
    }
}
