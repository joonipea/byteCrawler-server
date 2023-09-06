import { item } from "./item";
import { skill } from "./skills";
import { stats } from "./status";
import { taxonomy } from "./taxonomy";

export type char = {
    name: string;
    description: string;
    level: number;
    mood: number;
    rarity: number;
    stats: stats;
    alignment: number;
    taxonomy?: taxonomy;
    species: taxonomy["species"];
};
