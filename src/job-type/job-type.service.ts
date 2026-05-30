import { Injectable } from '@nestjs/common';
import { IJobTypeService } from './job-type.interface';
import {
    CreateJobTypeDto,
    UpdateJobTypeDto,
    DeleteJobTypeDto,
    JobTypeResponseDto
} from './job-type.dto';
import { JobTypeRepository } from './job-type.repository';
import { JobType } from './job-type.entity';
import {
    JobTypeNotFoundException,
    JobTypeCreationException,
    JobTypeUpdateException,
    JobTypeDeletionException,
    JobTypeAlreadyExistsException,
    InternalJobTypeServiceException
} from './job-type.errors';

@Injectable()
export class JobTypeService implements IJobTypeService {
    constructor(private readonly jobTypeRepository: JobTypeRepository) { }

    async createJobType(createJobTypeDto: CreateJobTypeDto): Promise<JobTypeResponseDto> {
        const { name, description, measure } = createJobTypeDto;

        const existing = await this.jobTypeRepository.findOneByName(name);
        if (existing) {
            throw new JobTypeAlreadyExistsException(`A job type with name "${name}" already exists.`);
        }

        try {
            const jobType = await this.jobTypeRepository.insert({
                name,
                description: description ?? null,
                measure: measure ?? null,
            });
            return this.toResponse(jobType);
        } catch (error) {
            throw new JobTypeCreationException(`Failed to create job type with name "${name}"`);
        }
    }

    async updateJobType(updateJobTypeDto: UpdateJobTypeDto): Promise<JobTypeResponseDto> {
        const { id, name, description, measure } = updateJobTypeDto;

        const existingJobType = await this.jobTypeRepository.findOneById(id);
        if (!existingJobType) {
            throw new JobTypeNotFoundException(`The job type with id "${id}" was not found.`);
        }

        const duplicate = await this.jobTypeRepository.findOneByName(name);
        if (duplicate && duplicate.id !== id) {
            throw new JobTypeAlreadyExistsException(`A job type with name "${name}" already exists.`);
        }

        try {
            const updatedJobType = await this.jobTypeRepository.update(id, {
                name,
                description: description ?? null,
                measure: measure ?? null,
            });
            return this.toResponse(updatedJobType);
        } catch (error) {
            throw new JobTypeUpdateException(`Failed to update job type with id ${id}`);
        }
    }

    async deleteJobType(deleteJobTypeDto: DeleteJobTypeDto): Promise<void> {
        const { id } = deleteJobTypeDto;

        const existingJobType = await this.jobTypeRepository.findOneById(id);
        if (!existingJobType) {
            throw new JobTypeNotFoundException(`The job type with id "${id}" was not found.`);
        }

        try {
            await this.jobTypeRepository.deleteById(id);
        } catch (error) {
            throw new JobTypeDeletionException(`Failed to delete job type with id ${id}`);
        }
    }

    async getJobTypeById(id: number): Promise<JobTypeResponseDto> {
        const jobType = await this.jobTypeRepository.findOneById(id);
        if (!jobType) {
            throw new JobTypeNotFoundException(`The job type with id "${id}" was not found.`);
        }
        return this.toResponse(jobType);
    }

    async getAllJobTypes(): Promise<JobTypeResponseDto[]> {
        try {
            const jobTypes = await this.jobTypeRepository.findAll();
            return jobTypes.map(jobType => this.toResponse(jobType));
        } catch (error) {
            throw new InternalJobTypeServiceException();
        }
    }

    private toResponse(jobType: JobType): JobTypeResponseDto {
        return {
            id: jobType.id,
            name: jobType.name,
            description: jobType.description ?? null,
            measure: jobType.measure ?? null,
        };
    }
}
