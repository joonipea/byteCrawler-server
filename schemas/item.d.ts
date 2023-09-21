import { skill } from "./skills";

export type item = {
    name: string;
    description: string;
    // type: "weapon" | "armor" | "consumable" | "misc";
    // weaponType?:
    //     | "sword"
    //     | "axe"
    //     | "bow"
    //     | "staff"
    //     | "wand"
    //     | "dagger"
    //     | "shield";
    // stats?: {
    //     attack?: number;
    //     defense?: number;
    //     health?: number;
    //     mana?: number;
    //     strength?: number;
    //     dexterity?: number;
    //     intelligence?: number;
    //     luck?: number;
    // };
    profeciencyStat?: skill["profeciencyStat"];
    skills?: skill;
    rarity: number;
    // weight: number;
    price: number;
    levelRequirement?: number;
};
