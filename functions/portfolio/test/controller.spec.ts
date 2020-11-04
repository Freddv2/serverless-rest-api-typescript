import {PortfolioService} from "../src/service";
import {PortfolioController} from "../src/controller";
import {mock, when} from "ts-mockito";
import {app} from "../src/app";
import {testPortfolio1} from "./test-data";
import {Result} from "@dv2/commons/src/result";
import {Server} from "http";

describe('Controller', () =>{
    let mockedService : PortfolioService
    let controller: PortfolioController
    let http: Server
    beforeAll(() => {
        mockedService = mock(PortfolioService)
        controller = new PortfolioController(app, mockedService)
        controller.defineRoutes()
        http = app.listen(0, () => console.log('Test express server started'))
    })

    it('should find by ID, when it exists', async () => {
        let result = when(mockedService.findById(testPortfolio1.tenantId, testPortfolio1.id))
            .thenResolve(Result.ok(testPortfolio1));

    })

    afterAll(() => {
        http.close()
    })
})