import {PortfolioService} from "../src/service";
import {PortfolioRepository} from "../src/repository";
import {instance, mock, when} from "ts-mockito";
import {assert} from "chai"
import {testPortfolio1} from "./test-data";

describe('Service', () => {
    let mockedRepo : PortfolioRepository
    let service : PortfolioService

    beforeAll(() => {
        mockedRepo = mock(PortfolioRepository);
        service = new PortfolioService(instance(mockedRepo))
    })

    it('should find by ID, when it exists', async () => {
        when(mockedRepo.findById(testPortfolio1.tenantId,testPortfolio1.id))
            .thenResolve(testPortfolio1)
        let portfolio = await service.findById(testPortfolio1.tenantId,testPortfolio1.id);
        assert.isTrue(portfolio.isSuccess)
        assert.deepEqual(portfolio.getValue(),testPortfolio1)
    })
})