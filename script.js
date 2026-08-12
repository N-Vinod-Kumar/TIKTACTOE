const cells = document.querySelectorAll(".cell");

const statusText = document.getElementById("status");

const scoreXElement = document.getElementById("scoreX");
const scoreOElement = document.getElementById("scoreO");
const scoreDrawElement = document.getElementById("scoreDraw");

const resultOverlay = document.getElementById("resultOverlay");
const resultBox = document.getElementById("resultBox");
const resultIcon = document.getElementById("resultIcon");
const resultTitle = document.getElementById("resultTitle");
const resultSubtitle = document.getElementById("resultSubtitle");

let board = [
    "", "", "",
    "", "", "",
    "", "", ""
];

let gameOver = false;
let playerTurn = true;

let scores = {
    x: 0,
    o: 0,
    draw: 0
};

const winningPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

cells.forEach(cell => {

    cell.addEventListener("click", () => {

        const index = Number(cell.dataset.index);

        if (
            board[index] !== "" ||
            gameOver ||
            !playerTurn
        ) {
            return;
        }

        makeMove(index, "X");

        if (!gameOver) {

            playerTurn = false;

            statusText.innerHTML =
                'CPU thinking... <span>O</span>';

            setTimeout(cpuMove, 500);
        }

    });

});

function makeMove(index, player) {

    board[index] = player;

    const cell = cells[index];

    cell.textContent = player;

    cell.classList.add(
        "filled",
        player.toLowerCase()
    );

    checkGame();
}

function checkGame() {

    for (const pattern of winningPatterns) {

        const [a, b, c] = pattern;

        if (
            board[a] &&
            board[a] === board[b] &&
            board[a] === board[c]
        ) {

            gameOver = true;

            pattern.forEach(index => {
                cells[index].classList.add("winner");
            });

            const winner = board[a];

            if (winner === "X") {

                scores.x++;

                updateScores();

                statusText.innerHTML =
                    'Victory — <span>X wins</span>';

                showResult("won");

            } else {

                scores.o++;

                updateScores();

                statusText.innerHTML =
                    'Defeat — <span>O wins</span>';

                showResult("lost");
            }

            return;
        }
    }

    if (!board.includes("")) {

        gameOver = true;

        scores.draw++;

        updateScores();

        statusText.innerHTML =
            'Match complete — <span>Draw</span>';

        showResult("draw");
    }
}

function showResult(type) {

    resultBox.classList.remove(
        "won",
        "lost",
        "draw-result"
    );

    if (type === "won") {

        resultBox.classList.add("won");

        resultIcon.textContent = "✓";

        resultTitle.textContent =
            "YOU WON";

        resultSubtitle.textContent =
            "Excellent move. The system has been defeated.";

    } else if (type === "lost") {

        resultBox.classList.add("lost");

        resultIcon.textContent = "×";

        resultTitle.textContent =
            "YOU LOSE";

        resultSubtitle.textContent =
            "The system was one step ahead this time.";

    } else {

        resultBox.classList.add("draw-result");

        resultIcon.textContent = "=";

        resultTitle.textContent =
            "DRAW";

        resultSubtitle.textContent =
            "Both players are evenly matched.";
    }

    setTimeout(() => {
        resultOverlay.classList.add("show");
    }, 650);
}

function playAgain() {

    resultOverlay.classList.remove("show");

    setTimeout(() => {
        newGame();
    }, 300);
}

function newGame() {

    board = [
        "", "", "",
        "", "", "",
        "", "", ""
    ];

    gameOver = false;
    playerTurn = true;

    cells.forEach(cell => {

        cell.textContent = "";

        cell.className = "cell";

    });

    statusText.innerHTML =
        'Your turn — <span>X</span>';
}

function resetScore() {

    scores = {
        x: 0,
        o: 0,
        draw: 0
    };

    updateScores();

    resultOverlay.classList.remove("show");

    newGame();
}

function updateScores() {

    scoreXElement.textContent = scores.x;

    scoreOElement.textContent = scores.o;

    scoreDrawElement.textContent = scores.draw;
}

function cpuMove() {

    if (gameOver) {
        return;
    }

    const emptyCells = board
        .map((value, index) =>
            value === "" ? index : null
        )
        .filter(index => index !== null);

    if (!emptyCells.length) {
        return;
    }

    let move = findBestMove("O");

    if (move === -1) {
        move = findBestMove("X");
    }

    if (
        move === -1 &&
        board[4] === ""
    ) {
        move = 4;
    }

    if (move === -1) {

        const corners = [0, 2, 6, 8]
            .filter(index =>
                board[index] === ""
            );

        if (corners.length) {

            move =
                corners[
                    Math.floor(
                        Math.random() * corners.length
                    )
                ];
        }
    }

    if (move === -1) {

        move =
            emptyCells[
                Math.floor(
                    Math.random() * emptyCells.length
                )
            ];
    }

    makeMove(move, "O");

    if (!gameOver) {

        playerTurn = true;

        statusText.innerHTML =
            'Your turn — <span>X</span>';
    }
}

function findBestMove(player) {

    for (const pattern of winningPatterns) {

        const [a, b, c] = pattern;

        const values = [
            board[a],
            board[b],
            board[c]
        ];

        const playerCount =
            values.filter(
                value => value === player
            ).length;

        const emptyCount =
            values.filter(
                value => value === ""
            ).length;

        if (
            playerCount === 2 &&
            emptyCount === 1
        ) {

            if (board[a] === "")
                return a;

            if (board[b] === "")
                return b;

            if (board[c] === "")
                return c;
        }
    }

    return -1;
}

document.addEventListener(
    "keydown",
    event => {

        const key = event.key;

        if (
            key < "1" ||
            key > "9" ||
            !playerTurn ||
            gameOver
        ) {
            return;
        }

        const index = Number(key) - 1;

        if (board[index] === "") {

            makeMove(index, "X");

            if (!gameOver) {

                playerTurn = false;

                statusText.innerHTML =
                    'CPU thinking... <span>O</span>';

                setTimeout(
                    cpuMove,
                    500
                );
            }
        }

    }
);