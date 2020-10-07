import * as cdk from '@aws-cdk/core';
import {PortfolioCRUDRestAPI} from "./portfolio-crud-api";

export class AppStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new PortfolioCRUDRestAPI(this,'Portfolio Rest API')
  }
}
