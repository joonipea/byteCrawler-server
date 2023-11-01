# ByteCrawler Server <!-- omit in toc -->

A server for the [ByteCrawler project](https://github.com/joonipea/byteCrawler). The server is built with Node.js and SurrealDB.

-   [Installation](#installation)
-   [Usage](#usage)
-   [API Routes](#api-routes)
    -   [/api/v1/generateWorld](#apiv1generateworld)
        -   [Usage](#usage-1)
    -   [/api/v1/get](#apiv1get)
        -   [Usage](#usage-2)
    -   [/api/v1/generateMap](#apiv1generatemap)
-   [Object Types](#object-types)
    -   [Chars](#chars)
    -   [Items](#items)
    -   [Mobs](#mobs)
    -   [Maps](#maps)
    -   [Stats](#stats)

## Installation

1. Clone the repository: `git clone https://github.com/joonipea/byteCrawler.git`
2. Install the dependencies: `npm install`
3. [Install SurrealDB](https://surrealdb.com/docs/installation)

## Usage

1. Start SurrealDB: `npm run surreal`
2. Start the server: `npm run start`
3. Access the server at `http://localhost:7001`

## API Routes

### /api/v1/generateWorld

Generates a new world with 50 items, 50 mobs, 50 chars, and 1 map and returns a message about the success of the operation.

#### Usage

```typeScript
const name: string = "worldName";

const url: string = "http://localhost:7001/api/v1/generateWorld";

const headers = {
    user: name
};

const response = await fetch(url, {
    method: "GET",
    headers: headers
});
console.log(await response.json());
```

Response:

```json
"world generated"
```

### /api/v1/get

Returns information on any requested record(s) within a world.

#### Usage

Example of getting all Records

```typeScript
function getRecord(name, record) {
    const url: string = "http://localhost:/api/v1/get";
    const headers = {
        user: name,
        record: record
    };
    return fetch(url, {
        method: "GET",
        headers: headers,
    });
}
let record = "chars";
let name = "worldName";
getRecord(name, record).then((response) => {
    console.log(response.json()); //return the first record
});
```

Response:

```json
[
    {
        "alignment": 7,
        "description": "c HidaLAwTcNmiZwCQrI",
        "id": "chars:Ajani_Nalaar",
        "level": 1,
        "mood": 3,
        "name": "Ajani_Nalaar",
        "rarity": 3,
        "species": "iJWYcWVXyd",
        "stats": {
            "attack": 2,
            "defense": 3,
            "health": 11,
            "luck": 9,
            "maxHealth": 11
        }
    },
    {
        "alignment": 4,
        "description": "QhChxTb YgzltkGYZmGO",
        "id": "chars:Ajani_Revane",
        "level": 1,
        "mood": 8,
        "name": "Ajani_Revane",
        "rarity": 2,
        "species": "OzmsIRBZbS",
        "stats": {
            "attack": 8,
            "defense": 6,
            "health": 1,
            "luck": 4,
            "maxHealth": 1
        }
    },
    {
        "alignment": 9,
        "description": "dZPXlKaeIKSXCxbdPUYx",
        "id": "chars:Ajani_The_Unbowed",
        "level": 1,
        "mood": 9,
        "name": "Ajani_The_Unbowed",
        "rarity": 2,
        "species": " kPHfkCQPz",
        "stats": {
            "attack": 3,
            "defense": 6,
            "health": 7,
            "luck": 5,
            "maxHealth": 7
        }
    }
]
```

Example of getting a single record

```typeScript
function getRecord(name, record) {
    const url: string = "http://localhost:/api/v1/get";
    const headers = {
        user: name,
        record: record
    };
    return fetch(url, {
        method: "GET",
        headers: headers,
    });
}
let record = "chars:Ajani_Nalaar";
let name = "worldName";
getRecord(name, record).then((response) => {
    console.log(response.json());
});
```

Response (shortened for readability):

```json
[
    {
        "alignment": 7,
        "description": "c HidaLAwTcNmiZwCQrI",
        "id": "chars:Ajani_Nalaar",
        "level": 1,
        "mood": 3,
        "name": "Ajani_Nalaar",
        "rarity": 3,
        "species": "iJWYcWVXyd",
        "stats": {
            "attack": 2,
            "defense": 3,
            "health": 11,
            "luck": 9,
            "maxHealth": 11
        }
    }
]
```

### /api/v1/generateMap

Generates a new map and returns the map.

```typeScript
async function generateMap(name, floor) {
    const url: string = "http://localhost:7001/api/v1/generateMap";
    const headers = {
        user: name,
        floor: floor
    };
    return fetch(url, {
        method: "GET",
        headers: headers,
    });
}
let name = "worldName";
let floor = 2;
generateMap(name, floor).then((response) => {
    console.log(response.json());
});
```

Response (shortened for readability):

```json
[
    {
        "floor": 2,
        "id": "maps:1",
        "map": [
            [
                "wall",
                "wall",
                "wall",
                "wall",
                "wall",
                "wall",
                "wall",
                "wall",
                "wall",
                "wall",
                "wall",
                "wall",
                "wall",
                "wall"
            ],
            [
                "wall",
                "wall",
                "wall",
                "wall",
                "wall",
                "wall",
                "wall",
                "wall",
                "wall",
                "wall",
                "wall",
                "wall",
                "wall",
                "wall"
            ]
        ],
        "name": "green_tomb"
    }
]
```

## Object Types

### Chars

Randomly generated player characters.

```typeScript
type char = {
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
```

### Items

Randomly generated items.

```typeScript
type item = {
    name: string;
    description: string;
    profeciencyStat?: skill["profeciencyStat"];
    skills?: skill;
    rarity: number;
    price: number;
    levelRequirement?: number;
};
```

### Mobs

Randomly generated mobs.

```typeScript
type mob = {
    name: string;
    description: string;
    level: number;
    drops: item[];
    stats: stats;
    alignment: number;
    taxonomy?: taxonomy;
    species: taxonomy["species"];
};
```

### Maps

Randomly generated maps.

```typeScript
type map = {
    name: string;
    floor: number;
    map: string[][];
};
```

### Stats

```typeScript
type stats = {
    maxHealth: number;
    health: number;
    attack: number;
    defense: number;
    luck: number;
};
```
