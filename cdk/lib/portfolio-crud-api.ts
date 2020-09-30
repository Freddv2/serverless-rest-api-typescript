import {LambdaRestApi} from "@aws-cdk/aws-apigateway";
import {AttributeType, Table} from '@aws-cdk/aws-dynamodb';
import {Construct, Duration} from "@aws-cdk/core";
import {Code, Function, Runtime, Tracing} from "@aws-cdk/aws-lambda";
import {WebpackFunction} from "aws-cdk-webpack-lambda-function";

export interface PortfolioCRUDRestAPIProps{}

export class PortfolioCRUDRestAPI extends Construct {
    constructor(scope: Construct, id: string, props: PortfolioCRUDRestAPIProps) {
        super(scope, id);
        // const func = new Function(this, id, {
        //     runtime: Runtime.NODEJS_12_X,
        //     code: Code.fromAsset('../functions/portfolio/dist/bundle.zip'),
        //     handler: 'bundle.handler',
        //     timeout: Duration.seconds(5),
        //     memorySize: 256,
        //     environment: {'NODE_OPTIONS': '--enable-source-maps'},
        //     tracing: Tracing.ACTIVE
        // });
        const func = new WebpackFunction(this,id,{
            entry: '../functions/portfolio/src/Lambda.ts',
            config: '../functions/portfolio/webpack.config.js'
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