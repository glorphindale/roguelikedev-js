class Monster {
    constructor(tile, sprite, hp) {
        this.move(tile);
        this.sprite = sprite;
        this.hp = hp;
        this.offset_x = 0;
        this.offset_y = 0;

        this.teleport_counter = 2;
    }

    update() {
        if (this.teleport_counter > 0) {
            this.teleport_counter--;
        }

        if (this.stunned || this.teleport_counter > 0) {
            this.stunned = false;
            return;
        }
        this.doStuff();
    }

    doStuff() {
        let neighbors = this.tile.getPassableNeighbors();

        neighbors = neighbors.filter(t => !t.monster || t.monster.is_player);

        if (neighbors && neighbors.length > 0) {
            neighbors.sort((a, b) => a.dist(player.tile) - b.dist(player.tile));
            let new_tile = neighbors[0];
            this.tryMove(new_tile.x - this.tile.x, new_tile.y - this.tile.y);
        }
    }

    drawHP() {
        for (let i = 0; i < this.hp; i++) {
            drawSprite(
                SPRITE_HEALTH,
                this.getDisplayX() + (i%3)*5/16,
                this.getDisplayY() + Math.floor(i/3)*(5/16)
            );
        }
    }

    getDisplayX() {
        return this.tile.x + this.offset_x;
    }
    getDisplayY() {
        return this.tile.y + this.offset_y;
    }

    draw() {
        if (this.teleport_counter) {
            drawSprite(SPRITE_PORTAL, this.getDisplayX(), this.getDisplayY());
        } else {
            drawSprite(this.sprite, this.getDisplayX(), this.getDisplayY());
            this.drawHP();
        }

        this.offset_x -= Math.sign(this.offset_x)*(1/8);
        this.offset_y -= Math.sign(this.offset_y)*(1/8);
    }

    tryMove(dx, dy) {
        let new_tile = this.tile.getNeighbor(dx, dy);
        if (new_tile.passable) {
            if (!new_tile.monster) {
                this.move(new_tile);
            } else {
                if (this.is_player != new_tile.monster.is_player) {
                    this.attacked_this_turn = true;
                    new_tile.monster.stunned = true;
                    new_tile.monster.hit(1);

                    shake_amount = 5;

                    this.offset_x = (new_tile.x - this.tile.x) / 2;
                    this.offset_y = (new_tile.y - this.tile.y) / 2;
                }
            }
            return true;
        } else {
            return false;
        }
    }

    hit(dmg) {
        this.hp -= dmg;
        if (this.hp <= 0) {
            this.die();
        }
    }

    heal(amount) {
        this.hp = Math.min(max_hp, this.hp + amount);
    }

    die() {
        this.dead = true;
        this.tile.monster = null;
    }

    move(tile) {
        if (this.tile) {
            this.tile.monster = null;

            this.offset_x = this.tile.x - tile.x;
            this.offset_y = this.tile.y - tile.y;
        }
        this.tile = tile;
        tile.monster = this;

        tile.stepOn(this);
    }
}

class Player extends Monster {
    constructor(tile) {
        super(tile, SPRITE_PLAYER, starting_hp);
        this.is_player = true;
        this.teleport_counter = 0;
    }

    tryMove(dx, dy) {
        if (super.tryMove(dx, dy)) {
            tick();
        }
    }

    die() {
        super.die();
        this.sprite = SPRITE_PLAYER_DEAD;
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

    doStuff() {
        this.attacked_this_turn = false;
        super.doStuff();

        if (!this.attacked_this_turn) {
            super.doStuff();
        }
    }
}

class Ecto extends Monster {
    constructor(tile) {
        super(tile, SPRITE_ECTO, 1);
    }

    doStuff() {
        let neighbors = this.tile.getNeighbors().filter(t => !t.passable && isInBounds(t.x, t.y));
        if (neighbors.length) {
            neighbors[0].replace(Floor);
            this.heal(0.5);
        } else {
            super.doStuff()
        }
    }
}

class Snake extends Monster {
    constructor(tile) {
        super(tile, SPRITE_SNAKE, 3);
    }

    update() {
        let started_stunned = this.stunned;
        super.update();
        if (!started_stunned) {
            this.stunned = true;
        }
    }
}

class Jester extends Monster {
    constructor(tile) {
        super(tile, SPRITE_JESTER, 2);
    }

    doStuff() {
        let neighbors = this.tile.getNeighborsDiagonal();
        neighbors = neighbors.filter(t => t.passable);
        if (neighbors) {
            neighbors.sort((a, b) => a.dist(player.tile) - b.dist(player.tile));
            let new_tile = neighbors[0];
            this.tryMove(new_tile.x - this.tile.x, new_tile.y - this.tile.y);
        }
    }
}
