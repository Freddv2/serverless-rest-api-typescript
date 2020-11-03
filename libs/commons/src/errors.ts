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