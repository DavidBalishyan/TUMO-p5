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

export default Grass;
