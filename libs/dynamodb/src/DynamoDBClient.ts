import {EnvironmentCredentials} from "aws-sdk";
import {DocumentClient} from "aws-sdk/lib/dynamodb/document_client";

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