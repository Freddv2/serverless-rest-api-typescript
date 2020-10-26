import DynamoDbLocal from "dynamodb-local";
import DynamoDB, {DocumentClient} from "aws-sdk/clients/dynamodb";
import {TableDefinition} from "@dv2/table-definition/src/TableDefinition";
import getPort from "get-port"

export class LocalDynamoDBServer {
    port!: number
    dynamoDBClient!: DynamoDB
    documentClient!: DocumentClient


    async start() {
        this.port = await getPort()
        this.dynamoDBClient = this.initDynamoDBClient()
        this.documentClient = this.initDocumentClient()
        await DynamoDbLocal.launch(this.port, null, ['-sharedDb', '-inMemory'], true)
        return this
    }

    stop() {
        DynamoDbLocal.stop(this.port)
        return this
    }

    async createTableIfNotExists() {
        const exist = await this.tableExists()
        if (exist) {
            return Promise.resolve()
        } else {
            return this.dynamoDBClient.createTable({
                TableName: TableDefinition.tableName,
                KeySchema: [
                    {'AttributeName': TableDefinition.pk, KeyType: 'HASH'},
                    {'AttributeName': TableDefinition.sk, KeyType: 'RANGE'},
                ],
                AttributeDefinitions: [
                    {'AttributeName': TableDefinition.pk, AttributeType: 'S'},
                    {'AttributeName': TableDefinition.sk, AttributeType: 'S'},
                ],
                ProvisionedThroughput: {
                    ReadCapacityUnits: 1,
                    WriteCapacityUnits: 1
                }
            }).promise()
        }
    }

    async deleteTableIfExists() {
        const exist = await this.tableExists()
        return exist ? this.dynamoDBClient.deleteTable({TableName: TableDefinition.tableName}).promise() : Promise.resolve()
    }

    async tableExists() {
        const listTable = await this.dynamoDBClient.listTables().promise()
        if (listTable.TableNames) {
            return listTable.TableNames.some(name => name === TableDefinition.tableName)
        }
        return false
    }

    private initDynamoDBClient() {
        return new DynamoDB({
            endpointDiscoveryEnabled: false,
            endpoint: 'localhost:'+this.port,
            sslEnabled: false,
            region: 'local-env'
        })
    }
    private initDocumentClient() {
        return new DynamoDB.DocumentClient({
            convertEmptyValues: true,
            endpoint: this.dynamoDBClient.config.endpoint,
            sslEnabled: this.dynamoDBClient.config.sslEnabled,
            region: this.dynamoDBClient.config.region,
        });
    }

    async getAnyAvailablePort() : Promise<number> {
        return getPort()
    }
}