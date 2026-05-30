import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    Index,
    UpdateDateColumn,
    CreateDateColumn,
    OneToMany
} from 'typeorm';
import { UserJobRole } from './users.dto';
import { Task } from '../tasks/tasks.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Index('IDX_user_username')
    @Column({ unique: true, nullable: false, length: 255, type: 'varchar' })
    username!: string;

    @Column({ nullable: false, length: 255, type: 'varchar', select: false })
    password!: string;

    @Column({ type: 'enum', nullable: false, default: UserJobRole.Builder, enum: UserJobRole })
    jobRole!: UserJobRole;

    @OneToMany(() => Task, (task) => task.user)
    tasks!: Task[];

    @CreateDateColumn({ type: 'timestamp' })
    createdAt!: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt!: Date;
}