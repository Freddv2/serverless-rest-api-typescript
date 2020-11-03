import {Repository} from "./repository";
import {Result} from "@dv2/commons/src/Result";
import {NotFoundError} from "@dv2/commons/src/Errors";
import {Portfolio} from "./entity";

export class Service {
    readonly repo: Repository

    constructor(portfolioRepository: Repository) {
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