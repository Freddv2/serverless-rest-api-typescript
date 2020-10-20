import {createServer, proxy} from "aws-serverless-express";
import {APIGatewayEvent, Context} from "aws-lambda";
import {app} from "./app";


const server = createServer(app);

export const handler = async (event: APIGatewayEvent, context: Context) => proxy(server, event, context)