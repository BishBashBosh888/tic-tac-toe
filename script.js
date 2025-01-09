const gameBoard = (function (){
    let board = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ];

    let currentPlayerIndex = 0;
    let players = [];

    let isGameOver = false;

    function setMark(row ,col, mark){
        if(board[row][col] === ''){
            board[row][col] = mark;
            return true;
        }
        return false;
    }

    function checkWin() {
        // Check rows and columns together
        for (let i = 0; i < 3; i++) {
            if (board[i][0] !== '' && board[i][0] === board[i][1] && board[i][1] === board[i][2]) {
                return true;
            }
            if (board[0][i] !== '' && board[0][i] === board[1][i] && board[1][i] === board[2][i]) {
                return true;
            }
        }
    
        // Check diagonals
        if (board[0][0] !== '' && board[0][0] === board[1][1] && board[1][1] === board[2][2]) {
            return true;
        }
        if (board[0][2] !== '' && board[0][2] === board[1][1] && board[1][1] === board[2][0]) {
            return true;
        }
    
        return false;
    }

    function getBoard(){
        return board;
    }

    function isBoardFull() {
        return board.every(row => row.every(cell => cell !== ''));
    }

    function resetBoard(){
        board = [
            ['', '', ''],
            ['', '', ''],
            ['', '', '']
        ];
        currentPlayerIndex = 0;
        isGameOver = false;
    }

    function switchTurn() {
        currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
    }

    function playTurn(row, col){
        if (setMark(row, col, players[currentPlayerIndex].symbol)){
            console.log(`${players[currentPlayerIndex].name} placed ${players[currentPlayerIndex].symbol} at (${row}, ${col})`);
            board.forEach(tile => {
                console.log(tile);
            });
            if (checkWin()) {
                console.log(`${players[currentPlayerIndex].name} wins!`);
                isGameOver = true;
                return;
            }
            if (isBoardFull()) {
                console.log("It's a tie!");
                isGameOver = true;
                return;
            }
            switchTurn();
        } else {
            console.log("Invalid move, try again.");
        }
    }

    function setPlayer(player1,player2){
        players = [player1, player2];
    }

    function startGame(player1,player2){
        setPlayer(player1,player2);
        while (!isGameOver) {
            const row = parseInt(prompt(`${players[currentPlayerIndex].name}, enter row (0, 1, or 2):`), 10);
            const col = parseInt(prompt(`${players[currentPlayerIndex].name}, enter col (0, 1, or 2):`), 10);
            playTurn(row, col);
        }
        console.log("Game Over!");
    }

    return { getBoard, resetBoard, startGame, playTurn, setPlayer, isBoardFull , checkWin};
})();

function createPlayer(name, symbol){
    let score = 0

    const getScore = () =>{
        return score;
    }

    const giveScore = () =>{
        score += 1;
    }

    return {name, symbol, getScore, giveScore};
}


// frontend
const gameBoardDiv = document.getElementById('gameBoard');
const messageDiv = document.getElementById('message');
const resetButton = document.getElementById('resetButton');

const player1 = createPlayer('bob','X');
const player2 = createPlayer('guerilla','O');
gameBoard.setPlayer(player1,player2);
let currentPlayer = player1;

gameBoard.resetBoard();
renderBoard();

function renderBoard() {
    gameBoardDiv.innerHTML = "";
    const board = gameBoard.getBoard();
    board.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        const cellDiv = document.createElement("div");
        cellDiv.classList.add("cell");
        if (cell !== "") cellDiv.classList.add("taken");
        console.log("cell = ", cell);
        cellDiv.textContent = cell;
        cellDiv.addEventListener("click", () => handleMove(rowIndex, colIndex));
        gameBoardDiv.appendChild(cellDiv);
      });
    });
    messageDiv.textContent = `${currentPlayer.name}'s turn (${currentPlayer.symbol})`;
}

function handleMove(row, col) {
    if (!gameBoard.getBoard()[row][col]) {
        gameBoard.playTurn(row, col);

        renderBoard();

        if (gameBoard.checkWin()) {
            messageDiv.textContent = `${currentPlayer.name} wins!`;
            disableBoard();
        } else if (gameBoard.isBoardFull()) {
            messageDiv.textContent = "It's a tie!";
        } else {
            currentPlayer = currentPlayer === player1 ? player2 : player1;
            messageDiv.textContent = `${currentPlayer.name}'s turn (${currentPlayer.symbol})`;
        }
    }
}

function disableBoard() {
    document.querySelectorAll(".cell").forEach((cell) => {
      cell.classList.add("taken");
      cell.removeEventListener("click", handleMove);
    });
}

resetButton.addEventListener("click", () => {
    gameBoard.resetBoard();
    currentPlayer = player1;
    renderBoard();
});