import {Asset} from "./Asset";

export interface Portfolio {
    tenantId: string
    id: string
    name: string
    description?: string
    assets?: Asset[]
    creationDate?: Date
}

