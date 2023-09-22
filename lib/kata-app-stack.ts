import * as cdk from 'aws-cdk-lib';
import { Stack, StackProps, aws_dynamodb as dynamodb } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';

export class KataAppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const locationTable = new dynamodb.Table(this, 'LocationTable', {
      partitionKey: {
        name: 'truckId',
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: 'timestamp',
        type: dynamodb.AttributeType.NUMBER,
      },
      tableName: 'LocationTable',
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    });

    locationTable.addGlobalSecondaryIndex({
      indexName: 'Timestamp-Index',
      partitionKey: {
        name: 'gpsData',
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: 'timestamp',
        type: dynamodb.AttributeType.NUMBER,
      },
    });

    const myLambda = new lambda.Function(this, 'lambdaFunction', {
      functionName: 'first-cdk-lambda',
      code: new lambda.AssetCode('src'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_16_X,
      memorySize: 128,
    });

    const api = new apigateway.LambdaRestApi(this, 'Endpoint', {
      handler: myLambda,
    });

    locationTable.grantReadWriteData(myLambda);
    myLambda.addEnvironment('locationTable', locationTable.tableName);

    new cdk.CfnOutput(this, 'APIURL', {
      value: api.url,
    });
  }
}
