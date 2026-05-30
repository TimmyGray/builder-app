import { Config } from 'config';

export abstract class IConfig implements
    Pick<Config, 'util' | 'get' | 'has'> {
    abstract util: Config['util'];
    abstract get<T>(settings: string): T;
    abstract has(settings: string): boolean;
}
