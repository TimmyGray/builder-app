import { IsString, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateJobTypeDto {
    @ApiProperty({ description: 'The name of the job type', example: 'Bricklaying' })
    @IsString()
    @IsNotEmpty()
    name!: string;
}

export class UpdateJobTypeDto {
    @ApiProperty({ description: 'Id of the job type to update', example: 1 })
    @IsNotEmpty()
    @IsNumber()
    id!: number;

    @ApiProperty({ description: 'The new name of the job type', example: 'Plastering' })
    @IsString()
    @IsNotEmpty()
    name!: string;
}

export class JobTypeResponseDto {
    @ApiProperty({ description: 'The id of the job type', example: 1 })
    id!: number;

    @ApiProperty({ description: 'The name of the job type', example: 'Bricklaying' })
    name!: string;
}

export class DeleteJobTypeDto {
    @ApiProperty({ description: 'Id of the job type to delete', example: 1 })
    @IsNotEmpty()
    @IsNumber()
    id!: number;
}
