export class UserNotFoundException extends Error {
    constructor(message: string = 'User not found') {
        super(message);
        this.name = 'UserNotFoundException';
    }
}

export class UserCreationException extends Error {
    constructor(message: string = 'Failed to create user') {
        super(message);
        this.name = 'UserCreationException';
    }
}

export class UserUpdateException extends Error {
    constructor(message: string = 'Failed to update user') {
        super(message);
        this.name = 'UserUpdateException';
    }
}

export class UserDeletionException extends Error {
    constructor(message: string = 'Failed to delete user') {
        super(message);
        this.name = 'UserDeletionException';
    }
}

export class UserAlreadyExistsException extends Error {
    constructor(message: string = 'User already exists') {
        super(message);
        this.name = 'UserAlreadyExistsException';
    }
}

export class InternalUsersServiceException extends Error {
    constructor(message: string = 'An internal error occurred in the Users Service') {
        super(message);
        this.name = 'InternalUsersServiceException';
    }
}