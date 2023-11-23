import { Surreal } from "surrealdb.js";
import { char } from "../schemas/char";
import { randomString, randomPlayerName } from "../methods/randomString";
let [timer, timingMonitor] = [
    0,
    () => (timer = !timer ? Date.now() : Date.now() - timer),
];

//generate chars
export async function generateChars(db: Surreal, num: number) {
    try {
        timingMonitor();
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
                let points = Math.floor(Math.random() * statPoints) + 1;
                return points;
            };

            let maxHealth = getPoints() * 2;
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
                },
                alignment: Math.floor(Math.random() * 10) + 1,
                species: randomString(10),
            };
            await db.create<char>(`chars:${charName}`, newChar);
        }
        return `Generated ${num} chars in ${timingMonitor()}ms`;
    } catch (error) {
        return error.message;
    }
}
