import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    UpdateDateColumn,
    CreateDateColumn,
    Index
} from 'typeorm';
import { User } from '../users/users.entity';
import { JobType } from '../job-type/job-type.entity';
import { TaskStatus } from './tasks.dto';

// TypeORM reads DECIMAL columns back as strings; this keeps `quantity` numeric.
const decimalTransformer = {
    to: (value?: number | null): number | null | undefined => value,
    from: (value?: string | null): number | null => (value == null ? null : parseFloat(value)),
};

@Entity('tasks')
@Index(['updatedAt', 'id'])
export class Task {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => User, (user) => user.tasks, { nullable: false })
    user!: User;

    @ManyToOne(() => JobType, { nullable: false })
    jobType!: JobType;

    @Column({ type: 'enum', enum: TaskStatus, default: TaskStatus.TBD })
    status!: TaskStatus;

    @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true, transformer: decimalTransformer })
    quantity!: number | null;

    @Column({ type: 'varchar', length: 500, nullable: true })
    scopeOfWork!: string | null;

    @Column({ type: 'timestamp', nullable: true })
    dateOfCompletion!: Date;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt!: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt!: Date;
}