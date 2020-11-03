import {Service} from "../src/service";
import {Repository} from "../src/repository";
import {instance, mock, when} from "ts-mockito";
import {assert} from "chai"
import {testPortfolio1} from "./test-data";

describe('Portfolio Service', () => {
    let mockedPortfolioRepository : Repository
    let portfolioService : Service

    beforeAll(() => {
        mockedPortfolioRepository = mock(Repository);
        portfolioService = new Service(instance(mockedPortfolioRepository))
    })

    it('should find by ID, when it exists', async () => {
        when(mockedPortfolioRepository.findById(testPortfolio1.tenantId,testPortfolio1.id))
            .thenResolve(testPortfolio1)
        let portfolio = await portfolioService.findById(testPortfolio1.tenantId,testPortfolio1.id);
        assert.isTrue(portfolio.isSuccess)
        assert.deepEqual(portfolio.getValue(),testPortfolio1)
    })
})