import {Portfolio} from "./entity";
import {SingleTableDefinition} from "@dv2/dynamodb/src/SingleTableDefinition";
import { DocumentClient } from "aws-sdk/lib/dynamodb/document_client";

export class Repository {
    readonly entity: any
    readonly tableDef: SingleTableDefinition

    constructor(documentClient: DocumentClient) {
        this.tableDef = new SingleTableDefinition(documentClient)
        this.entity = this.tableDef.createEntity('Portfolio',{
            tenantId: {partitionKey: true},
            id: {sortKey: true},
            name: {required: true},
            description: {},
            assets: {type: 'list'}
        })
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
}