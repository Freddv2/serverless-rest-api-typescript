import {PortfolioRepository} from "./repository";
import {Result} from "@dv2/commons/src/result";
import {AlreadyExistsError, NotFoundError} from "@dv2/commons/src/Errors";
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
            return Result.fail<NotFoundError>(id)
        }
    }

    async create(portfolio : Portfolio) : Promise<Result<String> | Result<AlreadyExistsError>> {
        const ksuid = await KSUID.random()
        portfolio.id = ksuid.string
        await this.repo.put(portfolio)

        return Result.ok(portfolio.id)
    }
}