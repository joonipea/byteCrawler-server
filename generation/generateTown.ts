import { Surreal, RecordId } from "surrealdb.js";
import { randomString, randomMapName } from "../methods/randomString";

export async function generateTown(db: Surreal, num: number) {
    try {
        // generate a town map
        const id = new RecordId("town", `town_${num.toString()}`);
        let exists = await db.select(id);
        if (exists) return console.log("Town already exists");

        let mapName = randomMapName();
        const size = 6;
        let map: string[][] = [];
        for (let m = 0; m < size; m++) {
            let row: string[] = [];
            for (let j = 0; j < size; j++) {
                row.push("floor");
            }
            map.push(row);
        }

        const entities = [
            "merchant",
            "spawn",
            "well",
            "save",
            "monolith",
            "quest",
            "dungeon",
            "temple",
        ];

        for (let i = 0; i < entities.length; i++) {
            let x = Math.floor(Math.random() * size);
            let y = Math.floor(Math.random() * size);
            if (map[x][y] != "floor") {
                i--;
                continue;
            }
            map[x][y] = entities[i];
        }
        let mapData = {
            name: mapName,
            map: map,
        };

        await db.create(id, mapData);

        return `Generated map`;
    } catch (error) {
        return error.message;
    }
}
