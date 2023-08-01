"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGame = exports.BUFFER_TIME = exports.SCORE_TIME = exports.VOTE_TIME = exports.ANSWER_TIME = exports.MAX_PLAYERS = exports.MIN_PLAYERS = exports.MAX_ROUNDS = void 0;
const utils_1 = require("./utils");
exports.MAX_ROUNDS = 3;
exports.MIN_PLAYERS = 4;
exports.MAX_PLAYERS = 10;
exports.ANSWER_TIME = 60 * 1000; // seconds
exports.VOTE_TIME = 30 * 1000; // seconds
exports.SCORE_TIME = 10 * 1000; // seconds
exports.BUFFER_TIME = 0 * 1000; // seconds
function createGame(namespace, gameId, onGameEnd) {
    let gameState = {
        round: 0,
        stage: "register",
        subStage: 0,
        prompt: "Waiting for host to start the game...",
        answers: {},
        comparisonPairs: [],
        players: [],
    };
    let answerTimer = null;
    namespace.on("connection", (socket) => {
        namespace.emit("gameState", Object.assign({}, gameState));
        // Handle player registration
        socket.on("register", (data) => {
            // Check if the name is already in use
            if (gameState.players.some((player) => player.name === data.name)) {
                // If the name is already in use, send an error message to the client
                socket.emit("error", "This name is already in use. Please choose a different name.");
                return;
            }
            let player = gameState.players.find((player) => player.id === data.id);
            if (player) {
                // If the player is already registered, update their name
                player.name = data.name;
            }
            else {
                // If the player is not already registered, add them to the players object
                player = { id: data.id, name: data.name, score: 0 };
                gameState.players.push(player);
                // If this is the first player to register, make them the VIP
                if (!gameState.vipID) {
                    gameState.vipID = player.id;
                }
            }
            namespace.emit("gameState", Object.assign({}, gameState)); // Emit to all sockets in the namespace
        });
        // Handle new answers
        socket.on("newAnswer", (data) => {
            // Check if the player has already submitted an answer
            let player = gameState.players.find((player) => player.id === data.userId);
            if (gameState.answers[data.userId]) {
                return;
            }
            // Add the answer to the gameState
            gameState.answers[data.userId] = data.answer;
            progressGame();
        });
        // Handle start game
        socket.on("startGame", (clientId) => {
            // Check if the player is the VIP
            if (clientId !== gameState.vipID) {
                socket.emit("error", "Only the VIP can start the game.");
                return;
            }
            // Start the game
            gameState.round = 1;
            gameState.stage = "answer";
            gameState.prompt = "What's the deal with airplane food?";
            gameState.timeEnd = Date.now() + exports.ANSWER_TIME; // 60 seconds from now
            namespace.emit("gameState", Object.assign({}, gameState));
            // Start a 60-second timer
            answerTimer = global.setTimeout(progressGame, exports.ANSWER_TIME);
        });
        socket.on("disconnect", () => {
            // Handle disconnection, e.g., by removing the player from the game state
            // ...
        });
        // Handle client ready
        socket.on("ready", () => {
            // Send the game state to the client
            socket.emit("gameState", Object.assign({}, gameState));
        });
    });
    function progressGame() {
        // If all players have submitted an answer or the timer has expired
        if (gameState.players.every((player) => gameState.answers[player.id]) ||
            (gameState.timeEnd && Date.now() > gameState.timeEnd)) {
            if (answerTimer) {
                global.clearTimeout(answerTimer);
                answerTimer = null;
            }
            // If it's the answer stage, advance to the vote stage
            if (gameState.stage === "answer") {
                // Check if any player has not submitted an answer and assign them 'Blank Answer'
                for (const player of gameState.players) {
                    if (!gameState.answers[player.id]) {
                        gameState.answers[player.id] = "Blank Answer";
                    }
                }
                gameState.stage = "vote";
                gameState.subStage = 0;
                gameState.comparisonPairs = utils_1.getComparisonPairs(gameState.answers);
                gameState.timeEnd = Date.now() + exports.VOTE_TIME;
                // Start a VOTE_TIME-second timer for the vote stage
                answerTimer = global.setTimeout(progressGame, exports.VOTE_TIME + exports.BUFFER_TIME);
            }
            // If it's the vote stage, advance to the next vote sub-stage or the display score stage
            else if (gameState.stage === "vote") {
                gameState.subStage++;
                // If all pairs have been voted on, advance to the display score stage
                if (gameState.subStage >= gameState.comparisonPairs.length) {
                    gameState.stage = "score";
                    gameState.timeEnd = Date.now() + exports.SCORE_TIME; // SCORE_TIME seconds from now for score
                    // Display the score for a certain amount of time before advancing to the next round
                    answerTimer = global.setTimeout(progressGame, exports.SCORE_TIME + exports.BUFFER_TIME);
                }
                // If not all pairs have been voted on, start a timer for the next vote sub-stage
                else {
                    gameState.timeEnd = Date.now() + exports.VOTE_TIME; // VOTE_TIME seconds from now for vote
                    answerTimer = global.setTimeout(progressGame, exports.VOTE_TIME + exports.BUFFER_TIME); // VOTE_TIME seconds
                }
            }
            // If it's the display score stage, advance to the next round or end the game
            else if (gameState.stage === "score") {
                gameState.round++;
                // If the maximum number of rounds has been reached, end the game
                if (gameState.round > exports.MAX_ROUNDS) {
                    gameState.timeEnd = undefined;
                    gameState.stage = "end";
                    gameState.prompt = "Game has ended. Thanks for playing!";
                    // Clear any existing timers
                    if (answerTimer) {
                        global.clearTimeout(answerTimer);
                        answerTimer = null;
                    }
                    // Emit the final game state
                    namespace.emit("gameState", gameState);
                    // Remove the game from the games object after a delay
                    setTimeout(() => {
                        onGameEnd();
                    }, 5000); // 5 seconds delay
                }
                // If the maximum number of rounds has not been reached, advance to the next answer stage
                else {
                    gameState.stage = "answer";
                    gameState.timeEnd = Date.now() + exports.ANSWER_TIME; // ANSWER_TIME seconds from now for answer
                    answerTimer = global.setTimeout(progressGame, exports.ANSWER_TIME + exports.BUFFER_TIME); // ANSWER_TIME seconds
                    gameState.answers = {};
                }
            }
            namespace.emit("gameState", gameState);
        }
    }
    return {
        addPlayer: (playerId) => {
            // Add the player to the game
        },
        // ... any other methods or properties you want to expose ...
    };
}
exports.createGame = createGame;
