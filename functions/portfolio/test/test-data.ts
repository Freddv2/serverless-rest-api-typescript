import {Portfolio} from "../src/domain/Portfolio";

const testTenant = "TestTenant"
const testPortfolio1: Portfolio = {
    tenantId: testTenant,
    id: "1",
    name: "RSP",
    description: "My RSP portfolio",
    assets: [
        {symbol: "QQQ",weight: 50},
        {symbol:"SPY",weight:50}]
}

const testPortfolio2: Portfolio = {
    tenantId: testTenant,
    id: "2",
    name: "TFSA",
    description: "My TFSA portfolio",
    assets: [
        {symbol: "IEF",weight: 33.33},
        {symbol:"TSLA",weight:33.33},
        {symbol:"MSFT",weight:33.33}]
}

export {testPortfolio1,testPortfolio2}