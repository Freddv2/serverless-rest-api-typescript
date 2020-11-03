export interface Portfolio {
    tenantId: string
    id: string
    name: string
    description?: string
    assets?: Asset[]
    created?: Date
    modified?: Date
}

export interface Asset {
    symbol: string
    weight: number
}