import { IsNotEmpty, IsEnum, IsOptional, IsNumber, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
// Import directly from the dto file (not the '../users' barrel) to avoid a circular
// dependency: the barrel pulls in users.entity, which imports the tasks barrel back.
import { UserJobRole } from '../users/users.dto';

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
