export class NotFoundError implements Error{
    readonly name= 'NOT_FOUND'
    readonly message: string;
    public constructor (id: string) {
        this.message =`ID "${id} not found`
    }
}

export class AlreadyExistsError implements Error {
    readonly name= 'ALREADY_EXISTS'
    readonly message: string;
    public constructor (name: string) {
        this.message =`ID "${name} already exists`
    }
}