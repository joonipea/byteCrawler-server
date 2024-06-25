import { RecordId, Surreal } from "surrealdb.js";

export async function getRecord(
    table: string,
    id: string | number,
    db: Surreal
) {
    let recordName = new RecordId(table, id);
    let record = await db.select(recordName);
    return record;
}
