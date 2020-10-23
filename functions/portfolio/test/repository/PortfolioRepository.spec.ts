import DynamoDbLocal from 'dynamodb-local'

import {testPortfolio1} from "../test-data";
import {assert} from "chai";
import DynamoDB from "aws-sdk/clients/dynamodb";
import {LocalDynamoDBServer} from "@dv2/test-dynamodb";
import {TableDefinition} from "@dv2/table-definition";
import {PortfolioRepository} from "../../src/repository/PortfolioRepository";

describe('Portfolio Repository', () => {
    let localDynamoDB = new LocalDynamoDBServer()
    let portfolioRepository

    beforeAll(async () => {
        localDynamoDB = await new LocalDynamoDBServer().start()
    })

    beforeEach(async () => {
        await localDynamoDB.createTableIfNotExists(TableDefinition.tableName)
        portfolioRepository = new PortfolioRepository(localDynamoDB.documentClient);
    })

    it('should find by ID, when it doest not exists', async () => {
        const portfolio = await portfolioRepository.findById(testPortfolio1.tenantId,'999')
        assert.isEmpty(portfolio)
    })

    afterEach(async () => {
        await deleteTableIfExists(testDynamoDB)
    })

    afterAll(() => {
        DynamoDbLocal.stop(port)
    })
})

async function tableExists(tableName: string, dynamoDB: DynamoDB) {
    const listTable = await dynamoDB.listTables().promise()
    if (listTable.TableNames) {
        return listTable.TableNames.some(name => name === tableName)
    }
    return false
}

async function deleteTableIfExists(dynamoDB: DynamoDB) {
    const tableName = 'DV2'
    const exist = await tableExists(tableName, dynamoDB)
    return exist ? await dynamoDB.deleteTable({TableName: 'DV2'}) : Promise.resolve()
}

async function createTable(dynamoDB: DynamoDB) {
    return dynamoDB.createTable({
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
            ReadCapacityUnits:1,
            WriteCapacityUnits:1
        }
    }).promise();
}