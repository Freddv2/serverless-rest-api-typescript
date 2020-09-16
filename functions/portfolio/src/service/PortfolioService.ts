import {IPortfolioRepository} from "../repository/IPortfolioRepository";
import {Result} from "../../../../shared/result/Result";

import {Portfolio} from "../domain/Portfolio";
import {NotFoundError} from "../../../../shared/errors/Errors";
import {IPortfolioService} from "./IPortfolioService";

export class PortfolioService implements IPortfolioService {
    readonly portfolioRepository :  IPortfolioRepository

    constructor(portfolioRepository: IPortfolioRepository) {
        this.portfolioRepository = portfolioRepository;
    }

    async findById(tenantId : string, id : string) : Promise<Result<Portfolio> | Result<NotFoundError>> {
        let result = await this.portfolioRepository.findById(tenantId, id)
        if (result) {
            return Result.ok<Portfolio>(result)
        } else {
            return Result.fail<NotFoundError>(id)
        }
    }
}