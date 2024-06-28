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
        try {
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
            const requested_record = (req.headers.record as string).toString();
            if (requested_record.includes(":")) {
                console.log(requested_record);
                const [tb, id] = requested_record.split(":");
                res.end(JSON.stringify(await getRecord(tb, id, db)));
            }
            const response = await db.select(requested_record);
            console.log(response);
            res.end(JSON.stringify(response));
        } catch (error) {
            res.writeHead(500);
            res.end(error.message);
        } finally {
            await db.close();
        }
    },
    "/api/v1/generateMap": async (
        req: http.IncomingMessage,
        res: http.ServerResponse
    ) => {
        const db = new Surreal();
        try {
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
            if (!req.headers.floor) return res.end("no floor");
            await generateMaps(db, parseInt(req.headers.floor.toString()));
            const response = JSON.stringify(
                await getRecord(
                    "maps",
                    parseInt(req.headers.floor.toString()),
                    db
                )
            );
            res.end(response);
        } catch (error) {
            res.writeHead(500);
            res.end(error.message);
        } finally {
            await db.close();
        }
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
        if (!req.headers.floor) return res.end("no floor");
        await generateTown(db, parseInt(req.headers.floor.toString()));
        res.end(
            JSON.stringify(
                await getRecord(
                    "town",
                    parseInt(req.headers.floor.toString()),
                    db
                )
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
