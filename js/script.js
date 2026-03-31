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
let mode = "";
let difficulty = "normal";

function showScreen(id) {
    document.querySelectorAll('.container').forEach(c => c.classList.add('hidden'));
    document.getElementById(id).classList.remove('hidden');
}

function initGame(m, diff = 'normal') {
    mode = m;
    difficulty = diff;
    resetGame();
    showScreen('game-play');
}

function startOnline() {
    mode = "online";
    resetGame();
    showScreen('game-play');
    db.on("value", (snap) => {
        const data = snap.val();
        if (data) {
            board = data.board;
            currentPlayer = data.turn;
            updateUI();
        }
    });
}

function cellClicked(index) {
    if (board[index] !== "" || !gameActive) return;

    board[index] = currentPlayer;
    updateUI();

    if (checkWinner()) {
        document.getElementById('status-text').innerText = "Winner: " + currentPlayer;
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";
    document.getElementById('status-text').innerText = "Turn: " + currentPlayer;

    if (mode === "ai" && currentPlayer === "O" && gameActive) {
        setTimeout(computerMove, 500);
    } else if (mode === "online") {
        db.set({ board: board, turn: currentPlayer });
    }
}

function updateUI() {
    const cells = document.querySelectorAll('.cell');
    board.forEach((val, i) => {
        cells[i].innerText = val;
    });
}

function computerMove() {
    let available = board.map((v, i) => v === "" ? i : null).filter(v => v !== null);
    let move = available[Math.floor(Math.random() * available.length)];
    if (move !== undefined) cellClicked(move);
}

function checkWinner() {
    const wins = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    return wins.some(p => board[p[0]] && board[p[0]] === board[p[1]] && board[p[0]] === board[p[2]]);
}

function resetGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    gameActive = true;
    document.getElementById('status-text').innerText = "Turn: X";
    updateUI();
    if(mode === "online") db.set({board, turn: "X"});
}
