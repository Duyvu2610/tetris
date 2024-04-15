// const
const EMPTY = 0;
const SIZE = 35;
const Z = [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0]
];
const S = [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0]
];
const T = [
    [0, 1, 0],
    [1, 1, 1],
    [0, 0, 0]
];
const O = [
    [1, 1],
    [1, 1]
];
const L = [
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 0]
];
const I = [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
];
const J = [
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 0]
];

const PIECES = [
    [Z, "red"],
    [S, "green"],
    [T, "yellow"],
    [O, "blue"],
    [L, "purple"],
    [I, "cyan"],
    [J, "orange"]
];
// init array 20x10
let board = Array.from({ length: 20 }, () => Array(10).fill(EMPTY));

// onLoad
window.onload = function () {
    render();
}

// render
function render() {
    const boardElement = document.querySelector(".tetris__main")
    boardElement.style.width = SIZE * 10 + "px";
    boardElement.style.height = SIZE * 20 + "px";

    board.forEach((row, i) => {
        row.forEach((cell, j) => {
            let cellElement = document.createElement("div");
            cellElement.style.width = SIZE + "px";
            cellElement.style.height = SIZE + "px";
            cellElement.style.top = i * SIZE + "px";
            cellElement.style.left = j * SIZE + "px";
            cellElement.style.position = "absolute";
            cellElement.style.backgroundColor = cell === EMPTY ? "white" : "black";
            cellElement.setAttribute("data-row", i.toString());
            cellElement.setAttribute("data-col", j.toString());
            boardElement.appendChild(cellElement);
        })
    });
}

function randomPiece() {
    let r = Math.floor(Math.random() * PIECES.length); // random index into PIECES
    return new Piece(PIECES[r][0], PIECES[r][1]);
}

function createPiece(shape, color) {
    return {
        shape: shape,
        color: color,
        tetrominoN: 0, // we start from the first pattern
        activeTetromino: shape[0],
        x: 0,
        y: 0
    };
}

function moveDown(piece) {
    return {
        ...piece,
        y: piece.y + 1
    };
}

function moveRight(piece) {
    return {
        ...piece,
        x: piece.x + 1
    };
}

function moveLeft(piece) {
    return {
        ...piece,
        x: piece.x - 1
    };
}

function rotate(piece) {
    const tetrominoN = (piece.tetrominoN + 1) % piece.shape.length;
    return {
        ...piece,
        tetrominoN: tetrominoN,
        activeTetromino: piece.shape[tetrominoN]
    };
}