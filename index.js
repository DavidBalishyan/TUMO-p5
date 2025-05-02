let matrix = [];
let side = 50;
let grassArr = [];
let grassEaterArr = [];
let predatorArr = [];
let virusArr = [];

function createMatrix(x, y) {
    for (let i = 0; i < y; i++) {
        const row = [];
        for (let j = 0; j < x; j++) {
            row.push(0);
        }
        matrix.push(row);
    }
}

function fillMatrix(hero, count) {
    let filled = 0;
    while (filled < count) {
        const row = Math.floor(Math.random() * matrix.length);
        const col = Math.floor(Math.random() * matrix[row].length);

        if (matrix[row][col] === 0) {
            matrix[row][col] = hero;
            filled++;
        }
    }
}

function setup() {
    createMatrix(20, 20);
    fillMatrix(1, 50);
    fillMatrix(2, 50);
    fillMatrix(3, 30);
    fillMatrix(4, 10); // Add initial viruses

    frameRate(5);
    createCanvas(matrix[0].length * side, matrix.length * side);
    background('#acacac');

    for (let y = 0; y < matrix.length; y++) {
        for (let x = 0; x < matrix[y].length; x++) {
            if (matrix[y][x] == 1) {
                grassArr.push(new Grass(x, y));
            } else if (matrix[y][x] == 2) {
                grassEaterArr.push(new GrassEater(x, y));
            } else if (matrix[y][x] == 3) {
                predatorArr.push(new Predator(x, y));
            } else if (matrix[y][x] == 4) {
                virusArr.push(new Virus(x, y));
            }
        }
    }

    window.defaultCanvas0.addEventListener("mouseenter", () => {
        document.getElementById("defaultCanvas0").className = "shadow-2xl";
    });

    window.defaultCanvas0.addEventListener("mouseleave", () => {
        document.getElementById("defaultCanvas0").className = "shadow-none";
    });
}

function draw() {
    for (let y = 0; y < matrix.length; y++) {
        for (let x = 0; x < matrix[y].length; x++) {
            if (matrix[y][x] == 0) {
                fill("#acacac");
            } else if (matrix[y][x] == 1) {
                fill("green");
            } else if (matrix[y][x] == 2) {
                fill("yellow");
            } else if (matrix[y][x] == 3) {
                fill("red");
            } else if (matrix[y][x] == 4) {
                fill("purple");
            }
            rect(x * side, y * side, side, side);
        }
    }

    for (let grass of grassArr) {
        grass.multiply();
    }

    for (let grassEater of grassEaterArr) {
        grassEater.tryEat();
    }

    for (let predator of predatorArr) {
        predator.tryEat();
    }

    for (let virus of virusArr) {
        virus.spread();
    }
}

// Grass Class
class Grass {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.energy = 5;
        this.index = 1;
        this.updateDirections();
    }

    updateDirections() {
        this.directions = [
            [this.x - 1, this.y - 1],
            [this.x, this.y - 1],
            [this.x + 1, this.y - 1],
            [this.x - 1, this.y],
            [this.x + 1, this.y],
            [this.x - 1, this.y + 1],
            [this.x, this.y + 1],
            [this.x + 1, this.y + 1]
        ];
    }

    chooseDirection(character) {
        this.updateDirections();
        let found = [];
        for (let [x, y] of this.directions) {
            if (x >= 0 && y >= 0 && x < matrix[0].length && y < matrix.length) {
                if (matrix[y][x] == character) {
                    found.push([x, y]);
                }
            }
        }
        return found;
    }

    multiply() {
        this.energy++;
        const emptySpaces = this.chooseDirection(0);
        const empty = random(emptySpaces);

        if (empty && this.energy > 20) {
            const [newX, newY] = empty;
            matrix[newY][newX] = this.index;
            grassArr.push(new Grass(newX, newY));
            this.energy = 5;
        }
    }
}

// GrassEater Class
class GrassEater {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.energy = 10;
        this.index = 2;
        this.updateDirections();
    }

    updateDirections() {
        this.directions = [
            [this.x - 1, this.y - 1],
            [this.x, this.y - 1],
            [this.x + 1, this.y - 1],
            [this.x - 1, this.y],
            [this.x + 1, this.y],
            [this.x - 1, this.y + 1],
            [this.x, this.y + 1],
            [this.x + 1, this.y + 1]
        ];
    }

    chooseDirection(character) {
        this.updateDirections();
        let found = [];
        for (let [x, y] of this.directions) {
            if (x >= 0 && y >= 0 && x < matrix[0].length && y < matrix.length) {
                if (matrix[y][x] == character) {
                    found.push([x, y]);
                }
            }
        }
        return found;
    }

    tryEat() {
        const grasses = this.chooseDirection(1);
        const grass = random(grasses);

        if (grass) {
            this.eat(grass);
        } else {
            this.move();
        }

        if (this.energy > 20) {
            this.multiply();
        } else if (this.energy <= 0) {
            this.die();
        }
    }

    eat([x, y]) {
        matrix[y][x] = this.index;
        matrix[this.y][this.x] = 0;

        grassArr = grassArr.filter(g => !(g.x == x && g.y == y));
        this.x = x;
        this.y = y;
        this.energy++;
    }

    move() {
        const emptySpaces = this.chooseDirection(0);
        const empty = random(emptySpaces);

        if (empty) {
            const [x, y] = empty;
            matrix[y][x] = this.index;
            matrix[this.y][this.x] = 0;
            this.x = x;
            this.y = y;
            this.energy--;
        }
    }

    multiply() {
        const emptySpaces = this.chooseDirection(0);
        const empty = random(emptySpaces);

        if (empty) {
            const [x, y] = empty;
            matrix[y][x] = this.index;
            grassEaterArr.push(new GrassEater(x, y));
            this.energy = 10;
        }
    }

    die() {
        matrix[this.y][this.x] = 0;
        grassEaterArr = grassEaterArr.filter(g => !(g.x == this.x && g.y == this.y));
    }
}

