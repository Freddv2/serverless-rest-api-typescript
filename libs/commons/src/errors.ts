interface AppError {
    message: string;
    error?: any;
}

export interface NotFoundError extends AppError {
    public

    constructor(id: string)

{
    this
    .
    message
    = `ID "${
    id
}

 not found
`
}
}

export class AlreadyExistsError extends Result<AppError> {
public constructor (name: string) {
super(false, {
message: `
ID "$
{
    name
}
 already exists
`,
})
}
}