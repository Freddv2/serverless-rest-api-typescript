import DynamoDbLocal from "dynamodb-local";
import getPort = require("get-port");
import DynamoDB, { DocumentClient } from "aws-sdk/clients/dynamodb";

export class LocalDynamoDBServer {
    port!: number
    dynamoDBClient!: DynamoDB
    documentClient!: DocumentClient

    async start(port? : number) {
        this.port = port ? port : await getPort();
        await DynamoDbLocal.launch(this.port, null, ['-sharedDb', '-inMemory'], true)
        this.dynamoDBClient = this.initDynamoDBClient()
        this.documentClient = this.initDocumentClient()
    }

    stop() {
        DynamoDbLocal.stop(this.port)
    }

    async createTableIfNotExists(tableName: string) {
        const exist = await this.tableExists(tableName)
        if(exist) {
            return Promise.resolve()
        } else {
            return await this.dynamoDBClient.createTable({
                TableName: 'DV2',
                KeySchema: [
                    {'AttributeName': 'pk', KeyType: 'HASH'},
                    {'AttributeName': 'sk', KeyType: 'RANGE'},
                ],
                AttributeDefinitions: [
                    {'AttributeName': 'pk', AttributeType: 'S'},
                    {'AttributeName': 'sk', AttributeType: 'S'},
                ],
                ProvisionedThroughput: {
                    ReadCapacityUnits: 1,
                    WriteCapacityUnits: 1
                }
            })
        }
    }

    async deleteTableIfExists(tableName: string) {
        const exist = await this.tableExists(tableName)
        return exist ? this.dynamoDBClient.deleteTable({TableName: tableName}).promise() : Promise.resolve()
    }

    async tableExists(tableName: string) {
        const listTable = await this.dynamoDBClient.listTables().promise()
        if (listTable.TableNames) {
            return listTable.TableNames.some(name => name === tableName)
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
}