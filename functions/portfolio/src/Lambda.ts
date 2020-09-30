import {createServer, proxy} from "aws-serverless-express";
import {APIGatewayEvent, Context} from "aws-lambda";
import {App} from "./App";

const server = createServer(App);

export const handler = async (event: APIGatewayEvent, context: Context) => proxy(server, event, context)