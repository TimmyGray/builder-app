import { Module, Global, DynamicModule } from '@nestjs/common';
import { IConfig } from './config.interface';
import appConfig from 'config';

@Global()
@Module({})
export class ConfigModule {
    public static forRoot(): DynamicModule {
        return {
            module: ConfigModule,
            providers: [
                {
                    provide: IConfig,
                    useValue: appConfig,
                },
            ],
            exports: [
                IConfig,
            ]
        }
    }

    public static forFeature<T>(type: abstract new () => T, key: string): DynamicModule {
        return {
            module: ConfigModule,
            providers: [
                {
                    provide: type,
                    useFactory: (config: IConfig) => {
                        if (!config.has(key)) {
                            throw new Error(`Configuration key "${key}" is missing`);
                        }
                        return config.get<T>(key);
                    },
                    inject: [IConfig],
                },
            ],
            exports: [type],
        }
    }
}
