function boltTravel(source_tile, direction, effect, damage) {
    let new_tile = source_tile;
    while (true) {
        let test_tile = new_tile.getNeighbor(direction[0], direction[1]);
        if (test_tile.monster) {
            test_tile.monster.hit(damage);
            test_tile.setEffect(effect);
            new_tile = test_tile;
        } else if (test_tile.passable) {
            test_tile.setEffect(effect);
            new_tile = test_tile;
        } else {
            break;
        }
    }
}

function castBolt(source_tile, direction, damage) {
    boltTravel(source_tile, direction, SPRITE_BOLT_H + Math.abs(direction[1]), damage);
}

spells = {
    WOOP: function() {
        player.move(getRandomPassableTile());
    },
    SWAP: function() {
        if (monsters.length > 0) {
            let target_monster = shuffle(monsters)[0];
            let new_tile = target_monster.tile;
            let player_tile = player.tile;
            let monster_class = target_monster.constructor;

            target_monster.die();
            player.move(new_tile);
            let new_monster = putMonster(monster_class, player_tile);
            new_monster.teleport_counter = 0;
        }
    },
    TREANTS: function() {
        for (let i = 0; i < num_tiles; i++) {
            for (let j = 0; j < num_tiles; j++) {
                let tile = getTile(i, j);
                if (tile.monster && !tile.monster.is_player) {
                    let num_walls = 4 - tile.getPassableNeighbors().length;
                    tile.monster.hit(num_walls * 2);
                }
            }
        }
        shake_amout = 20;
    },
    MAELSTROM: function() {
        for (let i = 0; i < monsters.length; i++) {
            monsters[i].move(getRandomPassableTile());
            monsters[i].teleport_counter = 2;
        }
    },
    MULLIGAN: function() {
        startLevel(1, player.spells);
    },
    AURA: function() {
        player.tile.getPassableNeighbors().forEach(function(t) {
            t.setEffect(SPRITE_AURA);
            if (t.monster) {
                t.monster.heal(1);
            }
        });
        player.tile.setEffect(SPRITE_AURA);
        player.heal(1);
    },
    DASH: function() {
        let new_tile = player.tile;
        while (true) {
            let test_tile = new_tile.getNeighbor(player.last_move[0], player.last_move[1]);
            if (test_tile.passable && !test_tile.monster) {
                new_tile = test_tile;
            } else {
                break;
            }
        }

        if (player.tile != new_tile) {
            player.move(new_tile);
            new_tile.getPassableNeighbors().forEach(t => {
                t.setEffect(SPRITE_FIREBALL);
                if (t.monster) {
                    t.monster.stunned = true;
                    t.monster.hit(1);
                }
            });
        }
    },
    DIG: function() {
        for (let i = 1; i < num_tiles - 1; i++) {
            for (let j = 1; j < num_tiles - 1; j++) {
                let tile = getTile(i, j);
                if (!tile.passable) {
                    tile.replace(Floor);
                }
            }
        }
        player.tile.setEffect(SPRITE_AURA);
        player.heal(2);
    },
    KINGMAKER: function() {
        for (let i = 0; i < monsters.length; i++) {
            monsters[i].heal(1);
            monsters[i].tile.treasure = true;
        }
    },
    TRANSMOGRIFY: function() {
        for (let i = 0; i < monsters.length; i++) {
            monsters[i] = monsters[i].replace(Dodo);
            monsters[i].teleport_counter = 0;
        }
    },
    HADOUKEN: function() {
        player.bonus_attack = 5;
    },
    BUBBLE: function() {
        for (let i = player.spells.length-1; i > 0; i--) {
            if (!player.spells[i]) {
                player.spells[i] = player.spells[i-1];
            }
        }
    },
    FURODAH: function() {
        player.shield = 5;
        for (let i = 0; i < monsters.length; i++) {
            monsters[i].stunned = true;
        }
    },
    BOLT: function() {
        castBolt(player.tile, player.last_move, 4);
    },
    CROSS: function() {
        let directions = [
            [0, 1],
            [0, -1],
            [1, 0],
            [-1, 0]
        ];
        for (let i = 0; i < directions.length; i++) {
            castBolt(player.tile, directions[i], 2);
        }
    },
    MARKTHESPOT: function() {
        let directions = [
            [1, 1],
            [1, -1],
            [-1, 1],
            [-1, -1]
        ];
        for (let i = 0; i < directions.length; i++) {
            boltTravel(player.tile, directions[i], SPRITE_FIREBALL, 3);
        }
    },
    TRANQUILITY: function() {
        for (let i = 0; i < monsters.length; i++) {
            monsters[i].fear_counter = 5;
        }
    }
};
