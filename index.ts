import http from "http";
import { generateWorld } from "./generation/generateWorld";
import { getRecord } from "./routes/get";
import { Surreal } from "surrealdb.js";

const PORT = process.env.PORT || 7001;
const routes = {
    "/api/v1/generateWorld": async (
        req: http.IncomingMessage,
        res: http.ServerResponse
    ) => {
        if (!req.headers.user) return res.end("no user");
        if (typeof req.headers.user !== "string")
            return res.end("invalid user");
        await generateWorld(req.headers.user);
        res.end("world generated");
    },
    "/api/v1/get": async (
        req: http.IncomingMessage,
        res: http.ServerResponse
    ) => {
        const db = new Surreal("http://localhost:9000/rpc");
        await db.signin({ user: "root", pass: "root" });
        if (!req.headers.user) return res.end("no user");
        if (typeof req.headers.user !== "string")
            return res.end("invalid user");
        await db.use({ ns: "test", db: req.headers.user });
        res.end(
            JSON.stringify(await getRecord(req.headers.record as string, db))
        );
    },
};

const server = http.createServer(async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "User, Record");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    const route = routes[req.url as string];
    if (route && (req.method === "POST" || req.method === "GET")) {
        return route(req, res);
    }
    res.end("404");
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
