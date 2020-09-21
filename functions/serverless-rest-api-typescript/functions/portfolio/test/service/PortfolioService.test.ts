import {PortfolioService} from "../../src/service/PortfolioService";
import {PortfolioRepository} from "../../src/repository/PortfolioRepository";
import {mock, when} from "ts-mockito";
import {Portfolio} from "../../src/domain/Portfolio";

const mockedPortfolioRepository = mock(PortfolioRepository);
const portfolioService = new PortfolioService(mockedPortfolioRepository)

describe('Portfolio Service', () => {
    const
    it('Should find by ID, when it exists', () => {
        const testPortfolio = new Portfolio()
        when(mockedPortfolioRepository.findById("1","1"))
            .thenResolve()
    })
})