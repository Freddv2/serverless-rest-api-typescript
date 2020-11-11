import {Portfolio} from "./entity";
import {SingleTableDefinition} from "@dv2/dynamodb/src/SingleTableDefinition";
import {DocumentClient} from "aws-sdk/lib/dynamodb/document_client";

export class PortfolioRepository {
    readonly entity: any
    readonly table: any

    constructor(documentClient: DocumentClient) {
        const tableDef = new SingleTableDefinition(documentClient)
        this.entity = tableDef.createEntity('Portfolio', {
            tenantId: {partitionKey: true},
            id: {sortKey: true},
            name: {required: true},
            description: {},
            assets: {type: 'list'}
        })
        this.table = tableDef.table
    }

    async put(portfolio: Portfolio): Promise<void> {
        await this.entity.put(portfolio)
    }

    async findById(tenantId: string, id: string): Promise<Portfolio | undefined> {
        const result = await this.entity.get({
            tenantId: tenantId,
            id: id
        })
        return result.Item
    }

    async findByName(tenantId: string, name: string): Promise<Portfolio | undefined> {
        const result = await this.table.query(tenantId,{
            limit: 1,
            filters: { attr: 'name', eq: name}
        })
        return result.Items ? result.Items[0] : undefined
    }

    async findAllByTenant(tenantId: string) : Promise<Portfolio[]> {
        return await this.table.query(tenantId)
    }

    async findLikeName(tenantId: string, name: string) : Promise<Portfolio[]>{
        return await this.table.query(tenantId,{
            filters: { attr: 'name', contains: name}
        })
    }

    async delete(tenantId: string, id: string): Promise<void> {
        return await this.entity.delete({
            tenantId: tenantId,
            id: id
        })
    }
}