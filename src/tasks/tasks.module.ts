import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { ITasksService } from './tasks.interface';
import { TasksService } from './tasks.service';
import { TasksRepository } from './tasks.repository';
import { Task } from './tasks.entity';
import { MainDb } from '../infrastructure';
import { UsersModule } from '../users';
import { JobTypeModule } from '../job-type';

@Module({
  imports: [UsersModule, JobTypeModule],
  controllers: [TasksController],
  providers: [
    {
      provide: ITasksService,
      useClass: TasksService,
    },
    {
      provide: TasksRepository,
      useFactory: (mainDb: MainDb) => {
        return new TasksRepository(mainDb.getRepository(Task));
      },
      inject: [MainDb]
    }
  ],
  exports: [TasksRepository]
})
export class TasksModule { }
