import Grass from "./src/grass";
import GrassEater from "./src/grassEater";
import Predator from "./src/predator";

let matrix = [];
let side = 50;
let grassArr = [];
let grassEaterArr = [];
let predatorArr = [];

function createMatrix(x, y) {
  for (let i = 0; i < y; i++) {
    const row = [];
    for (j = 0; j < x; j++) {
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
  fillMatrix(3, 50);
  frameRate(5);
  createCanvas(matrix[0].length * side, matrix.length * side);
  background("#acacac");

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

  window.defaultCanvas0.addEventListener("mouseenter", () => {
    document.getElementById("defaultCanvas0").className = "bg-black-700";
  });

  window.defaultCanvas0.addEventListener("mouseleave", () => {
    document.getElementById("defaultCanvas0").className = "shadow-none";
  });
  window.defaultCanvas0.addEventListener("click", () => {
    // TODO: Add later
    console.log("Click event triggered on canvas")
  });
}

function draw() {
  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[y].length; x++) {
      if (matrix[y][x] == 1) {
        fill("green");
      } else if (matrix[y][x] == 0) {
        fill("#acacac");
      } else if (matrix[y][x] == 2) {
        fill("yellow");
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
// ---
// GrassEater Class

// Predator Class

document.getElementById("reset").addEventListener("click", () => {
  location.reload();
});
