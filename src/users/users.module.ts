import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { IUsersService } from './users.interface';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { MainDb } from '../infrastructure';
import { User } from "./users.entity";

@Module({
  controllers: [UsersController],
  providers: [
    {
      provide: IUsersService,
      useClass: UsersService,
    },
    {
      provide: UsersRepository,
      useFactory: (mainDb: MainDb) => {
        return new UsersRepository(mainDb.getRepository(User));
      },
      inject: [MainDb]
    }
  ],
  exports: [UsersRepository]
})
export class UsersModule { }
