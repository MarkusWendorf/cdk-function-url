import { Duration, Lazy, Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { HttpOrigin } from "aws-cdk-lib/aws-cloudfront-origins";
import { FunctionUrlAuthType, Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as path from "path";

export class InfraStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const func = new NodejsFunction(this, "NodeLambda", {
      runtime: Runtime.NODEJS_14_X,
      memorySize: 2048,
      entry: path.join(process.cwd(), "src", "lambda.ts"),
    });

    const endpoint = func.addFunctionUrl({
      authType: FunctionUrlAuthType.NONE,
      cors: {
        allowedOrigins: ["*"],
        allowedHeaders: ["*"],
        maxAge: Duration.hours(1),
      },
    });

    const apiDomain = Lazy.uncachedString({
      produce: (context) => {
        const resolved = context.resolve(endpoint.url);
        return { "Fn::Select": [2, { "Fn::Split": ["/", resolved] }] } as any;
      },
    });

    const distribution = new cloudfront.Distribution(this, "Cloudfront", {
      defaultBehavior: {
        origin: new HttpOrigin(apiDomain),
      },
    });
  }
}
