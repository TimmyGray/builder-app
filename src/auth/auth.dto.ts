import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignInDto {
    @ApiProperty({ description: 'The username of the user', example: 'John Doe' })
    @IsString()
    @IsNotEmpty()
    username!: string;

    @ApiProperty({ description: 'The password of the user', example: 'P@ssw0rd' })
    @IsString()
    @IsNotEmpty()
    password!: string;
}
