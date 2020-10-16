import DynamoDbLocal from 'dynamodb-local'
import {DocumentClient} from "aws-sdk/lib/dynamodb/document_client";
import {PortfolioRepository} from "../../src/repository/PortfolioRepository";
import {testPortfolio1} from "../test-data";
import {assert} from "chai";
import DynamoDB from "aws-sdk/clients/dynamodb";

describe('Portfolio Repository', () => {
    const port = 8002
    let testDynamoDB : DynamoDB
    let testDocumentClient : DocumentClient
    let portfolioRepository : PortfolioRepository

    beforeAll(async () => {
        await DynamoDbLocal.launch(port, null, ['-sharedDb', '-inMemory'], true)
    })

    beforeEach(async () => {
        testDynamoDB = initTestDynamoDBClient(port)
        testDocumentClient = initTestDocumentClient(testDynamoDB)
        await createTableIfNotExists(testDynamoDB);
        portfolioRepository = new PortfolioRepository(testDocumentClient);
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

function initTestDynamoDBClient(port : number) {
    return new DynamoDB({
        endpointDiscoveryEnabled: false,
        endpoint: 'localhost:'+port,
        sslEnabled: false,
        region: 'local-env'
    })
}

function initTestDocumentClient(dynamodbClient: DynamoDB) {
    return new DynamoDB.DocumentClient({
        convertEmptyValues: true,
        endpoint: dynamodbClient.config.endpoint,
        sslEnabled: dynamodbClient.config.sslEnabled,
        region: dynamodbClient.config.region,
    });
}

async function tableExists(tableName: string, dynamoDB: DynamoDB) {
    const listTable = await dynamoDB.listTables().promise()
    if (listTable.TableNames) {
        return listTable.TableNames.some(name => name === tableName)
    }
    return false
}

async function createTableIfNotExists(dynamoDB: DynamoDB) {
    const tableName = 'DV2'
    const exist = await tableExists(tableName, dynamoDB)
    return exist ? Promise.resolve() : await createTable(dynamoDB)
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