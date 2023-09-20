import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';

export class KataAppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const myLambda = new lambda.Function(this, 'lambdaFunction', {
      functionName: 'first-cdk-lambda',
      code: new lambda.AssetCode('src'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_16_X,
      memorySize: 128,
    });

    // Create an API Gateway to expose the Lambda function
    const api = new apigateway.LambdaRestApi(this, 'Endpoint', {
      handler: myLambda,
    });

    // Output the API endpoint URL
    new cdk.CfnOutput(this, 'APIURL', {
      value: api.url,
    });
  }
}
