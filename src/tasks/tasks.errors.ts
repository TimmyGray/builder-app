
export class TaskNotFoundException extends Error {
    constructor(message: string = 'Task not found') {
        super(message);
        this.name = 'TaskNotFoundException';
    }
}

export class TaskCreationException extends Error {
    constructor(message: string = 'Failed to create task') {
        super(message);
        this.name = 'TaskCreationException';
    }
}

export class TaskUpdateException extends Error {
    constructor(message: string = 'Failed to update task') {
        super(message);
        this.name = 'TaskUpdateException';
    }
}

export class TaskDeletionException extends Error {
    constructor(message: string = 'Failed to delete task') {
        super(message);
        this.name = 'TaskDeletionException';
    }
}