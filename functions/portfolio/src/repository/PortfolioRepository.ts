import {DocumentClient} from "aws-sdk/lib/dynamodb/document_client";
import {Portfolio} from "../domain/Portfolio";
import {TableDefinition} from "@dv2/table-definition";

const {Table,Entity} = require('dynamodb-toolbox')

export interface IPortfolioRepository {
    findById(tenantId :string, id: string) : Promise<Portfolio | undefined>
}

export class PortfolioRepository implements IPortfolioRepository {
    readonly documentClient : DocumentClient
    readonly table : any
    readonly entity : any

    constructor(documentClient: DocumentClient) {
        this.documentClient = documentClient
        this.table = this.createTableDefinition(documentClient)
        this.entity = this.createPortfolioEntity(this.table)
    }

    async findById(tenantId :string, id: string) : Promise<Portfolio | undefined> {
        return await this.entity.get({
            tenantId: tenantId,
            id: id
        }) as Portfolio | undefined;
    }
        /*let result = await this.documentClient.get({
            TableName: this.tableName,
            Key: {
                tenantId: tenantId,
                id:id,
            }
        }).promise()
        return result.Item ? this.itemToPortfolio(result.Item) : undefined;
    }

     private itemToPortfolio(item : AttributeMap) : Portfolio {
        return {
            tenantId: item["tenantId"],
            id: item["id"],
            name: item["name"],
            description: item["description"],
            assets: item["assets"],
            creationDate: item["creationDate"]
        }
     }*/

    private createTableDefinition(client : DocumentClient) : any {
        return new Table({
            name: TableDefinition.tableName,
            partitionKey: TableDefinition.pk,
            sortKey: TableDefinition.sk,
            DocumentClient: client
        })
    }
    private createPortfolioEntity(table : typeof Table) : any {

        return new Entity({
           name: 'Portfolio',
           attributes: {
               tenantId: {partitionKey: true},
               id: {sortKey: true},
               name: {required: true},
               description: {},
               assets: {type: 'list'}
           },
            table: table
       })
    }
}