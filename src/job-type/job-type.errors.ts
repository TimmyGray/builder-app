export class JobTypeNotFoundException extends Error {
    constructor(message: string = 'Job type not found') {
        super(message);
        this.name = 'JobTypeNotFoundException';
    }
}

export class JobTypeCreationException extends Error {
    constructor(message: string = 'Failed to create job type') {
        super(message);
        this.name = 'JobTypeCreationException';
    }
}

export class JobTypeUpdateException extends Error {
    constructor(message: string = 'Failed to update job type') {
        super(message);
        this.name = 'JobTypeUpdateException';
    }
}

export class JobTypeDeletionException extends Error {
    constructor(message: string = 'Failed to delete job type') {
        super(message);
        this.name = 'JobTypeDeletionException';
    }
}

export class JobTypeAlreadyExistsException extends Error {
    constructor(message: string = 'Job type already exists') {
        super(message);
        this.name = 'JobTypeAlreadyExistsException';
    }
}

export class InternalJobTypeServiceException extends Error {
    constructor(message: string = 'An internal error occurred in the Job Type Service') {
        super(message);
        this.name = 'InternalJobTypeServiceException';
    }
}
