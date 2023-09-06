import { Surreal } from "surrealdb.js";
import type { nodeRequest, nodeResponse } from "./methods.d.ts";

async function use(
    req: nodeRequest,
    res: nodeResponse,
    func: Function,
    db: Surreal
) {
    let body = {};
    let headers = req.headers;
    req.on("error", (err: Error) => {
        console.log(err);
    })
        .on("data", async (data: any) => {
            body = JSON.parse(data);
        })
        .on("end", async () => {
            res.on("error", (err) => {
                console.error(err);
            });
            const msg = await func(body, headers, db);
            res.end(JSON.stringify(msg));
        });
}

export { use };
