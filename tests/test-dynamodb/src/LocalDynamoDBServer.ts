import DynamoDbLocal from "dynamodb-local";
import DynamoDB, {DocumentClient} from "aws-sdk/clients/dynamodb";
import {TableDefinition} from "@dv2/table-definition/src/TableDefinition";
import getPortSync = require("get-port-sync");

export class LocalDynamoDBServer {
    readonly port: number
    readonly dynamoDBClient: DynamoDB
    readonly documentClient: DocumentClient


    constructor(port?: number) {
        this.port = port ? port : getPortSync()
        this.dynamoDBClient = this.initDynamoDBClient()
        this.documentClient = this.initDocumentClient()
    }

    async start() {
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
            return await this.dynamoDBClient.createTable({
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
            })
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
}