import {PortfolioService} from "./service";
import {Express, Request, Response} from "express";
import {BaseController} from "@dv2/rest/src/controller";

export class PortfolioController extends BaseController {
    readonly service : PortfolioService

    constructor(app: Express, service: PortfolioService) {
        super(app);
        this.service = service;
    }

    defineRoutes() {
        this.app.get('/portfolio/:tenantId/:id', this.findById);
    }

    //Has to use the arrow function definition so that `this` is binded to the class
    findById = async (req: Request, res: Response): Promise<void> => {
        let tenantId = req.params["tenantId"]
        let id = req.params["id"]

        let portfolio = await this.service.findById(tenantId, id);
        if (portfolio.isSuccess) {
            this.ok(res, portfolio.getValue())
        } else {
            this.notFound(res)
        }
    }
}