import {Context} from "aws-lambda";
import { createServer, proxy } from 'aws-serverless-express';
import express, {json, urlencoded} from "express";
import cors from 'cors';
import {eventContext} from "aws-serverless-express/middleware";

const app = configureApp();
const server = createServer(app);
export const handler = (event: any, context: Context) =>
    proxy(server, event, context);

function configureApp() {
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