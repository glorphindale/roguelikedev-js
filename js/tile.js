class Tile {
    constructor(x, y, sprite, passable) {
        this.x = x;
        this.y = y;
        this.sprite = sprite;
        this.passable = passable;
    }

    draw() {
        drawSprite(this.sprite, this.x, this.y);

        if (this.treasure) {
            drawSprite(SPRITE_GEM, this.x, this.y);
        }
    }

    replace(new_tile_type) {
        tiles[this.x][this.y] = new new_tile_type(this.x, this.y);
        return tiles[this.x][this.y];
    }

    dist(other) {
        // calculate manhattan distance
        return Math.abs(this.x - other.x) + Math.abs(this.y - other.y);
    }

    getNeighbor(dx, dy) {
        return getTile(this.x + dx, this.y + dy);
    }

    getNeighbors() {
        return shuffle([
            this.getNeighbor(-1, 0),
            this.getNeighbor(1, 0),
            this.getNeighbor(0, -1),
            this.getNeighbor(0, 1)
        ]);
    }

    getNeighborsDiagonal() {
        return shuffle([
            this.getNeighbor(-1, -1),
            this.getNeighbor(1, -1),
            this.getNeighbor(-1, 1),
            this.getNeighbor(1, 1)
        ]);
    }

    getPassableNeighbors() {
        let neighbors = this.getNeighbors();
        return neighbors.filter(t => t.passable);
    }

    getConnectedTiles() {
        let connected_tiles = [this];
        let frontier = [this];
        while (frontier.length) {
            let neighbors = frontier.pop().getPassableNeighbors().filter(t => !connected_tiles.includes(t));
            connected_tiles = connected_tiles.concat(neighbors);
            frontier = frontier.concat(neighbors);
        }
        return connected_tiles;
    }
}

class Floor extends Tile {
    constructor(x, y) {
        super(x, y, SPRITE_FLOOR, true);
    }

    stepOn(monster) {
        if (monster.is_player && this.treasure) {
            score++;
            playSound("treasure");
            this.treasure = false;
            spawnMonster();
        }
    }
}

class Wall extends Tile {
    constructor(x, y) {
        super(x, y, SPRITE_WALL, false);
    }
}

class Exit extends Tile {
    constructor(x, y) {
        super(x, y, SPRITE_EXIT, true);
    }

    stepOn(monster) {
        if (monster.is_player) {
            playSound("new_level");
            if (level == num_levels) {
                addScore(score, false);
                showTitle();
            } else {
                level++;
                startLevel(Math.min(max_hp, player.hp+1));
            }
        }
    }
}
