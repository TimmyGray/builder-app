export abstract class MysqlConfig {
    abstract host: string;
    abstract port: number;
    abstract username: string;
    abstract password: string;
    abstract database: string;
}
