class Monster {
    constructor(tile, sprite, hp) {
        this.move(tile);
        this.sprite = sprite;
        this.hp = hp;
    }

    update() {
        this.doStuff();
    }

    doStuff() {
        let neighbors = this.tile.getPassableNeighbors();

        neighbors = neighbors.filter(t => !t.monster || t.monster.isPlayer);

        if (neighbors) {
            neighbors.sort((a, b) => a.dist(player.tile) - b.dist(player.tile));
            let new_tile = neighbors[0];
            this.tryMove(new_tile.x - this.tile.x, new_tile.y - this.tile.y);
        }
    }

    drawHP() {
        for (let i = 0; i < this.hp; i++) {
            drawSprite(
                SPRITE_HEALTH,
                this.tile.x + (i%3)*5/16,
                this.tile.y + Math.floor(i/3)*(5/16)
            );
        }
    }

    draw() {
        drawSprite(this.sprite, this.tile.x, this.tile.y);
        this.drawHP();
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

    tryMove(dx, dy) {
        if (super.tryMove(dx, dy)) {
            tick();
        }
    }
}

class Dodo extends Monster {
    constructor(tile) {
        super(tile, SPRITE_DODO, 2);
    }
}

class Lizard extends Monster {
    constructor(tile) {
        super(tile, SPRITE_LIZARD, 3);
    }
}

class Ecto extends Monster {
    constructor(tile) {
        super(tile, SPRITE_ECTO, 1);
    }
}

class Snake extends Monster {
    constructor(tile) {
        super(tile, SPRITE_SNAKE, 3);
    }
}

class Jester extends Monster {
    constructor(tile) {
        super(tile, SPRITE_JESTER, 2);
    }
}
