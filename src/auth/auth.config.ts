
export abstract class AuthConfig {
    /** bcrypt cost factor; a fresh random salt is generated per password. */
    abstract rounds: number;
}