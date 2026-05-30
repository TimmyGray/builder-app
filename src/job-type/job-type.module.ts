import { Module } from '@nestjs/common';
import { JobTypeController } from './job-type.controller';
import { IJobTypeService } from './job-type.interface';
import { JobTypeService } from './job-type.service';
import { JobTypeRepository } from './job-type.repository';
import { JobType } from './job-type.entity';
import { MainDb } from '../infrastructure';
import { UsersModule } from '../users';

@Module({
  imports: [UsersModule],
  controllers: [JobTypeController],
  providers: [
    {
      provide: IJobTypeService,
      useClass: JobTypeService,
    },
    {
      provide: JobTypeRepository,
      useFactory: (mainDb: MainDb) => {
        return new JobTypeRepository(mainDb.getRepository(JobType));
      },
      inject: [MainDb]
    }
  ],
  exports: [JobTypeRepository]
})
export class JobTypeModule { }
