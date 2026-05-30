import { Injectable, BadRequestException } from '@nestjs/common';
import { ITasksService } from './tasks.interface';
import {
    CreateTaskDto,
    TaskResponseDto,
    UpdateTaskDto,
    DeleteTaskDto,
    TaskStatus,
} from './tasks.dto';
import { TasksRepository } from './tasks.repository';
import { Task } from './tasks.entity';
import { UsersRepository, UserNotFoundException } from '../users';
import { JobTypeRepository, JobTypeNotFoundException } from '../job-type';
import { JobType } from '../job-type/job-type.entity';
import { Measure } from '../job-type/job-type.dto';
import {
    TaskNotFoundException,
    TaskCreationException,
    TaskUpdateException,
    TaskDeletionException,
} from './tasks.errors';

@Injectable()
export class TasksService implements ITasksService {
    constructor(
        private readonly tasksRepository: TasksRepository,
        private readonly usersRepository: UsersRepository,
        private readonly jobTypeRepository: JobTypeRepository,
    ) { }

    async createTask(createTaskDto: CreateTaskDto): Promise<TaskResponseDto> {
        const { userId, jobTypeId, quantity, scopeOfWork } = createTaskDto;

        await this.ensureUserExists(userId);
        const jobType = await this.getJobTypeOrThrow(jobTypeId);
        this.validateScope(jobType.measure, quantity, scopeOfWork);

        try {
            const task = await this.tasksRepository.insert({
                user: { id: userId },
                jobType: { id: jobTypeId },
                quantity: quantity ?? null,
                scopeOfWork: scopeOfWork ?? null,
            });
            if (!task) {
                throw new TaskCreationException(`Failed to create task for user with id ${userId}`);
            }
            return this.toResponse(task);
        } catch (error) {
            throw new TaskCreationException(`Failed to create task for user with id ${userId}`);
        }
    }

    async updateTask(updateTaskDto: UpdateTaskDto): Promise<TaskResponseDto> {
        const { id, status, dateOfCompletion, userId, quantity, scopeOfWork } = updateTaskDto;

        const existingTask = await this.tasksRepository.findOneById(id);
        if (!existingTask) {
            throw new TaskNotFoundException(`The task with id "${id}" was not found.`);
        }

        if (userId !== undefined) {
            await this.ensureUserExists(userId);
        }

        this.validateScope(existingTask.jobType.measure, quantity, scopeOfWork);

        try {
            const updatedTask = await this.tasksRepository.update(id, {
                user: userId !== undefined ? { id: userId } : undefined,
                status: dateOfCompletion !== undefined ? TaskStatus.Completed : status,
                dateOfCompletion: dateOfCompletion ? new Date(dateOfCompletion) : undefined,
                quantity: quantity !== undefined ? quantity : undefined,
                scopeOfWork: scopeOfWork !== undefined ? scopeOfWork : undefined,
            });
            if (!updatedTask) {
                throw new TaskNotFoundException(`The task with id "${id}" was not found.`);
            }
            return this.toResponse(updatedTask);
        } catch (error) {
            if (error instanceof TaskNotFoundException) {
                throw error;
            }
            throw new TaskUpdateException(`Failed to update task with id ${id}`);
        }
    }

    async deleteTask(deleteTaskDto: DeleteTaskDto): Promise<void> {
        const { id } = deleteTaskDto;

        const existingTask = await this.tasksRepository.findOneById(id);
        if (!existingTask) {
            throw new TaskNotFoundException(`The task with id "${id}" was not found.`);
        }

        try {
            await this.tasksRepository.deleteById(id);
        } catch (error) {
            throw new TaskDeletionException(`Failed to delete task with id ${id}`);
        }
    }

    async getTaskById(id: number): Promise<TaskResponseDto> {
        const task = await this.tasksRepository.findOneById(id);
        if (!task) {
            throw new TaskNotFoundException(`The task with id "${id}" was not found.`);
        }
        return this.toResponse(task);
    }

    async getAllTasks(): Promise<TaskResponseDto[]> {
        const tasks = await this.tasksRepository.findAll();
        return tasks.map(task => this.toResponse(task));
    }

    private async ensureUserExists(userId: number): Promise<void> {
        const user = await this.usersRepository.findOneById(userId);
        if (!user) {
            throw new UserNotFoundException(`The user with id "${userId}" was not found.`);
        }
    }

    private async getJobTypeOrThrow(jobTypeId: number): Promise<JobType> {
        const jobType = await this.jobTypeRepository.findOneById(jobTypeId);
        if (!jobType) {
            throw new JobTypeNotFoundException(`The job type with id "${jobTypeId}" was not found.`);
        }
        return jobType;
    }

    /**
     * Enforces the scope-of-work rule against the job type's measure:
     *   - a measured job type records a numeric `quantity`, not free text;
     *   - an unmeasured job type records a free-text `scopeOfWork`, not a quantity.
     * Only provided values are checked, so scope stays optional on create/update.
     */
    private validateScope(measure: Measure | null, quantity?: number, scopeOfWork?: string): void {
        if (quantity !== undefined && scopeOfWork !== undefined) {
            throw new BadRequestException('Provide either a quantity or a scope-of-work description, not both.');
        }
        if (measure) {
            if (scopeOfWork !== undefined) {
                throw new BadRequestException(`This job type is measured in "${measure}" — report a numeric quantity, not free text.`);
            }
        } else if (quantity !== undefined) {
            throw new BadRequestException('This job type has no measure — describe the work in scopeOfWork instead.');
        }
    }

    private toResponse(task: Task): TaskResponseDto {
        return {
            id: task.id,
            user: {
                id: task.user.id,
                username: task.user.username,
                jobRole: task.user.jobRole,
            },
            jobType: task.jobType.name,
            measure: task.jobType.measure ?? null,
            quantity: task.quantity ?? null,
            scopeOfWork: task.scopeOfWork ?? null,
            status: task.status,
            dateOfCompletion: task.dateOfCompletion ?? null,
            createdAt: task.createdAt,
            updatedAt: task.updatedAt,
        };
    }
}