// Predator Class
class Predator {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.energy = 10;
        this.index = 3;
        this.updateDirections();
    }

    updateDirections() {
        this.directions = [
            [this.x - 1, this.y - 1],
            [this.x, this.y - 1],
            [this.x + 1, this.y - 1],
            [this.x - 1, this.y],
            [this.x + 1, this.y],
            [this.x - 1, this.y + 1],
            [this.x, this.y + 1],
            [this.x + 1, this.y + 1]
        ];
    }

    chooseDirection(character) {
        this.updateDirections();
        let found = [];
        for (let [x, y] of this.directions) {
            if (x >= 0 && y >= 0 && x < matrix[0].length && y < matrix.length) {
                if (matrix[y][x] == character) {
                    found.push([x, y]);
                }
            }
        }
        return found;
    }

    tryEat() {
        const prey = this.chooseDirection(2);
        const target = random(prey);

        if (target) {
            this.eat(target);
        } else {
            this.move();
        }

        if (this.energy > 20) {
            this.multiply();
        } else if (this.energy <= 0) {
            this.die();
        }
    }

    eat([x, y]) {
        matrix[y][x] = this.index;
        matrix[this.y][this.x] = 0;

        grassEaterArr = grassEaterArr.filter(g => !(g.x == x && g.y == y));
        this.x = x;
        this.y = y;
        this.energy++;
    }

    move() {
        const emptySpaces = this.chooseDirection(0);
        const empty = random(emptySpaces);

        if (empty) {
            const [x, y] = empty;
            matrix[y][x] = this.index;
            matrix[this.y][this.x] = 0;
            this.x = x;
            this.y = y;
            this.energy--;
        }
    }

    multiply() {
        const emptySpaces = this.chooseDirection(0);
        const empty = random(emptySpaces);

        if (empty) {
            const [x, y] = empty;
            matrix[y][x] = this.index;
            predatorArr.push(new Predator(x, y));
            this.energy = 10;
        }
    }

    die() {
        matrix[this.y][this.x] = 0;
        predatorArr = predatorArr.filter(p => !(p.x == this.x && p.y == this.y));
    }
}

// Virus Class
class Virus {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.energy = 8;
        this.index = 4;
        this.updateDirections();
    }

    updateDirections() {
        this.directions = [
            [this.x - 1, this.y - 1],
            [this.x, this.y - 1],
            [this.x + 1, this.y - 1],
            [this.x - 1, this.y],
            [this.x + 1, this.y],
            [this.x - 1, this.y + 1],
            [this.x, this.y + 1],
            [this.x + 1, this.y + 1]
        ];
    }

    chooseDirection(characters) {
        this.updateDirections();
        let found = [];
        for (let [x, y] of this.directions) {
            if (x >= 0 && y >= 0 && x < matrix[0].length && y < matrix.length) {
                if (characters.includes(matrix[y][x])) {
                    found.push([x, y]);
                }
            }
        }
        return found;
    }

    spread() {
        const targets = this.chooseDirection([2, 3]);
        const target = random(targets);

        if (target) {
            const [x, y] = target;

            matrix[y][x] = this.index;
            grassEaterArr = grassEaterArr.filter(g => !(g.x == x && g.y == y));
            predatorArr = predatorArr.filter(p => !(p.x == x && p.y == y));

            virusArr.push(new Virus(x, y));
            this.energy++;
        } else {
            this.move();
        }

        if (this.energy <= 0) {
            this.die();
        }
    }

    move() {
        const emptySpaces = this.chooseDirection([0]);
        const empty = random(emptySpaces);

        if (empty) {
            const [x, y] = empty;
            matrix[y][x] = this.index;
            matrix[this.y][this.x] = 0;
            this.x = x;
            this.y = y;
            this.energy--;
        }
    }

    die() {
        matrix[this.y][this.x] = 0;
        virusArr = virusArr.filter(v => !(v.x == this.x && v.y == this.y));
    }
}

document.getElementById("reset").addEventListener("click", () => {
    location.reload();
});
