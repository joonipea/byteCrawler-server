import { RecordId, Surreal } from "surrealdb.js";

export async function getRecord(table: string, id: any, db: Surreal) {
    if (table == "maps") id = `floor_${id.toString()}`;
    let recordName = new RecordId(table, id.toString());
    console.log(recordName);
    let record = await db.select(recordName);
    console.log(record);
    return record;
}
