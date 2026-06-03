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

    async findWithCursor(
        limit: number,
        cursor?: { updatedAt: Date; id: number },
    ): Promise<[Task[], boolean]> {
        const qb = this.repository
            .createQueryBuilder('task')
            .leftJoinAndSelect('task.user', 'user')
            .leftJoinAndSelect('task.jobType', 'jobType')
            .orderBy('task.updatedAt', 'DESC')
            .addOrderBy('task.id', 'DESC')
            .take(limit + 1);

        if (cursor) {
            qb.where(
                '(task.updatedAt < :updatedAt) OR (task.updatedAt = :updatedAt AND task.id < :id)',
                { updatedAt: cursor.updatedAt, id: cursor.id },
            );
        }

        const rows = await qb.getMany();
        const hasNext = rows.length > limit;
        if (hasNext) rows.pop();
        return [rows, hasNext];
    }
}
