import {createServer, proxy} from "aws-serverless-express";
import {APIGatewayEvent, Context} from "aws-lambda";
import {app} from "./app";
import {DynamoDBClient} from "@dv2/dynamodb/src/DynamoDBClient";
import {PortfolioRepository} from "./repository";
import {PortfolioService} from "./service";
import {PortfolioController} from "./controller";

//Init services
const repo = new PortfolioRepository(new DynamoDBClient().documentClient)
const service = new PortfolioService(repo)
const controller = new PortfolioController(app, service)

//Init Server & Define routes
const server = createServer(app);
controller.defineRoutes()

//Export lambda handler
export const handler = async (event: APIGatewayEvent, context: Context) => proxy(server, event, context)