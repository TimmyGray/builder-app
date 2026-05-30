import { Module } from '@nestjs/common';
import { ConfigModule } from '../infrastructure';
import { AuthService } from './auth.service';
import { IAuthService } from './auth.interface';
import { AuthController } from './auth.controller';
import { AuthConfig } from './auth.config';
import { UsersModule } from '../users';

@Module({
    imports: [ConfigModule.forFeature(AuthConfig, 'auth'), UsersModule],
    controllers: [AuthController],
    providers: [
        {
            provide: IAuthService,
            useClass: AuthService
        },
    ]
})
export class AuthModule { }
