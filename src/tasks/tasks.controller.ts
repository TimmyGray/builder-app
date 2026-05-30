import {
    Controller,
    Body,
    Get,
    Post,
    Patch,
    Delete,
    Param,
    ParseIntPipe,
    HttpCode,
    UseGuards
} from '@nestjs/common';
import { ITasksService } from './tasks.interface';
import {
    CreateTaskDto,
    UpdateTaskDto,
    DeleteTaskDto,
    TaskResponseDto
} from './tasks.dto';
import {
    ApiTags,
    ApiOperation,
    ApiBody,
    ApiParam,
    ApiOkResponse,
    ApiCreatedResponse,
    ApiNotFoundResponse,
    ApiUnauthorizedResponse,
    ApiHeader
} from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';

@ApiTags('Tasks')
@ApiHeader({ name: 'username', description: 'Username of an authenticated user', required: true })
@ApiUnauthorizedResponse({ description: 'Authentication required' })
@UseGuards(AuthGuard)
@Controller('tasks')
export class TasksController {
    constructor(private readonly tasksService: ITasksService) { }

    @Get()
    @ApiOperation({ summary: 'Get all tasks' })
    @ApiOkResponse({ description: 'List of tasks', type: [TaskResponseDto] })
    getAllTasks(): Promise<TaskResponseDto[]> {
        return this.tasksService.getAllTasks();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a task by id' })
    @ApiParam({ name: 'id', description: 'The id of the task', example: 1 })
    @ApiOkResponse({ description: 'The task', type: TaskResponseDto })
    @ApiNotFoundResponse({ description: 'Task not found' })
    getTaskById(@Param('id', ParseIntPipe) id: number): Promise<TaskResponseDto> {
        return this.tasksService.getTaskById(id);
    }

    @Post()
    @ApiOperation({ summary: 'Create a task' })
    @ApiBody({
        description: 'Data for creating a task', type: CreateTaskDto, examples: {
            basic: {
                summary: 'Basic example',
                value: { userId: 1, jobTypeId: 1 }
            }
        }
    })
    @ApiCreatedResponse({ description: 'The created task', type: TaskResponseDto })
    @ApiNotFoundResponse({ description: 'User or job type not found' })
    createTask(@Body() createTaskDto: CreateTaskDto): Promise<TaskResponseDto> {
        return this.tasksService.createTask(createTaskDto);
    }

    @Patch()
    @ApiOperation({ summary: 'Update a task (status, completion date and/or reassign user)' })
    @ApiBody({
        description: 'Data for updating a task', type: UpdateTaskDto, examples: {
            changeStatus: {
                summary: 'Change status',
                value: { id: 1, status: 'InProgress' }
            },
            reassignUser: {
                summary: 'Reassign to another user',
                value: { id: 1, userId: 2 }
            },
            complete: {
                summary: 'Mark completed',
                value: { id: 1, status: 'Completed', dateOfCompletion: '2026-05-30T12:00:00.000Z' }
            }
        }
    })
    @ApiOkResponse({ description: 'The updated task', type: TaskResponseDto })
    @ApiNotFoundResponse({ description: 'Task or target user not found' })
    updateTask(@Body() updateTaskDto: UpdateTaskDto): Promise<TaskResponseDto> {
        return this.tasksService.updateTask(updateTaskDto);
    }

    @Delete()
    @HttpCode(204)
    @ApiOperation({ summary: 'Delete a task' })
    @ApiBody({ description: 'Data for deleting a task', type: DeleteTaskDto })
    @ApiOkResponse({ description: 'Task deleted successfully' })
    @ApiNotFoundResponse({ description: 'Task not found' })
    deleteTask(@Body() deleteTaskDto: DeleteTaskDto): Promise<void> {
        return this.tasksService.deleteTask(deleteTaskDto);
    }
}
