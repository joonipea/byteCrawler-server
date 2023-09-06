import { Surreal } from "surrealdb.js";
import { item } from "../schemas/item";
import { randomString } from "../methods/randomString";
let [timer, timingMonitor] = [
    0,
    () => (timer = !timer ? Date.now() : Date.now() - timer),
];

export async function generateItems(db: Surreal, num: number) {
    try {
        timingMonitor();
        const profeciencyStat: item["profeciencyStat"][] = [
            "strength",
            "dexterity",
            "intelligence",
            "luck",
            "health",
            "mana",
        ];

        const itemTypes: item["type"][] = [
            "weapon",
            "armor",
            "consumable",
            "misc",
        ];

        const weaponType: item["weaponType"][] = [
            "sword",
            "axe",
            "bow",
            "staff",
            "wand",
            "dagger",
            "shield",
        ];

        for (let i = 0; i < num; i++) {
            let itemName = randomString(10);
            let itemType = itemTypes[Math.floor(Math.random() * 4)];
            const itemRarity = Math.floor(Math.random() * 5) + 1;
            let statPoints = itemRarity * 10;
            const getPoints = () => {
                let points = Math.floor(Math.random() * statPoints) + 1;
                return points;
            };
            let newItem: item = {
                name: itemName,
                description: randomString(20),
                type: itemType,
                weaponType:
                    itemType === "weapon"
                        ? weaponType[Math.floor(Math.random() * 7)]
                        : undefined,
                rarity: itemRarity,
                stats:
                    itemType === "weapon" || itemType === "armor"
                        ? {
                              attack: getPoints(),
                              defense: getPoints(),
                              health: getPoints(),
                              mana: getPoints(),
                              strength: getPoints(),
                              dexterity: getPoints(),
                              intelligence: getPoints(),
                              luck: getPoints(),
                          }
                        : undefined,
                profeciencyStat:
                    profeciencyStat[Math.floor(Math.random() * 7) + 1],
                weight: Math.floor(Math.random() * 100) + 1,
                price: Math.floor(Math.random() * 100) + 1,
            };
            await db.create(`items:${itemName}`, newItem);
        }
        return `Generated ${num} items in ${timingMonitor()}ms`;
    } catch (error) {
        return error.message;
    }
}
