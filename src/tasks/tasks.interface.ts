import { CreateTaskDto, UpdateTaskDto, DeleteTaskDto, TaskResponseDto } from './tasks.dto';

export abstract class ITasksService {
    abstract createTask(createTaskDto: CreateTaskDto): Promise<TaskResponseDto>;
    abstract updateTask(updateTaskDto: UpdateTaskDto): Promise<TaskResponseDto>;
    abstract deleteTask(deleteTaskDto: DeleteTaskDto): Promise<void>;
    abstract getTaskById(id: number): Promise<TaskResponseDto>;
    abstract getAllTasks(): Promise<TaskResponseDto[]>;
}
