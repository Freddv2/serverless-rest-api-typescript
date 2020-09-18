import {createServer, proxy} from "aws-serverless-express";
import {app} from "./app";
import {Context} from "aws-lambda";

export const server = createServer(app);

export const handler = (event: any, context: Context) => proxy(server, event, context);