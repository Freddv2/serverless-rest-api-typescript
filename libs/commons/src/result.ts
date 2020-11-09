export class Result<T> {
    isSuccess: boolean
    isFailure: boolean
    error?: T | string
    private readonly _value?: T

    public constructor (isSuccess: boolean, error?: T | string , value?: T) {
        if (isSuccess && error) {
            throw new Error("InvalidOperation: A result cannot be successful and contain an error");
        }

        if (!isSuccess && !error) {
            throw new Error("InvalidOperation: A failing result needs to contain an error message");
        }

        this.isSuccess = isSuccess;
        this.isFailure = !isSuccess;
        this.error = error;
        this._value = value;

        Object.freeze(this);
    }

    public getValue () : T {
        if (!this.isSuccess) {
            return this.error as T;
        }
        return this._value as T;
    }

    public static ok<U> (value?: U) : Result<U> {
        return new Result<U>(true, undefined, value);
    }

    public static fail<U>(error: U): Result<U> {
        return new Result<U>(false, error);
    }
}