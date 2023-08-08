"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGame = void 0;
const utils_1 = require("./utils");
const MAX_ROUNDS = 2;
const MIN_PLAYERS = 2;
const MAX_PLAYERS = 8;
const QUESTIONS_PER_PLAYER = 2;
const ANSWER_TIME = 60 * 1000;
const VOTE_TIME = 15 * 1000;
const SCORE_TIME = 10 * 1000;
const BUFFER_TIME = 3 * 1000;
function createGame(namespace, gameId, onGameEnd) {
    let gameState = {
        round: 0,
        stage: "register",
        subStage: 0,
        players: [],
        questions: [],
    };
    let answerTimer = null;
    namespace.on("connection", (socket) => {
        namespace.emit("gameState", Object.assign({}, gameState));
        socket.on("register", ({ id, name }) => {
            if (!gameState.players) {
                gameState.players = [];
            }
            const existingPlayer = gameState.players.find(player => player.id === id);
            if (existingPlayer) {
                existingPlayer.name = name;
            }
            else {
                const newPlayer = {
                    id: id,
                    name: name,
                    score: 0,
                };
                gameState.players.push(newPlayer);
                // Make the first player the VIP
                if (gameState.players.length === 1) {
                    gameState.vipID = id;
                }
            }
            namespace.emit("gameState", gameState); // Broadcast updated game state
        });
        socket.on("startGame", (clientId) => {
            if (gameState.stage !== "register") {
                socket.emit("error", "Game has already started or is not in registration phase.");
                return;
            }
            if (gameState.players.length < MIN_PLAYERS) {
                socket.emit("error", `At least ${MIN_PLAYERS} players are needed to start the game.`);
                return;
            }
            if (clientId !== gameState.vipID) {
                socket.emit("error", "Only the VIP can start the game.");
                return;
            }
            gameState.round = 1;
            startAnswerPhase();
        });
        socket.on("submitAnswer", (answerData) => {
            var _a;
            const question = (_a = gameState.questions) === null || _a === void 0 ? void 0 : _a.find(q => q.prompt === answerData.prompt);
            if (question) {
                const playerAnswer = question.answers.find(a => a.player === answerData.clientId);
                if (playerAnswer) {
                    playerAnswer.answer = answerData.answer;
                }
            }
            namespace.emit("gameState", gameState);
        });
        socket.on("vote", (voteData) => {
            // Implement your voting logic here
        });
        socket.on("disconnect", () => {
            // Handle player disconnect if needed
        });
    });
    function startAnswerPhase() {
        gameState.stage = "answer";
        const totalPromptsNeeded = gameState.players.length * (QUESTIONS_PER_PLAYER / 2); // 2 players per question
        const allPrompts = utils_1.getQuestions(totalPromptsNeeded);
        gameState.questions = [];
        for (let i = 0; i < totalPromptsNeeded; i++) {
            const player1Id = gameState.players[i % gameState.players.length].id;
            const player2Id = gameState.players[(i + 1) % gameState.players.length].id; // Wrap around to the start if needed
            gameState.questions.push({
                prompt: allPrompts[i],
                answers: [
                    { player: player1Id, answer: "Blank Answer" },
                    { player: player2Id, answer: "Blank Answer" }
                ]
            });
        }
        gameState.timeEnd = Date.now() + ANSWER_TIME;
        namespace.emit("gameState", Object.assign({}, gameState));
        answerTimer = global.setTimeout(progressGame, ANSWER_TIME + BUFFER_TIME);
    }
    function progressGame() {
        if (answerTimer) {
            global.clearTimeout(answerTimer);
            answerTimer = null;
        }
        switch (gameState.stage) {
            case "answer":
                startVotePhase();
                break;
            case "vote":
                gameState.subStage++;
                gameState.timeEnd = Date.now() + VOTE_TIME;
                answerTimer = global.setTimeout(progressGame, VOTE_TIME + BUFFER_TIME);
                if (gameState.subStage >= gameState.questions.length) {
                    startScorePhase();
                }
                break;
            case "score":
                gameState.round++;
                if (gameState.round <= MAX_ROUNDS) {
                    startAnswerPhase();
                }
                else {
                    endGame();
                }
                break;
        }
        namespace.emit("gameState", gameState);
    }
    function startVotePhase() {
        gameState.stage = "vote";
        gameState.subStage = 0; // Reset subStage for voting
        gameState.timeEnd = Date.now() + VOTE_TIME;
        answerTimer = global.setTimeout(progressGame, VOTE_TIME + BUFFER_TIME);
    }
    function startScorePhase() {
        gameState.stage = "score";
        gameState.timeEnd = Date.now() + SCORE_TIME;
        answerTimer = global.setTimeout(progressGame, SCORE_TIME + BUFFER_TIME);
    }
    function endGame() {
        gameState.stage = "end";
        onGameEnd();
    }
    return {};
}
exports.createGame = createGame;
