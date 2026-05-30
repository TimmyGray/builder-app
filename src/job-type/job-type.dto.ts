import { IsString, IsNotEmpty, IsNumber, IsOptional, IsEnum, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Unit of measurement a job type's work is quantified in. A job type without a
 * measure records its work as a free-text description instead of a quantity.
 */
export enum Measure {
    Meter = 'm',
    Liter = 'liters',
    SquareMeter = 'm^2',
    CubicMeter = 'm^3',
    Kilogram = 'kg',
}

export class CreateJobTypeDto {
    @ApiProperty({ description: 'The name of the job type', example: 'Bricklaying' })
    @IsString()
    @IsNotEmpty()
    name!: string;

    @ApiPropertyOptional({ description: 'A description of the job type', example: 'Laying bricks and blockwork' })
    @IsOptional()
    @IsString()
    @MaxLength(500)
    description?: string;

    @ApiPropertyOptional({ description: 'The unit of measurement for the work', enum: Measure, example: Measure.CubicMeter })
    @IsOptional()
    @IsEnum(Measure)
    measure?: Measure;
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

    @ApiPropertyOptional({ description: 'A description of the job type', example: 'Laying bricks and blockwork' })
    @IsOptional()
    @IsString()
    @MaxLength(500)
    description?: string;

    @ApiPropertyOptional({ description: 'The unit of measurement for the work', enum: Measure, example: Measure.CubicMeter })
    @IsOptional()
    @IsEnum(Measure)
    measure?: Measure;
}

export class JobTypeResponseDto {
    @ApiProperty({ description: 'The id of the job type', example: 1 })
    id!: number;

    @ApiProperty({ description: 'The name of the job type', example: 'Bricklaying' })
    name!: string;

    @ApiProperty({ description: 'A description of the job type', example: 'Laying bricks and blockwork', nullable: true })
    description!: string | null;

    @ApiProperty({ description: 'The unit of measurement for the work', enum: Measure, example: Measure.CubicMeter, nullable: true })
    measure!: Measure | null;
}

export class DeleteJobTypeDto {
    @ApiProperty({ description: 'Id of the job type to delete', example: 1 })
    @IsNotEmpty()
    @IsNumber()
    id!: number;
}
