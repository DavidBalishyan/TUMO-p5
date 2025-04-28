let matrix = [
    [0, 0, 1, 0, 0],
    [1, 3, 0, 2, 0],
    [0, 1, 3, 0, 0],
    [2, 2, 1, 2, 0],
    [1, 1, 0, 3, 0],
    [1, 1, 2, 0, 0],
    [1, 1, 0, 0, 0]
];

let side = 120;
let grassArr = [];
let grassEaterArr = [];
let predatorArr = [];

function setup() {
    frameRate(5);
    createCanvas(matrix[0].length * side, matrix.length * side);
    background('#acacac');

    for (let y = 0; y < matrix.length; y++) {
        for (let x = 0; x < matrix[y].length; x++) {
            if (matrix[y][x] == 1) {
                const grass = new Grass(x, y);
                grassArr.push(grass);
            } else if (matrix[y][x] == 2) {
                const grassEater = new GrassEater(x, y);
                grassEaterArr.push(grassEater);
            } else if (matrix[y][x] == 3) {
                const predator = new Predator(x, y);
                predatorArr.push(predator);
            }
        }
    }
}

function draw() {
    for (let y = 0; y < matrix.length; y++) {
        for (let x = 0; x < matrix[y].length; x++) {
            if (matrix[y][x] == 1) {
                fill("green");
            } else if (matrix[y][x] == 0) {
                fill("#acacac");
            } else if (matrix[y][x] == 2) {
                fill('yellow');
            } else if (matrix[y][x] == 3) {
                fill("red");
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

        for (let direction of this.directions) {
            let x = direction[0];
            let y = direction[1];

            if (x >= 0 && y >= 0 && x < matrix[0].length && y < matrix.length) {
                if (matrix[y][x] == character) {
                    found.push(direction);
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
            const newX = empty[0];
            const newY = empty[1];

            matrix[newY][newX] = this.index;
            const newGrass = new Grass(newX, newY);
            grassArr.push(newGrass);

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

        for (let direction of this.directions) {
            let x = direction[0];
            let y = direction[1];

            if (x >= 0 && y >= 0 && x < matrix[0].length && y < matrix.length) {
                if (matrix[y][x] == character) {
                    found.push(direction);
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

    eat(grass) {
        const x = grass[0];
        const y = grass[1];

        matrix[y][x] = this.index;
        matrix[this.y][this.x] = 0;

        for (let i = 0; i < grassArr.length; i++) {
            const grassObj = grassArr[i];
            if (grassObj.x == x && grassObj.y == y) {
                grassArr.splice(i, 1);
                break;
            }
        }

        this.x = x;
        this.y = y;
        this.energy++;
    }

    move() {
        const emptySpaces = this.chooseDirection(0);
        const empty = random(emptySpaces);

        if (empty) {
            const x = empty[0];
            const y = empty[1];

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
            const x = empty[0];
            const y = empty[1];

            matrix[y][x] = this.index;
            this.energy = 10;

            const newGrassEater = new GrassEater(x, y);
            grassEaterArr.push(newGrassEater);
        }
    }

    die() {
        matrix[this.y][this.x] = 0;

        for (let i = 0; i < grassEaterArr.length; i++) {
            const grassEaterObj = grassEaterArr[i];
            if (grassEaterObj.x == this.x && grassEaterObj.y == this.y) {
                grassEaterArr.splice(i, 1);
                break;
            }
        }
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

        for (let direction of this.directions) {
            let x = direction[0];
            let y = direction[1];

            if (x >= 0 && y >= 0 && x < matrix[0].length && y < matrix.length) {
                if (matrix[y][x] == character) {
                    found.push(direction);
                }
            }
        }

        return found;
    }

    tryEat() {
        const prey = this.chooseDirection(2); // look for GrassEaters
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

    eat(target) {
        const x = target[0];
        const y = target[1];

        matrix[y][x] = this.index;
        matrix[this.y][this.x] = 0;

        for (let i = 0; i < grassEaterArr.length; i++) {
            const grassEaterObj = grassEaterArr[i];
            if (grassEaterObj.x == x && grassEaterObj.y == y) {
                grassEaterArr.splice(i, 1);
                break;
            }
        }

        this.x = x;
        this.y = y;
        this.energy++;
    }

    move() {
        const emptySpaces = this.chooseDirection(0);
        const empty = random(emptySpaces);

        if (empty) {
            const x = empty[0];
            const y = empty[1];

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
            const x = empty[0];
            const y = empty[1];

            matrix[y][x] = this.index;
            this.energy = 10;

            const newPredator = new Predator(x, y);
            predatorArr.push(newPredator);
        }
    }

    die() {
        matrix[this.y][this.x] = 0;

        for (let i = 0; i < predatorArr.length; i++) {
            const predatorObj = predatorArr[i];
            if (predatorObj.x == this.x && predatorObj.y == this.y) {
                predatorArr.splice(i, 1);
                break;
            }
        }
    }
}
