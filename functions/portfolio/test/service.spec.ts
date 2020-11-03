import {Service} from "../src/service";
import {Repository} from "../src/repository";
import {instance, mock, when} from "ts-mockito";
import {assert} from "chai"
import {testPortfolio1} from "./test-data";

describe('Service', () => {
    let mockedRepo : Repository
    let service : Service

    beforeAll(() => {
        mockedRepo = mock(Repository);
        service = new Service(instance(mockedRepo))
    })

    it('should find by ID, when it exists', async () => {
        when(mockedRepo.findById(testPortfolio1.tenantId,testPortfolio1.id))
            .thenResolve(testPortfolio1)
        let portfolio = await service.findById(testPortfolio1.tenantId,testPortfolio1.id);
        assert.isTrue(portfolio.isSuccess)
        assert.deepEqual(portfolio.getValue(),testPortfolio1)
    })
})