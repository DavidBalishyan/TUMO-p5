import Grass from "./grass";

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
      [this.x + 1, this.y + 1],
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

export default GrassEater;
