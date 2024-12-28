import { handler } from 'HANDLER';
import lambdaRequestHandler from 'lambda-request-handler';
import polka from 'polka';

const server = polka().use(handler);

export const awsHandler = lambdaRequestHandler(server.handler.bind(server));
