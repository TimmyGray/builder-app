import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '../config';
import { MysqlConfig } from './database.config';
import { DataSource } from 'typeorm';

export abstract class MainDb extends DataSource { }

@Global()
@Module({
    imports: [ConfigModule.forFeature(MysqlConfig, 'mysql')],
    providers: [
        {
            provide: MainDb,
            useFactory: async (config: MysqlConfig): Promise<DataSource> => {
                if (!config.database || !config.host || !config.port || !config.username || !config.password) {
                    throw new Error('MySQL configuration is missing');
                }
                const dataSource = new DataSource({
                    type: 'mysql',
                    host: config.host,
                    port: config.port,
                    username: config.username,
                    password: config.password,
                    database: config.database,
                    entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
                    synchronize: process.env.NODE_ENV !== 'production',
                });

                return dataSource.initialize();
            },
            inject: [MysqlConfig],
        },
    ],
    exports: [MainDb],
})
export class DatabaseModule { }
