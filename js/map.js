function generateTiles() {
    let open_tiles = 0;
    tiles = [];
    for (let i = 0; i < num_tiles; i++) {
        tiles[i] = [];
        for (let j = 0; j < num_tiles; j++) {
            if (Math.random() < wall_density || !isInBounds(i, j)) {
                tiles[i][j] = new Wall(i, j);
            } else {
                tiles[i][j] = new Floor(i, j);
                open_tiles++;
            }
        }
    }
    return open_tiles;
}

function generateLevel() {
    tryTo("generate map", function() {
        let open_tiles = generateTiles();
        let connected_tiles = getRandomPassableTile().getConnectedTiles().length
        return open_tiles == connected_tiles;
    });

    generateMonsters();

    for (let i = 0; i < 3; i++) {
        getRandomPassableTile().treasure = true;
    }
}

function isInBounds(x, y) {
    return x > 0 && y > 0 && x < num_tiles - 1 && y < num_tiles - 1;
}

function getTile(x, y) {
    if (isInBounds(x, y)) {
        return tiles[x][y];
    } else {
        return new Wall(x, y);
    }
}

function getRandomPassableTile() {
    let tile;
    tryTo("get random passable tile", function() {
        let x = randomRange(0, num_tiles - 1);
        let y = randomRange(0, num_tiles - 1);
        tile = getTile(x, y);
        return tile.passable && !tile.monster;
    });
    return tile;
}

function spawnMonster(current_level) {
    let monster_types = [Dodo, Jelly, Snake, Ecto, Mimic, Jester, Lizard];
    // Gradually increase amount of monsters
    current_level += n_loop;
    let cutoff = current_level + 1;
    if (current_level > 4) {
        cutoff = monster_types.length;
    }

    monster_types = monster_types.slice(0, cutoff);
    let monster_type = shuffle(monster_types)[0];
    let monster = new monster_type(getRandomPassableTile());
    monsters.push(monster);
}

function generateMonsters() {
    monsters = [];
    let num_monsters = level + 1;
    for (let i = 0; i < num_monsters; i++) {
        spawnMonster(level);
    }
}
