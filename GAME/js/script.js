document.addEventListener('DOMContentLoaded', () => {
    const cells = document.querySelectorAll('[data-cell]');
    const board = document.getElementById('board');
    const statusDisplay = document.getElementById('status');
    const resetButton = document.getElementById('resetBtn');
    const playerXScoreDisplay = document.getElementById('playerXScore');
    const playerOScoreDisplay = document.getElementById('playerOScore');
    const line = document.getElementById('line');

    let playerXScore = 0;
    let playerOScore = 0;
    let currentPlayer = 'X';
    let boardState = Array(9).fill(null);
    let gameActive = true;

    const winningConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    cells.forEach(cell => {
        cell.addEventListener('click', handleCellClick);
    });

    resetButton.addEventListener('click', resetGame);

    function handleCellClick(e) {
        const cell = e.target;
        const cellIndex = Array.from(cells).indexOf(cell);

        if (boardState[cellIndex] !== null || !gameActive) {
            return;
        }

        cell.textContent = currentPlayer;
        boardState[cellIndex] = currentPlayer;

        if (checkWin()) {
            gameActive = false;
            setTimeout(() => {
                alert(`Player ${currentPlayer} Wins!`);
                updateScore();
            }, 100);
        } else if (boardState.every(cell => cell !== null)) {
            gameActive = false;
            setTimeout(() => alert(`It's a Draw!`), 100);
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            statusDisplay.textContent = `Player ${currentPlayer}'s Turn`;
        }
    }

    function checkWin() {
        for (const condition of winningConditions) {
            const [a, b, c] = condition;
            if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
                drawWinningLine(a, b, c);
                return true;
            }
        }
        return false;
    }

    function drawWinningLine(a, b, c) {
        const cellA = cells[a];
        const cellB = cells[b];
        const cellC = cells[c];

        const posA = cellA.getBoundingClientRect();
        const posB = cellB.getBoundingClientRect();
        const posC = cellC.getBoundingClientRect();

        const boardPos = board.getBoundingClientRect();

        const startX = (posA.left + posA.right) / 2 - boardPos.left;
        const startY = (posA.top + posA.bottom) / 2 - boardPos.top;
        const endX = (posC.left + posC.right) / 2 - boardPos.left;
        const endY = (posC.top + posC.bottom) / 2 - boardPos.top;

        const distance = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
        const angle = Math.atan2(endY - startY, endX - startX) * 180 / Math.PI;

        line.style.width = `${distance}px`;
        line.style.transform = `rotate(${angle}deg)`;
        line.style.left = `${startX}px`;
        line.style.top = `${startY}px`;
        line.style.display = 'block';
    }

    function updateScore() {
        if (currentPlayer === 'X') {
            playerXScore++;
            playerXScoreDisplay.textContent = playerXScore;
        } else {
            playerOScore++;
            playerOScoreDisplay.textContent = playerOScore;
        }
    }

    function resetGame() {
        boardState = Array(9).fill(null);
        cells.forEach(cell => (cell.textContent = ''));
        currentPlayer = 'X';
        gameActive = true;
        line.style.display = 'none';
        statusDisplay.textContent = `Player ${currentPlayer}'s Turn`;
    }
});
