import { Repository } from 'typeorm';
import { User } from './users.entity';

export class UsersRepository {
    constructor(private readonly repository: Repository<User>) { }

    async insert(user: Partial<User>): Promise<User> {
        return await this.repository.save(user);
    }

    async findOneByUsername(username: string): Promise<User | null> {
        return await this.repository.findOne({ where: { username } });
    }

    async findOneByUsernameWithPassword(username: string): Promise<User | null> {
        return await this.repository
            .createQueryBuilder('user')
            .addSelect('user.password')
            .where('user.username = :username', { username })
            .getOne();
    }

    async updateUsername(id: number, username: string): Promise<User> {
        return await this.repository.save({ id, username });
    }

    async deleteByUsername(username: string): Promise<string> {
        await this.repository.delete({ username });
        return username;
    }

    async findAll(): Promise<User[]> {
        return await this.repository.find({ order: { updatedAt: 'DESC' } });
    }

    async findOneById(id: number): Promise<User | null> {
        return await this.repository.findOne({ where: { id } });
    }
}