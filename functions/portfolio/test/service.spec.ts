import {PortfolioService} from "../src/service";
import {PortfolioRepository} from "../src/repository";
import {instance, mock, when} from "ts-mockito";
import {testPortfolio1} from "./test-data";
import {AlreadyExistsError, NotFoundError} from "@dv2/commons/src/errors";

describe('Service', () => {
    let mockedRepo : PortfolioRepository
    let service: PortfolioService

    beforeAll(() => {
        mockedRepo = mock(PortfolioRepository);
        service = new PortfolioService(instance(mockedRepo))
    })

    it('should find by ID, when it exists', async () => {
        when(mockedRepo.findById(testPortfolio1.tenantId, testPortfolio1.id))
            .thenResolve(testPortfolio1)
        const portfolio = await service.findById(testPortfolio1.tenantId, testPortfolio1.id);
        expect(portfolio.isSuccess).toBe(true)
        expect(portfolio.value).toBe(testPortfolio1)
    })

    it('should return error, when finding and doesnt exists', async () => {
        when(mockedRepo.findById(testPortfolio1.tenantId, testPortfolio1.id))
            .thenResolve(undefined)
        const portfolio = await service.findById(testPortfolio1.tenantId, testPortfolio1.id);
        expect(portfolio.isFailure).toBe(true)
        expect(portfolio.error).toBeInstanceOf(NotFoundError)
    })

    it("should create portfolio, when it doesn't exists", async () => {
        when(mockedRepo.findByName(testPortfolio1.tenantId,testPortfolio1.name))
            .thenResolve(undefined)
        when(mockedRepo.put(testPortfolio1)).thenResolve()
        const id = await service.create(testPortfolio1)
        expect(id.isSuccess)
        expect(id.value).toBeDefined()
    })

    it("should return error, when creating portfolio and it doesn't exists", async () => {
        when(mockedRepo.findByName(testPortfolio1.tenantId,testPortfolio1.name))
            .thenResolve(testPortfolio1)
        when(mockedRepo.put(testPortfolio1)).thenResolve()
        const id = await service.create(testPortfolio1)
        expect(id.isFailure)
        expect(id.error).toBeInstanceOf(AlreadyExistsError)
    })
})