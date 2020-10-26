import {testPortfolio1} from "../test-data";
import {assert} from "chai";
import {PortfolioRepository} from "../../src/repository/PortfolioRepository";
import {LocalDynamoDBServer} from "@dv2/test-dynamodb/src/LocalDynamoDBServer";
import {TableDefinition} from "@dv2/table-definition/src/TableDefinition";

describe('Portfolio Repository', () => {
    let localDynamoDB: LocalDynamoDBServer
    let portfolioRepository: PortfolioRepository

    beforeAll(async () => {
        localDynamoDB = await new LocalDynamoDBServer().start()
    })

    beforeEach(async () => {
        await localDynamoDB.createTableIfNotExists();
        portfolioRepository = new PortfolioRepository(localDynamoDB.documentClient);
    })

    it('should return null, when no portfolio exists', async () => {
        const portfolio = await portfolioRepository.findById(testPortfolio1.tenantId,'999')
        assert.isUndefined(portfolio)
    })

    it('should find by ID, when it doest not exists', async () => {
        await localDynamoDB.documentClient.put({
            TableName: TableDefinition.tableName,
            Item: {
                [TableDefinition.pk] : testPortfolio1.tenantId,
                [TableDefinition.sk] : testPortfolio1.id},
                ...testPortfolio1

        }).promise()
        const portfolio = await portfolioRepository.findById(testPortfolio1.tenantId,testPortfolio1.id)
        assert.equal(portfolio,testPortfolio1)
    })


    afterEach(async () => {
        await localDynamoDB.deleteTableIfExists()
    })

    afterAll(() => {
        localDynamoDB.stop()
    })
})
