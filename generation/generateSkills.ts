import { Surreal } from "surrealdb.js";
import { skill } from "../schemas/skills";
import { randomString } from "../methods/randomString";

export async function generateSkills(db: Surreal, num: number) {
    try {
        const profeciencyStat: skill["profeciencyStat"][] = [
            "strength",
            "dexterity",
            "intelligence",
            "luck",
            "health",
            "mana",
        ];
        for (let i = 0; i < num; i++) {
            let skillName = randomString(10);
            let newSkill: skill = {
                name: skillName,
                description: randomString(20),
                type: Math.floor(Math.random() * 2) ? "passive" : "active",
                maxLevel: Math.floor(Math.random() * 10) + 1,
                rarity: Math.floor(Math.random() * 5) + 1,
                growthSpeed: Math.floor(Math.random() * 5) + 1,
                profeciencyStat:
                    profeciencyStat[Math.floor(Math.random() * 7) + 1],
            };
            await db.create<skill>(`skills:${skillName}`, newSkill);
        }
        return `Generated ${num} skills`;
    } catch (error) {
        return error.message;
    }
}
