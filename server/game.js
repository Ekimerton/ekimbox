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
            const existingPlayer = gameState.players.find((player) => player.id === id);
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
        socket.on("answer", (answerData) => {
            var _a;
            const question = (_a = gameState.questions) === null || _a === void 0 ? void 0 : _a.find((q) => q.prompt === answerData.prompt);
            if (question) {
                const playerAnswer = question.answers.find((a) => a.player.id === answerData.clientId);
                if (playerAnswer) {
                    playerAnswer.answer = answerData.answer;
                }
            }
            namespace.emit("gameState", gameState);
        });
        socket.on("vote", (voteData) => {
            const { clientId, questionPrompt, votedForID } = voteData;
            // Find the player who made the vote.
            const votingPlayer = gameState.players.find((player) => player.id === clientId);
            if (!votingPlayer) {
                console.log(gameState.players);
                console.log(clientId);
                console.error("Voting player not found!");
                return;
            }
            // Find the question being voted on.
            const question = gameState.questions.find((q) => q.prompt === questionPrompt);
            if (!question) {
                console.error("Question for voting not found!");
                return;
            }
            // Check if this player has already voted for another answer in this question.
            // If so, remove their previous vote.
            question.answers.forEach((answer) => {
                const index = answer.votes.findIndex((player) => player.id === clientId);
                if (index !== -1) {
                    answer.votes.splice(index, 1);
                }
            });
            // Find the answer being voted on and add the vote.
            const votedAnswer = question.answers.find((answer) => answer.player.id === votedForID);
            if (!votedAnswer) {
                console.error("Voted player's ID not found!");
                return;
            }
            votedAnswer.votes.push(votingPlayer);
            // Broadcast the updated gameState to all clients.
            namespace.emit("gameState", gameState);
        });
        socket.on("vote", (voteData) => {
            // Implement your voting logic here
        });
        socket.on("disconnect", () => {
            // Handle player disconnect if needed
        });
    });
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
                // After each voting sub-round, compute the score for the last question
                computeScoreForQuestion(gameState.subStage);
                gameState.subStage++;
                if (gameState.subStage >= gameState.questions.length) {
                    startScorePhase();
                }
                else {
                    gameState.timeEnd = Date.now() + VOTE_TIME;
                    namespace.emit("gameState", gameState);
                    answerTimer = global.setTimeout(progressGame, VOTE_TIME + BUFFER_TIME);
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
    }
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
                    {
                        player: gameState.players.find((p) => p.id === player1Id),
                        answer: "Blank Answer",
                        votes: [],
                    },
                    {
                        player: gameState.players.find((p) => p.id === player2Id),
                        answer: "Blank Answer",
                        votes: [],
                    },
                ],
            });
        }
        gameState.timeEnd = Date.now() + ANSWER_TIME;
        namespace.emit("gameState", Object.assign({}, gameState));
        answerTimer = global.setTimeout(progressGame, ANSWER_TIME + BUFFER_TIME);
    }
    function startVotePhase() {
        gameState.stage = "vote";
        gameState.subStage = 0; // Reset subStage for voting
        gameState.timeEnd = Date.now() + VOTE_TIME;
        namespace.emit("gameState", gameState);
        answerTimer = global.setTimeout(progressGame, VOTE_TIME + BUFFER_TIME);
    }
    function startScorePhase() {
        gameState.stage = "score";
        gameState.timeEnd = Date.now() + SCORE_TIME;
        namespace.emit("gameState", gameState);
        answerTimer = global.setTimeout(progressGame, SCORE_TIME + BUFFER_TIME);
    }
    function endGame() {
        gameState.stage = "end";
        namespace.emit("gameState", gameState);
        // Call onGameEnd() after 30 seconds
        global.setTimeout(onGameEnd, 30000);
    }
    function computeScoreForQuestion(questionNumber) {
        const currentQuestion = gameState.questions[questionNumber];
        if (currentQuestion) {
            currentQuestion.answers.forEach((answer) => {
                // Add 100 points for each vote
                answer.player.score += answer.votes.length * 100;
            });
            // Check for a sweep
            if (currentQuestion.answers[0].votes.length > 0 &&
                currentQuestion.answers[1].votes.length === 0) {
                currentQuestion.answers[0].player.score += 300; // Add 300 points for a sweep
            }
            else if (currentQuestion.answers[1].votes.length > 0 &&
                currentQuestion.answers[0].votes.length === 0) {
                currentQuestion.answers[1].player.score += 300; // Add 300 points for a sweep
            }
        }
    }
    return {};
}
exports.createGame = createGame;
