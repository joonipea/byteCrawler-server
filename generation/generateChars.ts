import { RecordId, Surreal } from "surrealdb.js";
import { char } from "../schemas/char";
import { randomString, randomPlayerName } from "../methods/randomString";

//generate chars
export async function generateChars(db: Surreal, num: number) {
    try {
        let charList: string[] = [];
        for (let i = 0; i < num; i++) {
            let charName = randomPlayerName();
            if (charList.includes(charName)) {
                i--;
                continue;
            }
            charList.push(charName);
            const charRarity = Math.floor(Math.random() * 5) + 1;
            let statPoints = charRarity * 4;
            const getPoints = () => {
                let points =
                    Math.floor(Math.random() * statPoints) + charRarity;
                return points;
            };

            let maxHealth = getPoints() * (Math.abs(charRarity - 5) + 1);
            let maxMP = getPoints();
            let newChar: char = {
                name: charName,
                description: randomString(20),
                mood: Math.floor(Math.random() * 10) + 1,
                level: 1,
                rarity: charRarity,
                stats: {
                    maxHealth: maxHealth,
                    health: maxHealth,
                    attack: getPoints(),
                    defense: getPoints(),
                    luck: getPoints(),
                    maxMP: maxMP,
                    mp: maxMP,
                },
                alignment: Math.floor(Math.random() * 10) + 1,
                species: randomString(10),
            };
            const id = new RecordId("chars", charName);
            await db.create<char>(id, newChar);
        }
        return `Generated ${num} chars`;
    } catch (error) {
        return error.message;
    }
}
