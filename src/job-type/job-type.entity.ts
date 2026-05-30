import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Task } from '../tasks/tasks.entity';

@Entity()
export class JobType {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ nullable: false, length: 255, type: 'varchar', unique: true })
    name!: string;

    @OneToMany(() => Task, (task) => task.jobType)
    tasks!: Task[];
}