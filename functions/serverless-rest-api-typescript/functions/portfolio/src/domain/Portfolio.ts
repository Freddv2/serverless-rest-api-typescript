import {Asset} from "./Asset";

export class Portfolio {
    tenantId: string
    id: string
    name: string
    description?: string
    assets?: Asset[]
    creationDate?: Date

    constructor(tenantId: string, id: string, name: string) {
        this.tenantId = tenantId;
        this.id = id;
        this.name = name;
    }
}

