import express, {Express, json, urlencoded} from "express";
import cors from 'cors';
import {eventContext} from "aws-serverless-express/middleware";
import {PortfolioRepository} from "./repository/PortfolioRepository";
import {PortfolioService} from "./service/PortfolioService";
import {PortfolioController} from "./controller/PortfolioController";
import {DynamoDBClient} from "@dv2/dynamodb/src/DynamoDBClient";

const documentClient = new DynamoDBClient().documentClient
const app = initExpress();

const repo = new PortfolioRepository(documentClient)
const service = new PortfolioService(repo)
const controller = new PortfolioController(app, service)

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

export {app}