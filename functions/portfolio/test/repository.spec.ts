import {testPortfolio1, testPortfolio2} from "./test-data";
import {PortfolioRepository} from "../src/repository";
import {LocalDynamoDB} from "@dv2/test-dynamodb/src/local-dynamodb";

describe('Portfolio Repository', () => {
    let localDynamoDB: LocalDynamoDB
    let portfolioRepository: PortfolioRepository

    beforeAll(async () => {
        localDynamoDB = await new LocalDynamoDB().start()
        portfolioRepository = new PortfolioRepository(localDynamoDB.documentClient);
    })

    beforeEach(async () => {
        await localDynamoDB.createTableIfNotExists();
    })

    it('should return undefined, when no portfolio exists', async () => {
        const portfolio = await portfolioRepository.findById(testPortfolio1.tenantId, '999')
        expect(portfolio).toBeUndefined()
    })

    it('should return portfolio by id, when it exists', async () => {
        await portfolioRepository.put(testPortfolio1)
        const portfolio = await portfolioRepository.findById(testPortfolio1.tenantId, testPortfolio1.id)
        expect(portfolio).toBeDefined()
        expect(portfolio).toEqual(expect.objectContaining(testPortfolio1))
    })

    it("should create portfolio",async () => {
        await portfolioRepository.put(testPortfolio1);
    })

    it("should find by name", async () => {
        await portfolioRepository.put(testPortfolio1)
        const portfolio = await portfolioRepository.findByName(testPortfolio1.tenantId, testPortfolio1.name)
        expect(portfolio).toBeDefined()
        expect(portfolio).toEqual(expect.objectContaining(testPortfolio1))
    })

    it("should find all by tenant", async () => {
        await portfolioRepository.put(testPortfolio1)
        await portfolioRepository.put(testPortfolio2)
        const portfolios = await portfolioRepository.findAllByTenant(testPortfolio1.tenantId);
        expect(portfolios).toHaveLength(2)
        expect(portfolios).toEqual(expect.arrayContaining([
            expect.objectContaining(testPortfolio1),
            expect.objectContaining(testPortfolio2)
        ]))
    })

    it("should find like name", async () => {
        await portfolioRepository.put(testPortfolio1)
        await portfolioRepository.put(testPortfolio2)
        const portfolios = await portfolioRepository.findLikeName(testPortfolio1.tenantId, testPortfolio1.name);
        expect(portfolios).toHaveLength(1)
        expect(portfolios).toEqual(expect.arrayContaining([
            expect.objectContaining(testPortfolio1),
        ]))
    })

    it("should delete", async () => {
        await portfolioRepository.put(testPortfolio1)
        await portfolioRepository.put(testPortfolio2)
        await portfolioRepository.delete(testPortfolio1.tenantId, testPortfolio1.id)
        const portfolios = await portfolioRepository.findAllByTenant(testPortfolio2.tenantId);
        expect(portfolios).toHaveLength(1)
        expect(portfolios).toEqual(expect.arrayContaining([
            expect.objectContaining(testPortfolio2),
        ]))
    })

    afterEach(async () => {
        await localDynamoDB.deleteTableIfExists()
    })

    afterAll(() => {
        localDynamoDB.stop()
    })
})
