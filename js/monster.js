class Monster {
    constructor(tile, sprite, hp) {
        this.move(tile);
        this.sprite = sprite;
        this.hp = hp;
    }

    draw() {
        drawSprite(this.sprite, this.tile.x, this.tile.y);
    }

    tryMove(dx, dy) {
        let new_tile = this.tile.getNeighbor(dx, dy);
        if (new_tile.passable) {
            if (!new_tile.monster) {
                this.move(new_tile);
            }
            return true;
        } else {
            return false;
        }
    }

    move(tile) {
        if (this.tile) {
            this.tile.monster = null;
        }
        this.tile = tile;
        tile.monster = this;
    }
}

class Player extends Monster {
    constructor(tile) {
        super(tile, SPRITE_PLAYER, 3);
        this.is_player = true;
    }
}
