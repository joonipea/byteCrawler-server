import Surreal from "surrealdb.js";

export default async function select(table: string, db: string, id?: string) {
    const url =
        process.env.SURREAL_DB?.replace("/rpc", "") +
        `/key/${table}${id ? "/" + id : ""}`;
    const user = process.env.SURREAL_USER;
    const pass = process.env.SURREAL_PASS;
    const headersList = {
        Accept: "application/json",
        NS: "test",
        DB: db,
        Authorization: `Basic ${Buffer.from(`${user}:${pass}`).toString(
            "base64"
        )}`,
    };
    const response = await fetch(url, {
        method: "GET",
        headers: headersList,
    });
    const data = await response.json();
    return data[0].result;
}
