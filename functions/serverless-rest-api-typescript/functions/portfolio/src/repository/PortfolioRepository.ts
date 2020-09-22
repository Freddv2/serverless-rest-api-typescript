import {DocumentClient} from "aws-sdk/lib/dynamodb/document_client";
import {Portfolio} from "../domain/Portfolio";
import AttributeMap = DocumentClient.AttributeMap;

export interface IPortfolioRepository {
    findById(tenantId :string, id: string) : Promise<Portfolio | undefined>
}

export class PortfolioRepository implements IPortfolioRepository {
    readonly tableName = "PORTFOLIO"
    readonly dynamoDB : DocumentClient

    constructor(dynamoDB: DocumentClient) {
        this.dynamoDB = dynamoDB
    }

    async findById(tenantId :string, id: string) : Promise<Portfolio | undefined>{
        let result = await this.dynamoDB.get({
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
     }
}