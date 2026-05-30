import { IsString, IsNotEmpty, IsEnum, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum UserJobRole {
    Builder = 'Builder',
    Supervisor = 'Supervisor',
}

export class CreateUserDto {
    @ApiProperty({ description: 'The name of the user', example: 'John Doe' })
    @IsString()
    @IsNotEmpty()
    username!: string;

    @ApiProperty({ description: 'The password of the user', example: 'P@ssw0rd' })
    @IsString()
    @IsNotEmpty()
    password!: string;

    @ApiProperty({ description: 'The job role of the user', example: 'Builder' })
    @IsString()
    @IsNotEmpty()
    @IsEnum(UserJobRole)
    jobRole!: UserJobRole;
}

export class UpdateUserDto {
    @ApiProperty({ description: 'Id of the user to update', example: 1 })
    @IsNotEmpty()
    @IsNumber()
    id!: number;

    @ApiProperty({ description: 'The new name of the user', example: 'John Smith' })
    @IsString()
    @IsNotEmpty()
    username!: string;
}

export class UserResponseDto {
    id!: number;
    username!: string;
    jobRole!: UserJobRole;
    createdAt!: Date;
    updatedAt!: Date;
}

export class DeleteUserDto {
    @ApiProperty({ description: 'The name of the user', example: 'John Doe' })
    @IsString()
    @IsNotEmpty()
    username!: string;

    @ApiProperty({ description: 'The password of the user', example: 'P@ssw0rd' })
    @IsString()
    @IsNotEmpty()
    password!: string;
}