import {Portfolio} from "../domain/Portfolio";
import {Result} from "../../../../shared/result/Result";
import {NotFoundError} from "../../../../shared/errors/Errors";

export interface IPortfolioService {
    findById(tenantId : string, id : string) : Promise<Result<Portfolio> | Result<NotFoundError>>

}