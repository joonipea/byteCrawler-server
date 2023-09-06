export type skill = {
    name: string;
    description: string;
    type: "passive" | "active";
    maxLevel: number;
    rarity: number;
    growthSpeed: number;
    profeciencyStat:
        | "strength"
        | "dexterity"
        | "intelligence"
        | "luck"
        | "health"
        | "mana";
};
