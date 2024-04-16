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
let currentPiece = createPiece();
// onLoad
window.onload = function () {
    render();
    drawPiece(currentPiece);
}

document.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowUp') {
        // rotate the piece
    } else if (event.key === 'ArrowRight') {
        if (canMove(currentPiece, 'right')) {
            clearPiece(currentPiece);
            currentPiece.x++;
            drawPiece(currentPiece);
        }
    } else if (event.key === 'ArrowDown') {
        if (canMove(currentPiece, 'down')) {
            clearPiece(currentPiece);
            currentPiece.y++;
            drawPiece(currentPiece);
        } else {
            // If the piece can't move down, create a new piece
            updateBoard(currentPiece);
            checkAndDeleteFullRows();
            currentPiece = createPiece();
        }
    } else if (event.key === 'ArrowLeft') {
        if (canMove(currentPiece, 'left')) {
            clearPiece(currentPiece);
            currentPiece.x--;
            drawPiece(currentPiece);
        }
    }
    console.log(currentPiece)
    console.log(board)

});

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

function createPiece() {
    let r = Math.floor(Math.random() * PIECES.length); // random index into PIECES
    let piece = PIECES[r][0];
    let color = PIECES[r][1];

    // start from top middle of the board
    let x = Math.floor(board[0].length / 2) - Math.ceil(piece[0].length / 2);
    let y = 0;

    return { piece, color, x, y };
}

function drawPiece(pieceObject) {
    for (let r = 0; r < pieceObject.piece.length; r++) {
        for (let c = 0; c < pieceObject.piece[r].length; c++) {
            // we draw only occupied squares
            if (pieceObject.piece[r][c]) {
                let cellElement = document.querySelector(`[data-row="${pieceObject.y + r}"][data-col="${pieceObject.x + c}"]`);
                if (cellElement) {
                    cellElement.style.backgroundColor = pieceObject.color;
                }
            }
        }
    }
}

function clearPiece(pieceObject) {
    for (let r = 0; r < pieceObject.piece.length; r++) {
        for (let c = 0; c < pieceObject.piece[r].length; c++) {
            // we clear only occupied squares
            if (pieceObject.piece[r][c]) {
                let cellElement = document.querySelector(`[data-row="${pieceObject.y + r}"][data-col="${pieceObject.x + c}"]`);
                if (cellElement) {
                    cellElement.style.backgroundColor = 'white';
                }
            }
        }
    }
}

function canMove(pieceObject, direction) {
    for (let r = 0; r < pieceObject.piece.length; r++) {
        for (let c = 0; c < pieceObject.piece[r].length; c++) {
            // we check only occupied squares
            if (pieceObject.piece[r][c]) {
                let nextX = pieceObject.x + c;
                let nextY = pieceObject.y + r;
                if (direction === 'down') {
                    if (board[nextY][nextX] !== EMPTY) {
                        return false;
                    }
                    // check if below cell is within the board
                    if (pieceObject.y + r + 1 >= board.length) {
                        return false;
                    }
                    // check if below cell is not empty
                    if (board[pieceObject.y + r + 1][pieceObject.x + c] !== EMPTY) {
                        return false;
                    }

                } else if (direction === 'left') {
                    if (board[nextY][nextX] !== EMPTY) {
                        return false;
                    }
                    // check if left cell is within the board
                    if (pieceObject.x + c - 1 < 0) {
                        return false;
                    }
                    // check if left cell is not empty
                    if (board[pieceObject.y + r][pieceObject.x + c - 1] !== EMPTY) {
                        return false;
                    }
                } else if (direction === 'right') {
                    if (board[nextY][nextX] !== EMPTY) {
                        return false;
                    }
                    // check if right cell is within the board
                    if (pieceObject.x + c + 1 >= board[0].length) {
                        return false;
                    }
                    // check if right cell is not empty
                    if (board[pieceObject.y + r][pieceObject.x + c + 1] !== EMPTY) {
                        return false;
                    }
                }
            }
        }
    }
    return true;
}


function updateBoard(pieceObject) {
    for (let r = 0; r < pieceObject.piece.length; r++) {
        for (let c = 0; c < pieceObject.piece[r].length; c++) {
            // we update only occupied squares
            if (pieceObject.piece[r][c]) {
                board[pieceObject.y + r][pieceObject.x + c] = 1;
            }
        }
    }
}

function checkAndDeleteFullRows() {
    for (let r = 0; r < board.length; r++) {
        let isRowFull = true;
        for (let c = 0; c < board[r].length; c++) {
            if (board[r][c] !== 1) {
                isRowFull = false;
                break;
            }
        }
        if (isRowFull) {
            // remove the row
            board.splice(r, 1);
            // add an empty row at the top
            board.unshift(Array(board[0].length).fill(EMPTY));

            // move all rows above the deleted row down by one
            for (let rAbove = r - 1; rAbove >= 0; rAbove--) {
                for (let c = 0; c < board[rAbove].length; c++) {
                    board[rAbove + 1][c] = board[rAbove][c];
                }
            }
            // clear the top row
            board[0] = Array(board[0].length).fill(EMPTY);
        }
    }
}