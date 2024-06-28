import { generateChars } from "./generateChars";
import { generateItems } from "./generateItems";
import { generateMobs } from "./generateMobs";
import { RecordId, Surreal } from "surrealdb.js";
import { generateMaps } from "./generateMaps";
import { item } from "../schemas/item";

export async function generateWorld(user: string, db: Surreal) {
    const world = new RecordId("world", user);
    let exists = await db.select(world);
    if (exists) return console.log("World already exists");
    await db.create(world, { name: user });
    console.log(await generateItems(db, 50));
    console.log(await generateChars(db, 50));
    console.log(await generateMobs(db, 50));
    console.log(await generateMaps(db, 0));
    return console.log("World generated");
}
