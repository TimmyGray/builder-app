import { Controller, Post, Delete, Body, UseGuards } from '@nestjs/common';
import { IAuthService } from './auth.interface';
import { SignInDto } from './auth.dto';
import { CreateUserDto, DeleteUserDto, UserResponseDto } from '../users';
import {
    ApiTags,
    ApiOperation,
    ApiBody,
    ApiOkResponse,
    ApiUnauthorizedResponse,
    ApiConflictResponse
} from '@nestjs/swagger';
import { AuthGuard } from './auth.guard';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: IAuthService) { }

    @Post('signin')
    @ApiOperation({ summary: 'Sign in a user' })
    @ApiBody({ type: SignInDto })
    @ApiOkResponse({ type: UserResponseDto })
    @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
    async signIn(@Body() signInDto: SignInDto): Promise<UserResponseDto> {
        return this.authService.signIn(signInDto.username, signInDto.password);
    }

    @Post('signup')
    @ApiOperation({ summary: 'Sign up a new user' })
    @ApiBody({ type: CreateUserDto })
    @ApiOkResponse({ type: UserResponseDto })
    @ApiConflictResponse({ description: 'User already exists' })
    async signUp(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
        return this.authService.signUp(createUserDto);
    }

    @Post('signout')
    @ApiOperation({ summary: 'Sign out a user' })
    @ApiBody({ type: String })
    @ApiOkResponse({ description: 'User signed out successfully' })
    @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
    @UseGuards(AuthGuard)
    async signOut(@Body() token: string): Promise<void> {
        return this.authService.signOut(token);
    }

    @Delete('delete')
    @ApiOperation({ summary: 'Delete a user' })
    @ApiBody({ type: DeleteUserDto })
    @ApiOkResponse({ description: 'User deleted successfully' })
    @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
    @UseGuards(AuthGuard)
    async deleteUser(@Body() deleteUserDto: DeleteUserDto): Promise<string> {
        return this.authService.deleteUser(deleteUserDto);
    }
}
