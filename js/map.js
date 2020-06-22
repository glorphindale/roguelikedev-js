function generateTiles() {
    let open_tiles = 0;
    tiles = [];
    for (let i = 0; i < num_tiles; i++) {
        tiles[i] = [];
        for (let j = 0; j < num_tiles; j++) {
            if (Math.random() < 0.3 || !isInBounds(i, j)) {
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
