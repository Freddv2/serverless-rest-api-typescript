import {Portfolio} from "../domain/Portfolio";
import {IPortfolioRepository} from "../repository/PortfolioRepository";
import {Result} from "@dv2/commons/src/Result";
import {NotFoundError} from "@dv2/commons/src/Errors";

export interface IPortfolioService {
    findById(tenantId: string, id: string): Promise<Result<Portfolio> | Result<NotFoundError>>
}

export class PortfolioService implements IPortfolioService {
    readonly portfolioRepository: IPortfolioRepository

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