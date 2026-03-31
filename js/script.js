const firebaseConfig = {
    apiKey: "AIzaSyACOaNcjw96eamzv0Ja7vMvpETleysfcqQ",
    authDomain: "multiplayer-bingo-e27fd.firebaseapp.com",
    databaseURL: "https://multiplayer-bingo-e27fd-default-rtdb.firebaseio.com",
    projectId: "multiplayer-bingo-e27fd",
    storageBucket: "multiplayer-bingo-e27fd.firebasestorage.app",
    messagingSenderId: "768320492362",
    appId: "1:768320492362:web:25382f8c9aee76cf4167b3"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database().ref("tictactoe/global");

let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = true;
let gameMode = "";
let aiLevel = "normal";

function showScreen(id) {
    document.querySelectorAll('.container').forEach(c => c.classList.add('hidden'));
    document.getElementById(id).classList.remove('hidden');
}

function initAI(level) {
    aiLevel = level;
    gameMode = "ai";
    startGame();
}

function initLocal() {
    gameMode = "local";
    startGame();
}

function startOnline() {
    gameMode = "online";
    startGame();
    db.on("value", (snap) => {
        const data = snap.val();
        if (data) {
            board = data.board;
            currentPlayer = data.turn;
            renderBoard();
        }
    });
}

function startGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    gameActive = true;
    showScreen('game-play');
    renderBoard();
}

function cellClicked(index) {
    if (board[index] !== "" || !gameActive) return;

    board[index] = currentPlayer;
    renderBoard();

    if (checkWinner()) {
        document.getElementById('status-text').innerText = "Player " + currentPlayer + " Wins!";
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";
    document.getElementById('status-text').innerText = "Player " + currentPlayer + "'s Turn";

    if (gameMode === "ai" && currentPlayer === "O") {
        setTimeout(aiMove, 500);
    } else if (gameMode === "online") {
        db.set({ board: board, turn: currentPlayer });
    }
}

function renderBoard() {
    const cells = document.querySelectorAll('.cell');
    board.forEach((val, i) => {
        cells[i].innerText = val;
    });
}

function checkWinner() {
    const wins = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    return wins.some(p => board[p[0]] && board[p[0]] === board[p[1]] && board[p[0]] === board[p[2]]);
}

function aiMove() {
    let move = board.map((v, i) => v === "" ? i : null).filter(v => v !== null);
    let randomMove = move[Math.floor(Math.random() * move.length)];
    if (randomMove !== undefined) cellClicked(randomMove);
}

function resetGame() { startGame(); }
