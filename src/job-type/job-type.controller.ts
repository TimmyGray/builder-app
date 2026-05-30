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
import { IJobTypeService } from './job-type.interface';
import {
    CreateJobTypeDto,
    UpdateJobTypeDto,
    DeleteJobTypeDto,
    JobTypeResponseDto
} from './job-type.dto';
import {
    ApiTags,
    ApiOperation,
    ApiBody,
    ApiParam,
    ApiOkResponse,
    ApiCreatedResponse,
    ApiNotFoundResponse,
    ApiConflictResponse,
    ApiUnauthorizedResponse,
    ApiHeader
} from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';

@ApiTags('Job Types')
@ApiHeader({ name: 'username', description: 'Username of an authenticated user', required: true })
@ApiUnauthorizedResponse({ description: 'Authentication required' })
@UseGuards(AuthGuard)
@Controller('job-types')
export class JobTypeController {
    constructor(private readonly jobTypeService: IJobTypeService) { }

    @Get()
    @ApiOperation({ summary: 'Get all job types' })
    @ApiOkResponse({ description: 'List of job types', type: [JobTypeResponseDto] })
    getAllJobTypes(): Promise<JobTypeResponseDto[]> {
        return this.jobTypeService.getAllJobTypes();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a job type by id' })
    @ApiParam({ name: 'id', description: 'The id of the job type', example: 1 })
    @ApiOkResponse({ description: 'The job type', type: JobTypeResponseDto })
    @ApiNotFoundResponse({ description: 'Job type not found' })
    getJobTypeById(@Param('id', ParseIntPipe) id: number): Promise<JobTypeResponseDto> {
        return this.jobTypeService.getJobTypeById(id);
    }

    @Post()
    @ApiOperation({ summary: 'Create a job type' })
    @ApiBody({ description: 'Data for creating a job type', type: CreateJobTypeDto })
    @ApiCreatedResponse({ description: 'The created job type', type: JobTypeResponseDto })
    @ApiConflictResponse({ description: 'Job type already exists' })
    createJobType(@Body() createJobTypeDto: CreateJobTypeDto): Promise<JobTypeResponseDto> {
        return this.jobTypeService.createJobType(createJobTypeDto);
    }

    @Patch()
    @ApiOperation({ summary: 'Update a job type' })
    @ApiBody({ description: 'Data for updating a job type', type: UpdateJobTypeDto })
    @ApiOkResponse({ description: 'The updated job type', type: JobTypeResponseDto })
    @ApiNotFoundResponse({ description: 'Job type not found' })
    @ApiConflictResponse({ description: 'Job type already exists' })
    updateJobType(@Body() updateJobTypeDto: UpdateJobTypeDto): Promise<JobTypeResponseDto> {
        return this.jobTypeService.updateJobType(updateJobTypeDto);
    }

    @Delete()
    @HttpCode(204)
    @ApiOperation({ summary: 'Delete a job type' })
    @ApiBody({ description: 'Data for deleting a job type', type: DeleteJobTypeDto })
    @ApiOkResponse({ description: 'Job type deleted successfully' })
    @ApiNotFoundResponse({ description: 'Job type not found' })
    deleteJobType(@Body() deleteJobTypeDto: DeleteJobTypeDto): Promise<void> {
        return this.jobTypeService.deleteJobType(deleteJobTypeDto);
    }
}
