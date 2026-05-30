import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    UpdateDateColumn,
    CreateDateColumn
} from 'typeorm';
import { User } from '../users/users.entity';
import { JobType } from '../job-type/job-type.entity';
import { TaskStatus } from './tasks.dto';

@Entity()
export class Task {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => User, (user) => user.tasks, { nullable: false })
    user!: User;

    @ManyToOne(() => JobType, { nullable: false })
    jobType!: JobType;

    @Column({ type: 'enum', enum: TaskStatus, default: TaskStatus.TBD })
    status!: TaskStatus;

    @Column({ type: 'timestamp', nullable: true })
    dateOfCompletion!: Date;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt!: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt!: Date;
}