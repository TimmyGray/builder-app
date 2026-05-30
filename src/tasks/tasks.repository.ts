import { DeepPartial, Repository } from 'typeorm';
import { Task } from './tasks.entity';

export class TasksRepository {
    constructor(private readonly repository: Repository<Task>) { }

    async insert(task: DeepPartial<Task>): Promise<Task | null> {
        const saved = await this.repository.save(task);
        return await this.findOneById(saved.id);
    }

    async findOneById(id: number): Promise<Task | null> {
        return await this.repository.findOne({
            where: { id },
            relations: { user: true, jobType: true }
        });
    }

    async update(id: number, updateFields: DeepPartial<Task>): Promise<Task | null> {
        await this.repository.save({ id, ...updateFields });
        return await this.findOneById(id);
    }

    async deleteById(id: number): Promise<void> {
        await this.repository.delete({ id });
    }

    async findAll(): Promise<Task[]> {
        return await this.repository.find({
            order: { updatedAt: 'DESC' },
            relations: { user: true, jobType: true }
        });
    }
}
