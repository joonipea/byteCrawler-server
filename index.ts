import http from "http";
import { generateWorld } from "./generation/generateWorld";
import { getRecord } from "./routes/get";
import { Surreal } from "surrealdb.js";
import dotenv from "dotenv";
import { generateMaps } from "./generation/generateMaps";
import { generateTown } from "./generation/generateTown";
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
        const db = new Surreal();
        if (!db_url) return res.end("no db url");
        await db.connect(db_url, {
            auth: {
                username: surreal_user,
                password: surreal_pass,
            },
            namespace: "test",
            database: req.headers.user,
        });
        await generateWorld(req.headers.user, db);
        res.end("world generated");
    },
    "/api/v1/get": async (
        req: http.IncomingMessage,
        res: http.ServerResponse
    ) => {
        const db = new Surreal();
        if (!db_url) return res.end("no db url");
        if (!req.headers.user) return res.end("no user");
        if (typeof req.headers.user !== "string")
            return res.end("invalid user");
        await db.connect(db_url, {
            auth: {
                username: surreal_user,
                password: surreal_pass,
            },
            namespace: "test",
            database: req.headers.user,
        });
        const requested_record = req.headers.record as string;
        if (requested_record.includes(":")) {
            const [tb, id] = requested_record.split(":");
            res.end(JSON.stringify(await getRecord(tb, id, db)));
        }
        console.log(requested_record);
        res.end(JSON.stringify(await db.select(requested_record)));
    },
    "/api/v1/generateMap": async (
        req: http.IncomingMessage,
        res: http.ServerResponse
    ) => {
        const db = new Surreal();
        if (!db_url) return res.end("no db url");
        if (!req.headers.user) return res.end("no user");
        if (typeof req.headers.user !== "string")
            return res.end("invalid user");
        await db.connect(db_url, {
            auth: {
                username: surreal_user,
                password: surreal_pass,
            },
            namespace: "test",
            database: req.headers.user,
        });
        await generateMaps(db, Number(req.headers.floor));
        const response = JSON.stringify(
            await getRecord("maps", Number(req.headers.floor), db)
        );
        res.end(response);
    },
    "/api/v1/generateTown": async (
        req: http.IncomingMessage,
        res: http.ServerResponse
    ) => {
        const db = new Surreal();
        if (!db_url) return res.end("no db url");
        if (!req.headers.user) return res.end("no user");
        if (typeof req.headers.user !== "string")
            return res.end("invalid user");
        await db.connect(db_url, {
            auth: {
                username: surreal_user,
                password: surreal_pass,
            },
            namespace: "test",
            database: req.headers.user,
        });
        await generateTown(db, Number(req.headers.floor));
        res.end(
            JSON.stringify(
                await getRecord("town", Number(req.headers.floor), db)
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
