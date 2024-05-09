import { RecordId, Surreal } from "surrealdb.js";

//Copilot: make a function that takes a string and gets the record form the surreal database
//the method to get a record is db.select<recordType>("recordName")

export async function getRecord(
    table: string,
    id: string | number | bigint | Record<string, unknown> | unknown[],
    db: Surreal
) {
    let recordName = new RecordId(table, id);
    let record = await db.select(recordName);
    return record;
}
