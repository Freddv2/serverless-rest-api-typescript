import {PortfolioService} from "./service";
import {Express, Request, Response} from "express";
import {BaseController} from "@dv2/rest/src/controller";
import {Portfolio} from "./entity";

export class PortfolioController extends BaseController {
    readonly service : PortfolioService

    constructor(app: Express, service: PortfolioService) {
        super(app);
        this.service = service;
    }

    defineRoutes() {
        this.app.get('/portfolio/:tenantId/:id', this.findById)
        this.app.post('/portfolio/:tenantId', this.create)
    }

    //Has to use the arrow function definition so that `this` is binded to the class
    findById = async (req: Request, res: Response) => {
        const tenantId = req.params["tenantId"]
        const id = req.params["id"]

        const result = await this.service.findById(tenantId, id);
        if (result.isSuccess) {
            this.ok(res, result.value)
        } else {
            this.notFound(res, result.error)
        }
    }

    create = async (req: Request, res: Response) => {
        const portfolio = req.body as Portfolio

        const result = await this.service.create(portfolio)
        if(result.isSuccess) {
            this.ok(res, result.value)
        } else {
            this.conflict(res,result.error)
        }
    }
}
