import { Module } from '@nestjs/common';
import { AuthModule } from './auth';
import { UsersModule } from './users';
import { TasksModule } from './tasks';
import { ConfigModule, DatabaseModule } from './infrastructure';
import { JobTypeModule } from './job-type';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    TasksModule,
    ConfigModule.forRoot(),
    DatabaseModule,
    JobTypeModule
  ],
})
export class AppModule { }
