import {Result} from "./result";

interface AppError {
    message: string;
    error?: any;
}

export class NotFoundError extends Result<AppError> {
    public constructor (id: string) {
        super(false, {
            message: `ID "${id} not found`,
        })
    }
}

export class AlreadyExistsError extends Result<AppError> {
    public constructor (name: string) {
        super(false, {
            message: `ID "${name} already exists `,
        })
    }
}