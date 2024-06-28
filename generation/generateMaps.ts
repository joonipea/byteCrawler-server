import { Surreal, RecordId } from "surrealdb.js";
import { randomString, randomMapName } from "../methods/randomString";

export async function generateMaps(db: Surreal, num: number) {
    try {
        // generate a dungeon map
        const id = new RecordId("maps", `floor_${num.toString()}`);
        console.log(id);
        let exists = await db.select(id);
        if (exists) return console.log("Map already exists");
        console.log(typeof num);

        let mapName = randomMapName();
        const size = Math.ceil(Math.floor(Math.random() * 8) + 6 + num / 10);
        let map: string[][] = [];
        for (let m = 0; m < size; m++) {
            let row: string[] = [];
            for (let j = 0; j < size; j++) {
                row.push("wall");
            }
            map.push(row);
        }
        const drops: string[] = await getDrops(num + 1, db);
        const enemies: string[] = await getEnemies(num / 5 + 1, db);
        map = generateRooms(map, num, drops, enemies);

        let mapData = {
            name: mapName,
            map: map,
            floor: num + 1,
        };
        await db.create(id, mapData);
        // for (let drop of mapData.drops) {
        //     await db.query(`RELATE ${drop}->located->maps:${i}`);
        // }
        // for (let enemy of mapData.enemies) {
        //     await db.query(`RELATE ${enemy}->located->maps:${i}`);
        // }

        return `Generated map ${num}`;
    } catch (error) {
        console.error(error);
        console.log(error);
        return error.message;
    }
}

async function getDrops(level: number, db: Surreal) {
    let drops: string[] = [];
    type dropItem = { id: RecordId };
    let [itemList] = await db.query<[dropItem[]]>(
        `SELECT id FROM items WHERE rarity <= ${level / 20 + 1}`
    );
    if (!itemList || itemList.length == 0) return ["floor"];
    for (let idx = 0; idx < Math.floor(Math.random() * 5) + 1; idx++) {
        let drop =
            itemList[Math.floor(Math.random() * itemList.length)].id.toString();
        if (drop) {
            drops.push(drop);
        }
    }
    return drops;
}

async function getEnemies(level: number, db: Surreal) {
    let mobs: string[] = [];
    type mob = { id: RecordId };
    let [mobList] = await db.query<[mob[]]>(
        `SELECT id FROM mobs WHERE level <= ${level} AND level >= ${level - 2}`
    );
    if (!mobList || mobList.length == 0) return ["floor"];
    for (let idx = 0; idx < Math.floor(Math.random() * 5) + 1; idx++) {
        let mob =
            mobList[Math.floor(Math.random() * mobList.length)].id.toString();
        if (mob) {
            mobs.push(mob);
        }
    }
    return mobs;
}

function generateRooms(
    map: string[][],
    level: number,
    drops: string[],
    enemies: string[]
) {
    let visitedCells = 0;
    let totalCells = map.length * map[0].length;
    let visitedPercentage = Math.floor(Math.random() * 50) + 15;
    let currentX = Math.floor(Math.random() * map.length);
    let currentY = Math.floor(Math.random() * map[0].length);
    let direction = Math.floor(Math.random() * 4);
    let newMap = map;
    let entities: string[] = [];
    let entitiesNum = 0;
    let wellSpringChance = Math.random();
    let savePointChance = Math.random();
    for (let k = 0; k < level / 10 + 1; k++) {
        entities.push(drops[Math.floor(Math.random() * drops.length)]);
        entitiesNum++;
    }

    for (let j = 0; j < map.length / 2; j++) {
        entities.push(enemies[Math.floor(Math.random() * enemies.length)]);
        entitiesNum++;
    }
    if (wellSpringChance > 0.9) {
        entities.push("well");
        entitiesNum++;
    }

    if (savePointChance > 0.9) {
        entities.push("save");
        entitiesNum++;
    }
    entities.push("exit");
    entitiesNum++;

    let size = Math.floor(totalCells * (visitedPercentage / 100)) + entitiesNum;
    for (let l = 0; l < size - entitiesNum; l++) {
        entities.push("floor");
    }

    while (visitedCells <= size) {
        if (newMap[currentX][currentY] === "wall") {
            let entity: string;
            //if it's the last visited cell, make it the exit
            if (visitedCells === 0) {
                entity = "spawn";
            } else {
                entity = entities[Math.floor(Math.random() * entities.length)];
                entities.splice(entities.indexOf(entity), 1);
            }
            newMap[currentX][currentY] = entity;
            visitedCells++;
        }
        switch (direction) {
            case 0:
                if (currentX < map.length - 1) {
                    currentX++;
                }
                break;
            case 1:
                if (currentX > 0) {
                    currentX--;
                }
                break;
            case 2:
                if (currentY < map[0].length - 1) {
                    currentY++;
                }
                break;
            case 3:
                if (currentY > 0) {
                    currentY--;
                }
                break;
        }

        if (Math.floor(Math.random() * 10) > 5) {
            direction = Math.floor(Math.random() * 4);
        }
    }
    return newMap;
}
