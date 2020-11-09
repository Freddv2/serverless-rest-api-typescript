export class NotFoundError implements Error{
    name= 'NOT_FOUND'
    message: string;
    public constructor (id: string) {
        this.message =`ID "${id} not found`
    }
}

export class AlreadyExistsError implements Error {
    name= 'ALREADY_EXISTS'
    message: string;
    public constructor (name: string) {
        this.message =`ID "${name} already exists`
    }
}