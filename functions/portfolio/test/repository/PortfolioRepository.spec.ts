import DynamoDbLocal from 'dynamodb-local'
import {DocumentClient} from "aws-sdk/lib/dynamodb/document_client";
import {PortfolioRepository} from "../../src/repository/PortfolioRepository";
import {testPortfolio1} from "../test-data";
import {assert} from "chai";
import DynamoDB from "aws-sdk/clients/dynamodb";

describe('Portfolio Repository', () => {
    const port = 8000
    let testDynamoDB : DynamoDB
    let testDocumentClient : DocumentClient
    let portfolioRepository : PortfolioRepository

    beforeAll(() => {
        DynamoDbLocal.launch(port,null,['-sharedDb'],true)
        testDynamoDB = new DynamoDB()
        testDocumentClient = initTestDynamoDBClient(port)
        createTable(testDynamoDB)
        portfolioRepository = new PortfolioRepository(testDocumentClient)
    })

    it('should find by ID, when it doest not exists', async () => {
        const portfolio = await portfolioRepository.findById(testPortfolio1.tenantId,'999')
        assert.isUndefined(portfolio)
    })

    afterAll(() => {
        DynamoDbLocal.stop(port)
    })
})

function initTestDynamoDBClient(port : number) : DocumentClient {
    return new DynamoDB.DocumentClient({
        convertEmptyValues: true,
            endpoint: 'localhost:'+port,
            sslEnabled: false,
            region: 'local-env',
    });
}

function createTable(dynamoDBClient : DynamoDB) {
    dynamoDBClient.createTable({
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
    })
}

function dropTable() {

}