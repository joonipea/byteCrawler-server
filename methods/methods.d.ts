import type http from "http";

type nodeRequest = http.IncomingMessage;
type nodeResponse = http.ServerResponse<http.IncomingMessage> & {
    req: http.IncomingMessage;
};

export { nodeRequest, nodeResponse };
