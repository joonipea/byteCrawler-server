import { generateChars } from "./generateChars";
import { generateItems } from "./generateItems";
import { generateMobs } from "./generateMobs";
import { Surreal } from "surrealdb.js";
import { generateMaps } from "./generateMaps";

export async function generateWorld(user: string, db: Surreal) {
    await db.use({ ns: "test", db: user });
    let [exists] = await db.select(`world:${user}`);
    if (exists) return console.log("World already exists");
    await db.create(`world:${user}`, { name: user });
    console.log(await generateItems(db, 100));
    console.log(await generateChars(db, 100));
    console.log(await generateMobs(db, 100));
    console.log(await generateMaps(db, 100));
    return console.log("World generated");
}
