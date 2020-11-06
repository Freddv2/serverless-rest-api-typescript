import {PortfolioService} from "../src/service";
import {PortfolioController} from "../src/controller";
import {instance, mock, when} from "ts-mockito";
import {app} from "../src/app";
import {testPortfolio1} from "./test-data";
import supertest from "supertest";
import {Result} from "@dv2/commons/src/result";

describe('Controller', () => {
    let mockedService: PortfolioService
    let controller: PortfolioController
    let request = supertest(app)

    beforeAll(() => {
        mockedService = mock(PortfolioService)
        controller = new PortfolioController(app, instance(mockedService))
        controller.defineRoutes()
    })

    it('should find by ID, when it exists', async () => {
        when(mockedService.findById(testPortfolio1.tenantId, testPortfolio1.id))
            .thenResolve(Result.ok(testPortfolio1));
        const resp = await request.get(`/portfolio/${testPortfolio1.tenantId}/${testPortfolio1.id}`)
        expect(resp.status).toBe(200)
        expect(resp.body).toStrictEqual(testPortfolio1)
    })
})