import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Task } from '../tasks/tasks.entity';
import { Measure } from './job-type.dto';

@Entity('job_types')
export class JobType {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ nullable: false, length: 255, type: 'varchar', unique: true })
    name!: string;

    @Column({ type: 'varchar', length: 500, nullable: true })
    description!: string | null;

    @Column({ type: 'enum', enum: Measure, nullable: true })
    measure!: Measure | null;

    @OneToMany(() => Task, (task) => task.jobType)
    tasks!: Task[];
}