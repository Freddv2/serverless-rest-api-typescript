import {DocumentClient} from "aws-sdk/clients/dynamodb";

const {Table,Entity} = require('dynamodb-toolbox')

export class SingleTableDefinition {
    static readonly tableName = 'DV2'
    static readonly pk = 'pk'
    static readonly sk = 'sk'

    readonly table : any

    constructor(documentClient: DocumentClient) {
        this.table = new Table({
            name: SingleTableDefinition.tableName,
            partitionKey: SingleTableDefinition.pk,
            sortKey: SingleTableDefinition.sk,
            entityField: false,
            DocumentClient: documentClient
        })
    }

    defineEntity(name: string, attributes : any) : any {
        return new Entity({
            name: name,
            attributes: attributes,
            table: this.table
        })
    }
}