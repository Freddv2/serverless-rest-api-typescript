import {Portfolio} from "../domain/Portfolio";

export interface IPortfolioRepository {
    findById(tenantId :string, id: string) : Promise<Portfolio | undefined>
}