import {PortfolioRepository} from "./repository";
import {Result} from "@dv2/commons/src/Result";
import {NotFoundError} from "@dv2/commons/src/Errors";
import {Portfolio} from "./entity";

export class PortfolioService {
    readonly repo: PortfolioRepository

    constructor(portfolioRepository: PortfolioRepository) {
        this.repo = portfolioRepository;
    }

    async findById(tenantId : string, id : string) : Promise<Result<Portfolio> | Result<NotFoundError>> {
        let result = await this.repo.findById(tenantId, id)
        if (result) {
            return Result.ok<Portfolio>(result)
        } else {
            return Result.fail<NotFoundError>(id)
        }
    }
}