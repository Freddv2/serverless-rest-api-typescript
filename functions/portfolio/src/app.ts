import express, {Express, json, urlencoded} from "express";
import cors from 'cors';
import {eventContext} from "aws-serverless-express/middleware";

const app = initExpress();

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