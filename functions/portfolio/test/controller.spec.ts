import {PortfolioService} from "../src/service";
import {PortfolioController} from "../src/controller";
import {mock, when} from "ts-mockito";
import {app} from "../src/app";
import {testPortfolio1} from "./test-data";
import {Result} from "@dv2/commons/src/result";
import * as chai from 'chai'
import {assert} from 'chai'
import chaiHttp from "chai-http";
import {Portfolio} from "../src/entity";

chai.use(chaiHttp)

describe('Controller', () => {
    let mockedService: PortfolioService
    let controller: PortfolioController

    beforeAll(() => {
        mockedService = mock(PortfolioService)
        controller = new PortfolioController(app, mockedService)
        controller.defineRoutes()
    })

    it('should find by ID, when it exists', async () => {
        when(mockedService.findById(testPortfolio1.tenantId, testPortfolio1.id))
            .thenResolve(Result.ok(testPortfolio1));
        chai.request(app)
            .get(`/portfolio/${testPortfolio1.tenantId}/${testPortfolio1.id}`)
            .then(res => {
                assert.equal(res.status, 200)
                const portfolio = res.body as Portfolio
                assert.deepEqual(portfolio, testPortfolio1)
            })
    })
})