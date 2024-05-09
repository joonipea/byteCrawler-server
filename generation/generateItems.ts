import { RecordId, Surreal } from "surrealdb.js";
import { item } from "../schemas/item";
import { randomString } from "../methods/randomString";

export async function generateItems(db: Surreal, num: number) {
    try {
        for (let i = 0; i < num; i++) {
            let itemName = randomString(10);
            // let itemType = itemTypes[Math.floor(Math.random() * 4)];
            const itemRarity = Math.floor(Math.random() * 5) + 1;
            let statPoints = itemRarity * 10;
            const getPoints = () => {
                let points = Math.floor(Math.random() * statPoints) + 1;
                return points;
            };
            let newItem: item = {
                name: itemName,
                description: randomString(20),
                rarity: itemRarity,
                price: Math.floor(Math.random() * 100) + 1,
            };
            const id = new RecordId("items", itemName);
            await db.create(id, newItem);
        }
        return `Generated ${num} items`;
    } catch (error) {
        return error.message;
    }
}
