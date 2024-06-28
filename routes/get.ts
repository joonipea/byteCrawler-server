import { RecordId, Surreal } from "surrealdb.js";

export async function getRecord(table: string, id: any, db: Surreal) {
    let recordName = new RecordId(table, id.toString());
    console.log(recordName);
    let record = await db.select(recordName);
    console.log(record);
    return record;
}
