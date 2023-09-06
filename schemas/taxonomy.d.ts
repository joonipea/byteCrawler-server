export type taxonomy = {
    domain: "eukarya" | "bacteria" | "archaea";
    kingdom:
        | "animalia"
        | "plantae"
        | "fungi"
        | "protista"
        | "eubacteria"
        | "archaebacteria"
        | "protozoa"
        | "chromista";
    phylum: string;
    class: string;
    order: string;
    family: string;
    genus: string;
    species: string;
};
