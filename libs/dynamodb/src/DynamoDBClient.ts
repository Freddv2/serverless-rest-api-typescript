import {EnvironmentCredentials} from "aws-sdk";
import {DocumentClient} from "aws-sdk/clients/dynamodb";

export class DynamoDBClient {
    readonly documentClient : DocumentClient

    constructor() {
        this.documentClient = new DocumentClient({
            endpointDiscoveryEnabled: false,
            credentials: new EnvironmentCredentials('AWS'),
            endpoint: 'http://dynamodb.ca-central-1.amazonaws.com',
        })
    }
}