import { Injectable } from '@nestjs/common';
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
        const { userId, jobTypeId } = createTaskDto;

        await this.ensureUserExists(userId);
        await this.ensureJobTypeExists(jobTypeId);

        try {
            const task = await this.tasksRepository.insert({
                user: { id: userId },
                jobType: { id: jobTypeId },
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
        const { id, status, dateOfCompletion, userId } = updateTaskDto;

        const existingTask = await this.tasksRepository.findOneById(id);
        if (!existingTask) {
            throw new TaskNotFoundException(`The task with id "${id}" was not found.`);
        }

        if (userId !== undefined) {
            await this.ensureUserExists(userId);
        }

        try {
            const updatedTask = await this.tasksRepository.update(id, {
                user: userId !== undefined ? { id: userId } : undefined,
                status: dateOfCompletion !== undefined ? TaskStatus.Completed : status,
                dateOfCompletion: dateOfCompletion ? new Date(dateOfCompletion) : undefined,
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

    private async ensureJobTypeExists(jobTypeId: number): Promise<void> {
        const jobType = await this.jobTypeRepository.findOneById(jobTypeId);
        if (!jobType) {
            throw new JobTypeNotFoundException(`The job type with id "${jobTypeId}" was not found.`);
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
            status: task.status,
            dateOfCompletion: task.dateOfCompletion ?? null,
            createdAt: task.createdAt,
            updatedAt: task.updatedAt,
        };
    }
}
