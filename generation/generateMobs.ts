import { Surreal } from "surrealdb.js";
import { mob } from "../schemas/mob";
import { item } from "../schemas/item";
import { randomString } from "../methods/randomString";
let [timer, timingMonitor] = [
    0,
    () => (timer = !timer ? Date.now() : Date.now() - timer),
];
//generate mobs

export async function generateMobs(db: Surreal, num: number) {
    try {
        timingMonitor();
        for (let i = 0; i < num; i++) {
            let mobName = randomString(10);
            const mobRarity = Math.floor(Math.random() * 20) + 1;
            let statPoints = mobRarity * 4;
            const getPoints = () => {
                let points = Math.floor(Math.random() * statPoints) + 1;
                return points;
            };

            const getInventory = async () => {
                let itemList = await db.select<item>("items");
                let items: item[] = [];
                for (let i = 0; i < mobRarity; i++) {
                    let item =
                        itemList[Math.floor(Math.random() * itemList.length)];
                    items.push(item);
                }
                return items;
            };

            let maxHealth = getPoints();
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
                species: randomString(10),
            };
            await db.create<mob>(`mobs:${mobName}`, newMob);
        }
        return `Generated ${num} mobs in ${timingMonitor()}ms`;
    } catch (error) {
        return error.message;
    }
}
