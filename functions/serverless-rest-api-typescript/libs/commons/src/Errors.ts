import {Result} from "./Result";

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