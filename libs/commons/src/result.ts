type AppError = Error | string

export class Result<T> {
    readonly isSuccess: boolean
    readonly isFailure: boolean
    readonly error?: AppError
    readonly value?: T

    private constructor (isSuccess: boolean, error?: AppError | string , value?: T) {
        if (isSuccess && error) {
            throw new Error("InvalidOperation: A result cannot be successful and contain an error");
        }

        if (!isSuccess && !error) {
            throw new Error("InvalidOperation: A failing result needs to contain an error message");
        }

        this.isSuccess = isSuccess;
        this.isFailure = !isSuccess;
        this.error = error;
        this.value = value;
    }

    public static ok<U> (value?: U) : Result<U> {
        return new Result<U>(true, undefined, value);
    }

    public static fail<U extends Error | string>(error: U): Result<U> {
        return new Result<U>(false, error);
    }
}