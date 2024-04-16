
window.onload = () => {
  const grid = document.querySelector('.grid')
  let squares = Array.from(document.querySelectorAll('.grid div'))
  const scoreDisplay = document.querySelector('#score')
  const startBtn = document.querySelector('#start-button')
  const width = 10
  let nextRandom = 0
  let timerId
  let score = 0
  const colors = [
    'orange',
    'red',
    'purple',
    'green',
    'blue'
  ]

  // Piece
  const lPiece = [
    [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0]
    ],
    [
      [0, 1, 0],
      [0, 1, 0],
      [0, 1, 1]
    ],
    [
      [0, 0, 0],
      [1, 1, 1],
      [1, 0, 0]
    ],
    [
      [1, 1, 0],
      [0, 1, 0],
      [0, 1, 0]
    ]
  ]
  const zPiece = [
    [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0]
    ],
    [
      [0, 0, 1],
      [0, 1, 1],
      [0, 1, 0]
    ],
    [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0]
    ],
    [
      [0, 0, 1],
      [0, 1, 1],
      [0, 1, 0]
    ]
  ];
  const tPiece = [
    [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0]
    ],
    [
      [0, 1, 0],
      [0, 1, 1],
      [0, 1, 0]
    ],
    [
      [0, 0, 0],
      [1, 1, 1],
      [0, 1, 0]
    ],
    [
      [0, 1, 0],
      [1, 1, 0],
      [0, 1, 0]
    ]
  ];
  const oPiece = [
    [
      [1, 1],
      [1, 1]
    ],
    [
      [1, 1],
      [1, 1]
    ],
    [
      [1, 1],
      [1, 1]
    ],
    [
      [1, 1],
      [1, 1]
    ]

  ];
  const iPiece = [
    [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ],
    [
      [0, 0, 1, 0],
      [0, 0, 1, 0],
      [0, 0, 1, 0],
      [0, 0, 1, 0]
    ],
    [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ],
    [
      [0, 0, 1, 0],
      [0, 0, 1, 0],
      [0, 0, 1, 0],
      [0, 0, 1, 0]
    ]

  ];

  const pieces = [lPiece, zPiece, tPiece, oPiece, iPiece]

  let currentPosition = 4
  let currentRotation = 0

  // rotate
  const ROTATE_0DEG = 0;
  const ROTATE_90DEG = 1;
  const ROTATE_180DEG = 2;
  const ROTATE_270DEG = 3;

  // chọn ngẫu nhiên một piece và hướng xoay đầu tiên
  let randomNumber = Math.floor(Math.random()*pieces.length)
  let currentPiece = pieces[randomNumber][ROTATE_0DEG]

  // draw the Piece
  function draw() {
    console.log(currentPiece)
    currentPiece.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          squares[currentPosition + y * width + x].classList.add('tetromino');
          squares[currentPosition + y * width + x].style.backgroundColor = colors[randomNumber];
        }
      });
    });
  }

  // undraw the Piece
  function undraw() {
    currentPiece.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          squares[currentPosition + y * width + x].classList.remove('tetromino');
          squares[currentPosition + y * width + x].style.backgroundColor = '';
        }
      });
    });
  }

  //assign functions to keyCodes
  function control(e) {
    if(e.keyCode === 37) {
      moveLeft()
    } else if (e.keyCode === 38) {
      rotate()
    } else if (e.keyCode === 39) {
      moveRight()
    } else if (e.keyCode === 40) {
      moveDown()
    }
  }
  document.addEventListener('keyup', control)

  //move down function
  function moveDown() {
    undraw();
    currentPosition += width;
    draw();
    freeze();
  }

  //freeze function
  function freeze() {
    if (getCurrentPieceIndexes().some(index => squares[index + width].classList.contains('taken'))) {
      getCurrentPieceIndexes().forEach(index => squares[index].classList.add('taken'));
      // start a new piece falling
      randomNumber = nextRandom;
      nextRandom = Math.floor(Math.random() * pieces.length);
      currentRotation = 0;
      currentPiece = pieces[randomNumber][currentRotation];
      currentPosition = 4;
      draw();
      displayShape();
      addScore();
      gameOver();
    }
  }

