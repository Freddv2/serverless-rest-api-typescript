import {PortfolioRepository} from "./repository";
import {Result} from "@dv2/commons/src/result";
import {AlreadyExistsError, NotFoundError} from "@dv2/commons/src/errors";
import {Portfolio} from "./entity";
import KSUID from "ksuid";

export class PortfolioService {
    readonly repo: PortfolioRepository

    constructor(portfolioRepository: PortfolioRepository) {
        this.repo = portfolioRepository;
    }

    async findById(tenantId : string, id : string) : Promise<Result<Portfolio> | Result<NotFoundError>> {
        let result = await this.repo.findById(tenantId, id)
        if (result) {
            return Result.ok(result)
        } else {
            return Result.fail(new NotFoundError(id))
        }
    }

    async create(portfolio : Portfolio) : Promise<Result<String> | Result<AlreadyExistsError>> {

        if(await this.portfolioExists(portfolio.tenantId, portfolio.name)) {
            return Result.fail<AlreadyExistsError>()
        }

        const ksuid = await KSUID.random()
        portfolio.id = ksuid.string
        await this.repo.put(portfolio)

        return Result.ok<String>(portfolio.id)
    }

    async portfolioExists(tenantId : string, name : string)
    {
        const portfolio = await this.repo.findByName(tenantId,name)
        return !!portfolio
    }
}