import Surreal from "surrealdb.js";

export default async function select(table: string, db: string, id?: string) {
    const url =
        process.env.DB_URL + `/$key/$namespace/${table}${id ? "/" + id : ""}`;
    const user = process.env.DB_USER;
    const pass = process.env.DB_PASS;
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
    const data = await response.text();
    return data;
}
