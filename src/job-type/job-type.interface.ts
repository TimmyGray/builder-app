import {
    CreateJobTypeDto,
    UpdateJobTypeDto,
    DeleteJobTypeDto,
    JobTypeResponseDto
} from './job-type.dto';

export abstract class IJobTypeService {
    abstract createJobType(createJobTypeDto: CreateJobTypeDto): Promise<JobTypeResponseDto>;
    abstract updateJobType(updateJobTypeDto: UpdateJobTypeDto): Promise<JobTypeResponseDto>;
    abstract deleteJobType(deleteJobTypeDto: DeleteJobTypeDto): Promise<void>;
    abstract getJobTypeById(id: number): Promise<JobTypeResponseDto>;
    abstract getAllJobTypes(): Promise<JobTypeResponseDto[]>;
}
