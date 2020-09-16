import {DocumentClient} from "aws-sdk/lib/dynamodb/document_client";
import {Portfolio} from "../domain/Portfolio";
import AttributeMap = DocumentClient.AttributeMap;
import {IPortfolioRepository} from "./IPortfolioRepository";

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
         let portfolio = new Portfolio(item["tenantId"],item["id"],item["name"])
         portfolio.description = item["tenantId"]
         portfolio.assets = item["assets"]
         portfolio.creationDate = item["creationDate"]
         return portfolio
     }
}