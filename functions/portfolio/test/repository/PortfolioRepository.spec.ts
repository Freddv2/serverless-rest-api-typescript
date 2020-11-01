import {testPortfolio1} from "../test-data";
import * as chai from 'chai';
import {assert} from 'chai';
import chaiExclude from 'chai-exclude';
import {PortfolioRepository} from "../../src/repository/PortfolioRepository";
import {LocalDynamoDBServer} from "@dv2/test-dynamodb/src/LocalDynamoDBServer";

chai.use(chaiExclude)

describe('Portfolio Repository', () => {
    let localDynamoDB: LocalDynamoDBServer
    let portfolioRepository: PortfolioRepository

    beforeAll(async () => {
        localDynamoDB = await new LocalDynamoDBServer().start()
        portfolioRepository = new PortfolioRepository(localDynamoDB.documentClient);
    })

    beforeEach(async () => {
        await localDynamoDB.createTableIfNotExists();
    })

    it('should return undefined, when no portfolio exists', async () => {
        const portfolio = await portfolioRepository.findById(testPortfolio1.tenantId, '999')
        assert.isUndefined(portfolio)
    })

    it('should return portfolio by id, when it exists', async () => {
        await portfolioRepository.put(testPortfolio1)
        const portfolio = await portfolioRepository.findById(testPortfolio1.tenantId, testPortfolio1.id)
        assert.exists(portfolio)
        assert.deepEqualExcluding(portfolio!,testPortfolio1,['created','modified'])
    })

    afterEach(async () => {
        await localDynamoDB.deleteTableIfExists()
    })

    afterAll(() => {
        localDynamoDB.stop()
    })
})
