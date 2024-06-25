import { Surreal, RecordId } from "surrealdb.js";
import { mob } from "../schemas/mob";
import { item } from "../schemas/item";
import { randomEnemyName, randomString } from "../methods/randomString";

//generate mobs

export async function generateMobs(db: Surreal, num: number) {
    try {
        const itemList = await db.select<item>("items");
        console.log(itemList);
        let mobList: string[] = [];
        for (let i = 0; i < num; i++) {
            let mobName = randomEnemyName();
            if (mobList.includes(mobName)) {
                i--;
                continue;
            }
            mobList.push(mobName);
            const mobRarity = Math.floor(Math.random() * 20) + 1;
            let statPoints = mobRarity * 4;
            const getPoints = () => {
                let points = Math.floor(Math.random() * statPoints) + 1;
                return points;
            };

            const getInventory = async () => {
                let items: item[] = [];
                let length = itemList.length;
                for (let i = 0; i < Math.ceil(mobRarity / 4); i++) {
                    let item = itemList[Math.floor(Math.random() * length)];
                    item.id = (item.id as RecordId).toString();
                    items.push(item);
                }
                console.log(items);
                return items;
            };

            let maxHealth = getPoints() * 2 * mobRarity;
            let newMob: mob = {
                name: mobName,
                description: randomString(20),
                level: mobRarity,
                stats: {
                    maxHealth: maxHealth,
                    health: maxHealth,
                    attack: getPoints(),
                    defense: getPoints(),
                    luck: getPoints(),
                },
                drops: await getInventory(),
                alignment: Math.floor(Math.random() * 7) + 1,
                species: mobName.split("_")[1],
            };
            const id = new RecordId("mobs", mobName);
            await db.create<mob>(id, newMob);
        }
        return `Generated ${num} mobs`;
    } catch (error) {
        console.error(error);
        return error.message;
    }
}
