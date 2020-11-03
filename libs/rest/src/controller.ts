import * as express from 'express'
import {Express} from "express";

export abstract class BaseController {
    readonly app : express.Express

    protected constructor(app: Express) {
        this.app = app;
    }

    public abstract defineRoutes() : void

    protected static jsonResponse (res: express.Response, code: number, message: string) {
        return res.status(code).json({ message })
    }

    protected ok<T> (res: express.Response, value?: T) {
        if (!!value) {
            res.type('application/json');
            return res.status(200).json(value);
        } else {
            return res.sendStatus(200);
        }
    }

    protected fail(res: express.Response, error: Error | string) {
        console.log(error);
        return res.status(500).json({
            message: error.toString()
        })
    }

    protected created (res: express.Response) {
        return res.sendStatus(201);
    }
    protected notFound (res: express.Response, message?: string) {
        return BaseController.jsonResponse(res, 404, message ? message : 'Not found');
    }
    protected conflict (res: express.Response, message?: string) {
        return BaseController.jsonResponse(res, 409, message ? message : 'Conflict');
    }
}