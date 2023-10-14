export function randomString(length: number) {
    var result = "";
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz ";
    var charactersLength = characters.length;
    for (var i = 0; i < length; ++i) {
        result += characters.charAt(
            Math.floor(Math.random() * charactersLength)
        );
    }
    return result;
}

export function randomEnemyName() {
    const adjectives = [
        "red",
        "blue",
        "green",
        "yellow",
        "deadly",
        "sad",
        "happy",
    ];
    const nouns = [
        "skeleton knight",
        "skeleton",
        "kobold knight",
        "kobold",
        "ghost",
        "atrocity",
        "guy",
        "snake",
        "spider",
        "eye",
        "mage",
        "fish",
        "golem",
    ];
    const enemyName = `${
        adjectives[Math.floor(Math.random() * adjectives.length)]
    } ${nouns[Math.floor(Math.random() * nouns.length)]}`;
    return enemyName.replace(/ /g, "_");
}

export function randomPlayerName() {
    const firstNames = [
        "Gideon",
        "Liliana",
        "Chandra",
        "Jace",
        "Nissa",
        "Ajani",
        "Sorin",
        "Karn",
        "Teferi",
        "Ugin",
        "Nahiri",
        "Kaya",
        "Ral",
        "Vraska",
        "Domri",
        "Tamiyo",
        "Ashiok",
        "Angrath",
        "Dovin",
        "Kiora",
        "Elspeth",
        "Vivien",
        "Samut",
        "Narset",
        "Teyo",
        "Dack",
        "Daretti",
        "Darian",
        "Davriel",
    ];

    const lastNames = [
        "Jura",
        "Vess",
        "Nalaar",
        "Beleren",
        "Revane",
        "Goldmane",
        "Markov",
        "Silvermane",
        "Lahiri",
        "The Wanderer",
        "The Ineffable",
        "The Masked",
        "The Flame",
        "The Blind",
        "The Illusive",
        "The Shadow",
        "The Flame",
        "The Blind",
        "The Illusive",
        "The Horned",
        "The Unseen",
        "The Unyielding",
        "The Unbowed",
        "The Unbroken",
        "The Unchained",
    ];

    const playerName = `${
        firstNames[Math.floor(Math.random() * firstNames.length)]
    } ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
    return playerName.replace(/ /g, "_");
}

export function randomMapName() {
    const adjectives = [
        "red",
        "blue",
        "green",
        "yellow",
        "deadly",
        "sad",
        "happy",
    ];
    const nouns = [
        "cave",
        "dungeon",
        "lair",
        "castle",
        "fortress",
        "tomb",
        "crypt",
        "temple",
        "tower",
        "labyrinth",
        "maze",
    ];
    const mapName = `${
        adjectives[Math.floor(Math.random() * adjectives.length)]
    } ${nouns[Math.floor(Math.random() * nouns.length)]}`;
    return mapName.replace(/ /g, "_");
}
