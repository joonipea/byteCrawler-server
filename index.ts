import http from "http";
import { generateWorld } from "./generation/generateWorld";
import { getRecord } from "./routes/get";
import { Surreal } from "surrealdb.js";
import dotenv from "dotenv";
import { generateMaps } from "./generation/generateMaps";
dotenv.config();

const PORT = process.env.PORT || 7001;
const db_url = process.env.SURREAL_DB;
const WHITELIST = process.env.WHITELIST;
const surreal_pass = process.env.SURREAL_PASS || "root";
const surreal_user = process.env.SURREAL_USER || "root";

const routes = {
    "/api/v1/generateWorld": async (
        req: http.IncomingMessage,
        res: http.ServerResponse
    ) => {
        if (!req.headers.user) return res.end("no user");
        if (typeof req.headers.user !== "string")
            return res.end("invalid user");
        const db = new Surreal(db_url);
        await db.signin({ user: surreal_user, pass: surreal_pass });
        await generateWorld(req.headers.user, db);
        res.end("world generated");
    },
    "/api/v1/get": async (
        req: http.IncomingMessage,
        res: http.ServerResponse
    ) => {
        const db = new Surreal(db_url);
        await db.signin({ user: surreal_user, pass: surreal_pass });
        if (!req.headers.user) return res.end("no user");
        if (typeof req.headers.user !== "string")
            return res.end("invalid user");
        await db.use({ ns: "test", db: req.headers.user });
        res.end(
            JSON.stringify(await getRecord(req.headers.record as string, db))
        );
    },
    "/api/v1/generateMap": async (
        req: http.IncomingMessage,
        res: http.ServerResponse
    ) => {
        const db = new Surreal(db_url);
        await db.signin({ user: surreal_user, pass: surreal_pass });
        if (!req.headers.user) return res.end("no user");
        if (typeof req.headers.user !== "string")
            return res.end("invalid user");
        await db.use({ ns: "test", db: req.headers.user });
        await generateMaps(db, Number(req.headers.floor));
        res.end(
            JSON.stringify(
                await getRecord(`maps:${req.headers.floor as string}`, db)
            )
        );
    },
};

const server = http.createServer(async (req, res) => {
    if (!WHITELIST) return res.end("no whitelist");
    if (!db_url) return res.end("no db url");
    res.setHeader("Access-Control-Allow-Origin", WHITELIST);
    res.setHeader("Access-Control-Allow-Headers", "User, Record, Floor");
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
