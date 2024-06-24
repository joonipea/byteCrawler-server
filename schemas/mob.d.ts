import { item } from "./item";
import { stats } from "./status";
import { taxonomy } from "./taxonomy";

export type mob = {
    name: string;
    description: string;
    level: number;
    // drops: item[];
    stats: stats;
    alignment: number;
    taxonomy?: taxonomy;
    species: taxonomy["species"];
};
