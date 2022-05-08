import { APIGatewayProxyHandlerV2 } from "aws-lambda";

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  return {
    body: "<h1>Test</h1>",
    headers: {
      "Content-Type": "text/html",
    },
    statusCode: 200,
  };
};
