window.onload = () => {
  // nhận các phần tử DOM
  const grid = document.querySelector('.grid')
  const miniGrid = document.querySelector('.mini-grid');
  const endElement = document.querySelector('.end')
  const newGame = document.querySelector('.new-game-button')
  const levelButtons = document.querySelectorAll('.level-button');
  const replayButton = document.querySelector('.replay-button');
  const volumeControl = document.getElementById('volume');
  const volumeValue = document.querySelector('#volume-value');
  const scoreDisplay = document.querySelector('#score')
  const startBtn = document.querySelector('#start-button')
  const displaySquares = document.querySelectorAll('.mini-grid div')

  // biến let
  let level = 1;
  let squares = [];
  let nextRandom = 0
  let timerId
  let score = 0
  let obstacles = [];
  let currentPosition = 4
  let currentRotation = ROTATE_0DEG
  let randomNumber = Math.floor(Math.random()*pieces.length)
  let currentPiece = pieces[randomNumber][currentRotation]

  // biến const
  const keyMap = {
    37: moveLeft,  // Left arrow key
    38: rotate,    // Up arrow key
    39: moveRight, // Right arrow key
    40: moveDown   // Down arrow key
  };
  const rowNumber = 10
  const time = 500
  const colors = [
    'orange',
    'red',
    'purple',
    'green',
    'blue'
  ]
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
  ];
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
  const ROTATE_0DEG = 0;
  const displayWidth = 4
  const displayIndex = 0

  // Event listeners
  replayButton.addEventListener('click', () => {
    resetGameState();
  })
  levelButtons.forEach(button => {
    changeLevelBtnColor();
    button.addEventListener('click', function() {

      level = this.value;
      changeLevelBtnColor();
    });
  });
  volumeControl.addEventListener('input', function() {
    // Assuming you have an audio element with the id 'audio'
    const audio = document.querySelector('#audio');
    // audio.volume = this.value;

    // Update the displayed volume value
    volumeValue.textContent = `${Math.round(this.value * 100)}%`;
  });
  newGame.addEventListener('click', () => {
    endElement.style.display = 'none'
    window.location.reload()
  })
  startBtn.addEventListener('click', () => {
    console.log(level)
    if (timerId) {
      clearInterval(timerId)
      timerId = null
    } else {
      draw()
      if (level === '2') {
        obstacles = [142, 143, 147, 148];
      }
      obstacles.forEach(index => {
        squares[index].classList.add('taken');
        squares[index].style.backgroundColor = 'black';
      });
      timerId = setInterval(moveDown, time)
      nextRandom = Math.floor(Math.random() * pieces.length)
      displayShape()
    }
  })
  document.addEventListener('keyup', control)

  // functions
  function resetGameState() {
    // Reset game state
    squares.forEach(square => {
      square.classList.remove('piece', 'taken', 'obstacle');
      square.style.backgroundColor = '';
      square.style.boxShadow = '';

    });
    // Reset score
    score = 0;

    scoreDisplay.innerHTML = score;
    // Reset piece position and rotation
    currentPosition = 4;

    currentRotation = ROTATE_0DEG;
    // generateObstacles();
    if (level === '2') {
      obstacles = [142, 143, 147, 148];
    }
    obstacles.forEach(index => {
      squares[index].classList.add('taken');
      squares[index].style.backgroundColor = 'black';

    });
    // Generate new piece
    randomNumber = Math.floor(Math.random() * pieces.length);

    currentPiece = pieces[randomNumber][currentRotation];
    // Draw new piece

    draw();
    // Start game
    if (timerId) {
      clearInterval(timerId);
    }

    timerId = setInterval(moveDown, time);
    // Display next piece
    nextRandom = Math.floor(Math.random() * pieces.length);

    displayShape();
    // Add event listener for keyboard controls

    document.addEventListener('keyup', control)
    // Hide game over screen
    endElement.style.display = 'none';

  }

  // Create main grid and taken blocks in one loop
  for (let i = 0; i < 210; i++) { // 200 cells for the grid + 10 taken cells
    const div = document.createElement('div');
    div.classList.add('cell');
    if (i >= 200) div.classList.add('block'); // Last 10 cells are taken
    grid.appendChild(div);
    squares.push(div); // Add the created div to the squares array
  }

  // Tạo lưới phụ (mini-grid) với 16 ô
  for (let i = 0; i < 16; i++) {
    const div = document.createElement('div');
    miniGrid.appendChild(div);
  }

  // draw the Piece
  function draw() {
    currentPiece.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          squares[currentPosition + y * rowNumber + x].classList.add('piece');
          squares[currentPosition + y * rowNumber + x].style.backgroundColor = colors[randomNumber];
          squares[currentPosition + y * rowNumber + x].style.boxShadow = '0 0 1px black'
        }
      });
    });
  }

  function changeLevelBtnColor() {
    levelButtons.forEach(button => {
      if (button.value === level.toString()) {
        button.style.backgroundColor = '#5649f1';
        button.style.color = 'white';
      } else {
        button.style.backgroundColor = 'white';
        button.style.color = 'gray';
      }
    });
  }

  function undraw() {
    currentPiece.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          squares[currentPosition + y * rowNumber + x].classList.remove('piece');
          squares[currentPosition + y * rowNumber + x].style.backgroundColor = '';
          squares[currentPosition + y * rowNumber + x].style.boxShadow = ''
        }
      });
    });
  }

  function control(e) {
    if (timerId) {
      const handler = keyMap[e.keyCode];
      if (handler) {
        handler();
      }
    }
  }

  //move down function
  function moveDown() {
    undraw();
    currentPosition += rowNumber;
    draw();
    freeze();
  }

  function freeze() {
    // Kiểm tra xem có ô nào của khối hiện tại cộng với chiều rộng (có nghĩa là ở hàng bên dưới)
    // đã được đánh dấu là 'taken' hay không.
    if (currentPiece.some((row, y) => {
      return row.some((value, x) => {
        return value !== 0 && (
            squares[currentPosition + y * rowNumber + x + rowNumber].classList.contains('taken') ||
            squares[currentPosition + y * rowNumber + x + rowNumber].classList.contains('block')
        );
      });
    })) {
      // If the piece hits an obstacle, end the game
      if (getCurrentPieceIndexes().some(index => squares[index].classList.contains('obstacle'))) {
        return gameOver();
      }
      // Nếu có, thì đánh dấu tất cả các ô của khối piece hiện tại là 'taken'.
      currentPiece.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value !== 0) {
            squares[currentPosition + y * rowNumber + x].classList.add('taken');
          }
        });
      });
      // Bắt đầu cho một khối mới rơi
      randomNumber = nextRandom;
      nextRandom = Math.floor(Math.random() * pieces.length);
      currentPiece = pieces[randomNumber][currentRotation];
      currentPosition = 4; // Reset vị trí hiện tại về vị trí ban đầu
      displayShape(); // Hiển thị khối tiếp theo trong mini-grid
      addScore(); // Cập nhật điểm số
      gameOver(); // Kiểm tra xem trò chơi đã kết thúc chưa
    }
  }

  function moveLeft() {
    undraw()
    const isAtLeftEdge = currentPiece.some((row, y) =>
        row.some((value, x) => value !== 0 && (currentPosition + y * rowNumber + x) % rowNumber === 0)
    );
    if (!isAtLeftEdge) currentPosition -= 1;
    if (getCurrentPieceIndexes().some(index => squares[index].classList.contains('taken'))) {
      currentPosition += 1;
    }
    draw()
  }

  function moveRight() {
    undraw()
    const isAtRightEdge = currentPiece.some((row, y) =>
        row.some((value, x) => value !== 0 && (currentPosition + y * rowNumber + x) % rowNumber === rowNumber - 1)
    );
    if (!isAtRightEdge) currentPosition += 1;
    if (getCurrentPieceIndexes().some(index => squares[index].classList.contains('taken'))) {
      currentPosition -= 1;
    }
    draw()
  }

  function checkRotatedPosition() {
    const isAtRightEdge = currentPiece.some((row, y) =>
        row.some((value, x) => value !== 0 && (currentPosition + y * rowNumber + x) % rowNumber === rowNumber - 1)
    );
    const isAtLeftEdge = currentPiece.some((row, y) =>
        row.some((value, x) => value !== 0 && (currentPosition + y * rowNumber + x) % rowNumber === 0)
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

  function rotate() {
    undraw();
    if (currentRotation === 3) {
        currentRotation = -1;
    }
    currentRotation += 1;
    currentPiece = pieces[randomNumber][currentRotation];
    checkRotatedPosition();
    draw();
  }

  function displayShape() {
    displaySquares.forEach(square => {
      square.classList.remove('piece');
      square.style.backgroundColor = '';
    });
    pieces[nextRandom][0].forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          displaySquares[displayIndex + y * displayWidth + x].classList.add('piece');
          displaySquares[displayIndex + y * displayWidth + x].style.backgroundColor = colors[nextRandom];
        }
      });
    });
  }

  //add score
  function addScore() {
    let linesCleared = 0;
    for (let i = 0; i < squares.length; i += rowNumber) {
      const row = Array.from({ length: rowNumber }, (_, k) => i + k);
      if (row.every(index => squares[index].classList.contains('taken'))) {
        score += 10;
        linesCleared += 1;
        row.forEach(index => {
          squares[index].classList.remove('taken');
          squares[index].classList.remove('piece');
          squares[index].style.backgroundColor = '';
          squares[index].style.boxShadow = ''

        });
        const squaresRemoved = squares.splice(i, rowNumber);
        squares = squaresRemoved.concat(squares);
        squares.forEach(cell => grid.appendChild(cell));
      }
    }

    if (linesCleared > 0) {
      scoreDisplay.innerHTML = score;
      generateNewPiece();
    }

    // Check if player has reached 50 points
    if (score >= 50) {
      clearInterval(timerId);
      notification("You've won!");
    }

  }

  function generateNewPiece() {
    // Update the reference for the next tetromino
    randomNumber = nextRandom;
    nextRandom = Math.floor(Math.random() * pieces.length);
    currentPiece = pieces[randomNumber][currentRotation];
    currentPosition = 4; // Reset current position to the start position
    draw(); // Draw the new tetromino
    displayShape(); // Update the next tetromino in the mini-grid
  }

  function gameOver() {
    // Kiểm tra xem liệu có phần tử nào trong khối hiện tại nằm ở vị trí đã được 'taken' hay không.
    if (currentPiece.some((row, y) => {
      return row.some((value, x) => {
        return value !== 0 && squares[currentPosition + y * rowNumber + x].classList.contains('taken');
      });
    })) {
      clearInterval(timerId);
      timerId = null;
      document.removeEventListener('keyup', control);
      notification('Game Over')
      newGame.addEventListener('click', restartGame);
    }
  }

  // trả về một mảng các index dựa trên vị trí và hướng xoay hiện tại của mảng 'Piece'
  function getCurrentPieceIndexes() {
    current = [];
    currentPiece.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          current.push(currentPosition + y * rowNumber + x);
        }
      });
    });
    console.log(current);
    return current;
  }

  function restartGame() {
    // Clear the previous game state, score, and timer.
    document.addEventListener('keyup', control);
    scoreDisplay.innerHTML = 0;
    score = 0;
    startBtn.textContent = 'Start';

    // Clear the grid and display.
    squares.forEach(square => {
      square.classList.remove('piece', 'taken');
      square.style.backgroundColor = '';
    });
    displaySquares.forEach(square => {
      square.classList.remove('piece');
      square.style.backgroundColor = '';
    });
  }

  function notification(noti) {
    const notiElement = document.querySelector(".noti")
    notiElement.textContent = noti
    endElement.style.display = 'flex'
  }

  function generateObstacles() {
    let obstacleIndex = 40
    let obstacles = []
    squares.forEach((square, index) => {
      if (index === obstacleIndex) {
        obstacles.push(square)
      }
    });

    obstacles.forEach((obstacle, index) => {
      obstacle.classList.add('obstacle');
    })

    let moveRight = true;

    setInterval(() => {
      obstacles.forEach((obstacle, index) => {
        const obstacleIndex = squares.indexOf(obstacle);

        // Remove the 'obstacle' class from the current square
        squares[obstacleIndex].classList.remove('obstacle');

        // Determine the new position of the obstacle
        let newObstacleIndex;
        if (moveRight) {
          // If the obstacle is at the right edge of the grid, mark it to move left in the next move
          if (obstacleIndex % rowNumber === rowNumber - 1) {
            moveRight = false;
            newObstacleIndex = obstacleIndex - 1;
          } else {
            newObstacleIndex = obstacleIndex + 1;
          }
        } else {
          // If the obstacle is at the left edge of the grid, mark it to move right in the next move
          if (obstacleIndex % rowNumber === 0) {
            moveRight = true;
            newObstacleIndex = obstacleIndex + 1;
          } else {
            newObstacleIndex = obstacleIndex - 1;
          }
        }

        // Add the 'obstacle' class to the new square
        squares[newObstacleIndex].classList.add('obstacle');
        // Update the obstacle in the obstacles array
        obstacles[index] = squares[newObstacleIndex];
      });
    }, 1000);
  }
}