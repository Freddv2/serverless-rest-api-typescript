import DynamoDbLocal from 'dynamodb-local'
import {DocumentClient} from "aws-sdk/lib/dynamodb/document_client";
import {PortfolioRepository} from "../../src/repository/PortfolioRepository";
import {testPortfolio1} from "../test-data";
import {assert} from "chai";
import DynamoDB from "aws-sdk/clients/dynamodb";
import {EnvironmentCredentials} from "aws-sdk";

describe('Portfolio Repository', () => {
    const port = 8001
    let testDynamoDB : DynamoDB
    let testDocumentClient : DocumentClient
    let portfolioRepository : PortfolioRepository

    beforeAll(async () => {
        try {
            await DynamoDbLocal.launch(port, null, ['-sharedDb'], true)
        } catch (e) {
            console.error(e)
            process.exit()
        }
    })

    beforeEach(async () => {
        try {
            testDynamoDB = initTestDynamoDBClient(port)
            testDocumentClient = initTestDocumentClient(testDynamoDB)
            await createTable(testDynamoDB);
            portfolioRepository = new PortfolioRepository(testDocumentClient);
        } catch (e) {
            console.error(e)
            process.exit()
        }

    })

    it('should find by ID, when it doest not exists', async () => {
        const portfolio = await portfolioRepository.findById(testPortfolio1.tenantId,'999')
        assert.isUndefined(portfolio)
    })

    afterEach(async () => {
        await testDynamoDB.deleteTable().promise()
    })

    afterAll(() => {
        DynamoDbLocal.stop(port)
    })
})

function initTestDynamoDBClient(port : number) {
    return new DynamoDB({
        endpointDiscoveryEnabled: false,
        credentials: new EnvironmentCredentials('AWS'),
        endpoint: 'localhost:'+port,
        sslEnabled: false,
        region: 'local-env'
    })
}
function initTestDocumentClient(dynamodbClient : DynamoDB) {
    return new DynamoDB.DocumentClient({
        convertEmptyValues: true,
        endpoint: dynamodbClient.config.endpoint,
        sslEnabled: dynamodbClient.config.sslEnabled,
        region: dynamodbClient.config.region,
    });
}

function createTable(dynamoDBClient : DynamoDB) {
    return dynamoDBClient.createTable({
        TableName: 'DV2',
        KeySchema: [
            {'AttributeName': 'pk', KeyType: 'HASH'},
            {'AttributeName': 'sk', KeyType: 'RANGE'},
        ],
        AttributeDefinitions: [
            {'AttributeName': 'pk', AttributeType: 'S'},
            {'AttributeName': 'sk', AttributeType: 'RANGE'},
        ],
        ProvisionedThroughput: {
            ReadCapacityUnits:1,
            WriteCapacityUnits:1
        }
    }).promise();
}