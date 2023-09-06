import { Surreal } from "surrealdb.js";

//Copilot: make a function that takes a string and gets the record form the surreal database
//the method to get a record is db.select<recordType>("recordName")

export async function getRecord(recordName: string, db: Surreal) {
    let record = await db.select(recordName);
    return record;
}
