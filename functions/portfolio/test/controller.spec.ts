import {PortfolioService} from "../src/service";
import {PortfolioController} from "../src/controller";
import {mock, when} from "ts-mockito";
import {app} from "../src/app";
import {testPortfolio1} from "./test-data";
import {Result} from "@dv2/commons/src/result";

describe('Controller', () =>{
    let mockedService : PortfolioService
    let controller : PortfolioController

    beforeAll(() => {
        mockedService = mock(PortfolioService)
        controller = new PortfolioController(app,mockedService)
    })

    it('should find by ID, when it exists',async () => {
        let result = when(mockedService.findById(testPortfolio1.tenantId,testPortfolio1.id))
            .thenResolve(Result.ok(testPortfolio1));
    })
})