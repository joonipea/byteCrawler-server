import { RecordId, Surreal } from "surrealdb.js";

export async function getRecord(table: string, id: string, db: Surreal) {
    let recordName = new RecordId(table, id);
    console.log(recordName);
    let record = await db.select(recordName);
    console.log(record);
    return record;
}
