class Tile {
    constructor(x, y, sprite, passable) {
        this.x = x;
        this.y = y;
        this.sprite = sprite;
        this.passable = passable;
    }

    draw() {
        drawSprite(this.sprite, this.x, this.y);
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
}

class Wall extends Tile {
    constructor(x, y) {
        super(x, y, SPRITE_WALL, false);
    }
}
