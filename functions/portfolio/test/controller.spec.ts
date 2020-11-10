import {PortfolioService} from "../src/service";
import {PortfolioController} from "../src/controller";
import {deepEqual, instance, mock, when} from "ts-mockito";
import {app} from "../src/app";
import {testPortfolio1} from "./test-data";
import supertest from "supertest";
import {Result} from "@dv2/commons/src/result";
import {AlreadyExistsError, NotFoundError} from "@dv2/commons/src/errors";

describe('Controller', () => {
    let mockedService: PortfolioService
    let controller: PortfolioController
    let request = supertest(app)

    beforeAll(() => {
        mockedService = mock(PortfolioService)
        controller = new PortfolioController(app, instance(mockedService))
        controller.defineRoutes()
    })

    it('should return 200 with portfolio, when finding portfolio by ID and exists', async () => {
        when(mockedService.findById(testPortfolio1.tenantId, testPortfolio1.id))
            .thenResolve(Result.ok(testPortfolio1));
        const resp = await request.get(`/portfolio/${testPortfolio1.tenantId}/${testPortfolio1.id}`)
        expect(resp.status).toBe(200)
        expect(resp.body).toStrictEqual(testPortfolio1)
    })

    it("should return 404, when finding portfolio by ID and doesn't exists", async () => {
        when(mockedService.findById(testPortfolio1.tenantId, testPortfolio1.id))
            .thenResolve(Result.fail(new NotFoundError(testPortfolio1.id)));
        const resp = await request.get(`/portfolio/${testPortfolio1.tenantId}/${testPortfolio1.id}`)
        expect(resp.status).toBe(404)
    })

    it("should return 200 with ID, when creating portfolio and doesn't exists", async () => {
        when(mockedService.create(deepEqual(testPortfolio1)))
            .thenResolve(Result.ok(testPortfolio1.id))
        const resp = await request
            .post(`/portfolio/${testPortfolio1.tenantId}`)
            .send(testPortfolio1)

        expect(resp.status).toBe(200)
        expect(resp.body).toBe(testPortfolio1.id)
    })

    it("should return 409, when creating portfolio that already exists", async () => {
        when(mockedService.create(deepEqual(testPortfolio1)))
            .thenResolve(Result.fail(new AlreadyExistsError(testPortfolio1.name)))
        const resp = await request
            .post(`/portfolio/${testPortfolio1.tenantId}`)
            .send(testPortfolio1)

        expect(resp.status).toBe(409)
    })
})