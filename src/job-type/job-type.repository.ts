import { DeepPartial, Repository } from 'typeorm';
import { JobType } from './job-type.entity';

export class JobTypeRepository {
    constructor(private readonly repository: Repository<JobType>) { }

    async insert(jobType: DeepPartial<JobType>): Promise<JobType> {
        return await this.repository.save(jobType);
    }

    async findOneById(id: number): Promise<JobType | null> {
        return await this.repository.findOne({ where: { id } });
    }

    async findOneByName(name: string): Promise<JobType | null> {
        return await this.repository.findOne({ where: { name } });
    }

    async update(id: number, fields: DeepPartial<JobType>): Promise<JobType> {
        return await this.repository.save({ id, ...fields });
    }

    async deleteById(id: number): Promise<number> {
        await this.repository.delete({ id });
        return id;
    }

    async findAll(): Promise<JobType[]> {
        return await this.repository.find({ order: { name: 'ASC' } });
    }
}