// Move the Piece left, unless is at the edge or there is a blockage
  function moveLeft() {
    undraw()
    const isAtLeftEdge = currentPiece.some((row, y) =>
        row.some((value, x) => value !== 0 && (currentPosition + y * width + x) % width === 0)
    );
    if (!isAtLeftEdge) currentPosition -= 1;
    if (getCurrentPieceIndexes().some(index => squares[index].classList.contains('taken'))) {
      currentPosition += 1;
    }
    draw()
  }

  // Move the Piece right, unless is at the edge or there is a blockage
  function moveRight() {
    undraw()
    const isAtRightEdge = currentPiece.some((row, y) =>
        row.some((value, x) => value !== 0 && (currentPosition + y * width + x) % width === width - 1)
    );
    if (!isAtRightEdge) currentPosition += 1;
    if (getCurrentPieceIndexes().some(index => squares[index].classList.contains('taken'))) {
      currentPosition -= 1;
    }
    draw()
  }

  ///FIX ROTATION OF TETROMINOS A THE EDGE
  function isAtRight() {
    return current.some(index=> (currentPosition + index + 1) % width === 0)
  }

  function isAtLeft() {
    return current.some(index=> (currentPosition + index) % width === 0)
  }

  function checkRotatedPosition() {
    const isAtRightEdge = currentPiece.some((row, y) =>
        row.some((value, x) => value !== 0 && (currentPosition + y * width + x) % width === width - 1)
    );
    const isAtLeftEdge = currentPiece.some((row, y) =>
        row.some((value, x) => value !== 0 && (currentPosition + y * width + x) % width === 0)
    );

    if(isAtRightEdge && isAtLeftEdge) { // piece would overlap both edges, typically happens with `I` piece
      if(currentRotation === 0 || currentRotation === 2) {
        // fix overlap with right edge
        currentPosition -= 1;
      } else {
        // fix overlap with left edge
        currentPosition += 1;
      }
    } else if(isAtRightEdge) {
      currentPosition -= 1; // fix overlap with right edge
    } else if(isAtLeftEdge) {
      currentPosition += 1; // fix overlap with left edge
    }
  }

  //rotate the tetromino
  function rotate() {
    undraw();
    currentRotation = (currentRotation + 1) % currentPiece.length;
    currentPiece = pieces[randomNumber][currentRotation];
    checkRotatedPosition();
    draw();
  }
  /////////



  //show up-next tetromino in mini-grid display
  const displaySquares = document.querySelectorAll('.mini-grid div')
  const displayWidth = 4
  const displayIndex = 0


  //the Tetrominos without rotations
  const upNextTetrominoes = [
    [1, displayWidth+1, displayWidth*2+1, 2], //lTetromino
    [0, displayWidth, displayWidth+1, displayWidth*2+1], //zTetromino
    [1, displayWidth, displayWidth+1, displayWidth+2], //tTetromino
    [0, 1, displayWidth, displayWidth+1], //oTetromino
    [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1] //iTetromino
  ]

  // Display the shape in the mini-grid display
  function displayShape() {
    displaySquares.forEach(square => {
      square.classList.remove('tetromino');
      square.style.backgroundColor = '';
    });
    pieces[nextRandom][0].forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          displaySquares[displayIndex + y * displayWidth + x].classList.add('tetromino');
          displaySquares[displayIndex + y * displayWidth + x].style.backgroundColor = colors[nextRandom];
        }
      });
    });
  }

  //add functionality to the button
  startBtn.addEventListener('click', () => {
    if (timerId) {
      clearInterval(timerId)
      timerId = null
    } else {
      draw()
      timerId = setInterval(moveDown, 1000)
      nextRandom = Math.floor(Math.random() * pieces.length) // sửa đổi từ theTetrominoes thành pieces
      displayShape()
    }
  })

  //add score
  function addScore() {
    let linesCleared = 0;
    for (let i = 0; i < squares.length; i += width) {
      const row = Array.from({ length: width }, (_, k) => i + k);
      if (row.every(index => squares[index].classList.contains('taken'))) {
        score += 10;
        linesCleared += 1;
        row.forEach(index => {
          squares[index].classList.remove('taken');
          squares[index].classList.remove('tetromino');
          squares[index].style.backgroundColor = '';
        });

        const squaresRemoved = squares.splice(i, width);
        squares = squaresRemoved.concat(squares);
        squares.forEach(cell => grid.appendChild(cell));
      }
    }

    if (linesCleared > 0) {
      scoreDisplay.innerHTML = score;
      linesCleared = 0;
    }
  }

  //game over
  function gameOver() {
    if (getCurrentPieceIndexes().some(index => squares[index].classList.contains('taken'))) {
      scoreDisplay.innerHTML = 'end';
      clearInterval(timerId);
      // Optional: Add a control to let the player restart the game.
    }
  }

  // trả về một mảng các index dựa trên vị trí và hướng xoay hiện tại của mảng 'Piece'
  function getCurrentPieceIndexes() {
    let indexes = [];
    currentPiece.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          indexes.push(currentPosition + y * width + x);
        }
      });
    });
    return indexes;
  }
}