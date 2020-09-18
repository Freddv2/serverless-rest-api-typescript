import {IPortfolioService} from "../service/PortfolioService";
import {Express, Request, Response} from "express";
import {BaseController} from "./BaseController";

interface IPortfolioController {
}

export class PortfolioController extends BaseController implements IPortfolioController{
    readonly portfolioService : IPortfolioService

    constructor(app: Express, portfolioService: IPortfolioService) {
        super(app);
        this.portfolioService = portfolioService;
    }

    public defineRoutes() {
        this.app.get('/portfolio/:tenantId/:id', this.findById);
    }

    async findById(req: Request, res: Response) : Promise<void> {
        let tenantId = req.params["tenantId"]
        let id = req.params["id"]

        let portfolio = await this.portfolioService.findById(tenantId, id);
        if(portfolio.isSuccess) {
            this.ok(res,portfolio)
        } else {
            this.notFound(res)
        }
    }
}