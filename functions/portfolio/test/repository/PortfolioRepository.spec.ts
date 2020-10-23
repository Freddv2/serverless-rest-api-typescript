import {testPortfolio1} from "../test-data";
import {assert} from "chai";
import {PortfolioRepository} from "../../src/repository/PortfolioRepository";
import {LocalDynamoDBServer} from "@dv2/test-dynamodb/src/LocalDynamoDBServer";

describe('Portfolio Repository', () => {
    let localDynamoDB: LocalDynamoDBServer
    let portfolioRepository: PortfolioRepository

    beforeAll(async () => {
        localDynamoDB = await new LocalDynamoDBServer().start()
    })

    beforeEach(async () => {
        await localDynamoDB.createTableIfNotExists()
        portfolioRepository = new PortfolioRepository(localDynamoDB.documentClient);
    })

    it('should find by ID, when it doest not exists', async () => {
        const portfolio = await portfolioRepository.findById(testPortfolio1.tenantId,'999')
        assert.isEmpty(portfolio)
    })

    afterEach(async () => {
        await localDynamoDB.deleteTableIfExists()
    })

    afterAll(() => {
        localDynamoDB.stop()
    })
})
