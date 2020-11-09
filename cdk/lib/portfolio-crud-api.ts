import {LambdaRestApi} from "@aws-cdk/aws-apigateway";
import {AttributeType, Table} from '@aws-cdk/aws-dynamodb';
import {Construct} from "@aws-cdk/core";
import {WebpackFunction} from "aws-cdk-webpack-lambda-function";


export class PortfolioCRUDRestAPI extends Construct {
    constructor(scope: Construct, id: string) {
        super(scope, id);

        const func = new WebpackFunction(this,id,{
            entry: '../functions/portfolio/src/lambda.ts',
            config: 'webpack.config.js'
        })
        new LambdaRestApi(this, id + '-API', {
            handler: func
        });
        new Table(this, 'Table', {
            tableName: 'PORTFOLIO',
            partitionKey: {name: 'tenantId', type: AttributeType.STRING},
            sortKey: {name: 'id', type: AttributeType.STRING},
            readCapacity: 1,
            writeCapacity: 1
        });
    }
}