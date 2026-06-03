import { IsNotEmpty, IsEnum, IsOptional, IsNumber, IsDateString, IsString, IsPositive, MaxLength, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
// Import directly from the dto files (not the barrels) to avoid a circular
// dependency: a barrel pulls in its entity, which imports the tasks barrel back.
import { UserJobRole } from '../users/users.dto';
import { Measure } from '../job-type/job-type.dto';

export enum TaskStatus {
    TBD = 'ToBeDone',
    InProgress = 'InProgress',
    Completed = 'Completed',
    Cancelled = 'Cancelled'
}

export class CreateTaskDto {
    @ApiProperty({ description: 'Id of the user the task is assigned to', example: 1 })
    @IsNotEmpty()
    @IsNumber()
    userId!: number;

    @ApiProperty({ description: 'Id of the job type for the task', example: 1 })
    @IsNotEmpty()
    @IsNumber()
    jobTypeId!: number;

    @ApiPropertyOptional({ description: 'Initial status of the task (defaults to ToBeDone)', enum: TaskStatus, example: TaskStatus.TBD })
    @IsOptional()
    @IsEnum(TaskStatus)
    status?: TaskStatus;

    @ApiPropertyOptional({ description: 'Completion date when creating an already-completed task (ISO 8601); also forces status to Completed', example: '2026-05-30T12:00:00.000Z' })
    @IsOptional()
    @IsDateString()
    dateOfCompletion?: string;

    @ApiPropertyOptional({ description: 'Amount of work done, in the job type\'s measure (only when the job type has a measure)', example: 24 })
    @IsOptional()
    @IsNumber()
    @IsPositive()
    quantity?: number;

    @ApiPropertyOptional({ description: 'Free-text description of the work done (only when the job type has no measure)', example: 'Cleared and swept the site' })
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @MaxLength(500)
    scopeOfWork?: string;
}

export class UpdateTaskDto {
    @ApiProperty({ description: 'Id of the task to update', example: 1 })
    @IsNotEmpty()
    @IsNumber()
    id!: number;

    @ApiPropertyOptional({ description: 'The new status of the task', enum: TaskStatus, example: TaskStatus.InProgress })
    @IsOptional()
    @IsEnum(TaskStatus)
    status?: TaskStatus;

    @ApiPropertyOptional({ description: 'The completion date of the task (ISO 8601)', example: '2026-05-30T12:00:00.000Z' })
    @IsOptional()
    @IsDateString()
    dateOfCompletion?: string;

    @ApiPropertyOptional({ description: 'Id of the user to reassign the task to', example: 2 })
    @IsOptional()
    @IsNumber()
    userId?: number;

    @ApiPropertyOptional({ description: 'Amount of work done, in the job type\'s measure (only when the job type has a measure)', example: 24 })
    @IsOptional()
    @IsNumber()
    @IsPositive()
    quantity?: number;

    @ApiPropertyOptional({ description: 'Free-text description of the work done (only when the job type has no measure)', example: 'Cleared and swept the site' })
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @MaxLength(500)
    scopeOfWork?: string;
}

export class TaskUserDto {
    @ApiProperty({ description: 'The id of the user', example: 1 })
    id!: number;

    @ApiProperty({ description: 'The username of the user', example: 'John Doe' })
    username!: string;

    @ApiProperty({ description: 'The job role of the user', enum: UserJobRole, example: UserJobRole.Builder })
    jobRole!: UserJobRole;
}

export class TaskResponseDto {
    @ApiProperty({ description: 'The id of the task', example: 1 })
    id!: number;

    @ApiProperty({ description: 'The user the task is assigned to', type: TaskUserDto })
    user!: TaskUserDto;

    @ApiProperty({ description: 'The name of the job type', example: 'Bricklaying' })
    jobType!: string;

    @ApiProperty({ description: "The job type's unit of measurement, if any", enum: Measure, example: Measure.CubicMeter, nullable: true })
    measure!: Measure | null;

    @ApiProperty({ description: "Amount of work done, in the job type's measure", example: 24, nullable: true })
    quantity!: number | null;

    @ApiProperty({ description: 'Free-text description of the work done (when the job type has no measure)', example: 'Cleared and swept the site', nullable: true })
    scopeOfWork!: string | null;

    @ApiProperty({ description: 'The status of the task', enum: TaskStatus, example: TaskStatus.TBD })
    status!: TaskStatus;

    @ApiProperty({ description: 'The completion date of the task', example: '2026-05-30T12:00:00.000Z', nullable: true })
    dateOfCompletion!: Date | null;

    @ApiProperty({ description: 'When the task was created' })
    createdAt!: Date;

    @ApiProperty({ description: 'When the task was last updated' })
    updatedAt!: Date;
}

export class DeleteTaskDto {
    @ApiProperty({ description: 'Id of the task to delete', example: 1 })
    @IsNotEmpty()
    @IsNumber()
    id!: number;
}

export class GetTasksQueryDto {
    @ApiPropertyOptional({ description: 'Number of tasks per page (1–100)', example: 10, default: 10 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(100)
    limit?: number;

    @ApiPropertyOptional({ description: 'Opaque cursor returned by the previous page; absent means first page' })
    @IsOptional()
    @IsString()
    cursor?: string;
}

export class CursorTasksResponseDto {
    @ApiProperty({ description: 'Tasks for the current page', type: [TaskResponseDto] })
    data!: TaskResponseDto[];

    @ApiProperty({ description: 'Cursor to pass as `cursor` to fetch the next page; null when there are no more pages', nullable: true })
    nextCursor!: string | null;

    @ApiProperty({ description: 'Whether more pages exist after this one' })
    hasNext!: boolean;
}
