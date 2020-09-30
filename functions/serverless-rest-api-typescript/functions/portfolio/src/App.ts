import express, {Express, json, urlencoded} from "express";
import cors from 'cors';
import {eventContext} from "aws-serverless-express/middleware";
import {PortfolioRepository} from "./repository/PortfolioRepository";
import {PortfolioService} from "./service/PortfolioService";
import {PortfolioController} from "./controller/PortfolioController";
import {EnvironmentCredentials} from "aws-sdk";
import DynamoDB, {DocumentClient} from "aws-sdk/clients/dynamodb";

const dynamodb = initDynamoDB()
const App = initExpress();

const repo = new PortfolioRepository(dynamodb)
const service = new PortfolioService(repo)
const controller = new PortfolioController(App, service)

controller.defineRoutes()

function initExpress() : Express {
    const app = express()
    const corsOptions: cors.CorsOptions = {
        allowedHeaders: [
            'Content-Type',
            'X-Amz-Date',
            'Authorization',
            'X-Api-Key',
            'X-Amz-Security-Token',
        ],
        credentials: true,
        preflightContinue: true,
        optionsSuccessStatus: 200
    }
    app.use(cors(corsOptions))
    app.use(json())
    app.use(urlencoded({ extended: true }))
    app.use(eventContext())

    return app;
}

function initDynamoDB() : DocumentClient {
    return new DynamoDB.DocumentClient({
        endpointDiscoveryEnabled: false,
        credentials: new EnvironmentCredentials('AWS'),
        endpoint: 'http://dynamodb.ca-central-1.amazonaws.com',
    })
}

export {App}