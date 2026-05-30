export class InvalidCredentialsException extends Error {
    constructor(message: string = 'Invalid credentials') {
        super(message);
        this.name = 'InvalidCredentialsException';
    }
}

export class UnauthorizedUserException extends Error {
    constructor(message: string = 'Unauthorized') {
        super(message);
        this.name = 'UnauthorizedUserException';
    }
}