import { Socket, Namespace } from "socket.io";
import {
  generatePlayerPairs,
  getQuestions,
  flattenPlayerAnswers,
  generateAnswerPairs,
  shuffle,
} from "./utils";

const MAX_ROUNDS = 2;
const MIN_PLAYERS = 2;
const MAX_PLAYERS = 8;
const QUESTIONS_PER_PLAYER = 2;
const ANSWER_TIME = 60 * 1000;
const VOTE_TIME = 15 * 1000;
const SCORE_TIME = 10 * 1000;
const BUFFER_TIME = 3 * 1000;

export interface Player {
  id: string;
  name: string;
  score: number;
}

interface GameState {
  round: number;
  stage: "register" | "answer" | "vote" | "score" | "end";
  subStage: number;
  players: Player[];
  vipID?: string;
  timeEnd?: number;
  submittedVotes?: Record<string, string>;
  questions: {
    prompt: string;
    answers: Array<{ player: Player; answer: string; votes: Player[] }>;
  }[];
}

interface AnswerPrompt {
  playerId: string;
  prompts: string[];
  answers: string[];
}

interface VotePrompt {
  question: string;
  answers: { author: string; answer: string }[];
}

export function createGame(
  namespace: Namespace,
  gameId: string,
  onGameEnd: () => void
) {
  let gameState: GameState = {
    round: 0,
    stage: "register",
    subStage: 0,
    players: [],
    questions: [],
  };

  let answerTimer: NodeJS.Timeout | null = null;

  namespace.on("connection", (socket: Socket) => {
    namespace.emit("gameState", { ...gameState });

    socket.on("register", ({ id, name }) => {
      if (!gameState.players) {
        gameState.players = [];
      }

      const existingPlayer = gameState.players.find(
        (player) => player.id === id
      );
      if (existingPlayer) {
        existingPlayer.name = name;
      } else {
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
        socket.emit(
          "error",
          "Game has already started or is not in registration phase."
        );
        return;
      }

      if (gameState.players.length < MIN_PLAYERS) {
        socket.emit(
          "error",
          `At least ${MIN_PLAYERS} players are needed to start the game.`
        );
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
      const question = gameState.questions?.find(q => q.prompt === answerData.prompt);
      if (question) {
        const playerAnswer = question.answers.find(a => a.player.id === answerData.clientId);
        if (playerAnswer) {
          playerAnswer.answer = answerData.answer;
        }
      }
      namespace.emit("gameState", gameState);
    });

    socket.on("vote", (voteData) => {
      const { userId, vote } = voteData;
    
      // Find the player who made the vote.
      const votingPlayer = gameState.players.find((player) => player.id === userId);
      
      if (!votingPlayer) {
        console.error("Voting player not found!");
        return;
      }
    
      // Find the question being voted on.
      const question = gameState.questions[gameState.subStage];
      if (!question) {
        console.error("Question for voting not found!");
        return;
      }
    
      // Check if this player has already voted for another answer in this question.
      // If so, remove their previous vote.
      question.answers.forEach((answer) => {
        const index = answer.votes.findIndex((player) => player.id === userId);
        if (index !== -1) {
          answer.votes.splice(index, 1);
        }
      });
    
      // Find the answer being voted on and add the vote.
      const votedAnswer = question.answers.find((answer) => answer.answer === vote);
      if (!votedAnswer) {
        console.error("Voted answer not found!");
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
        gameState.subStage++;
        if (gameState.subStage >= gameState.questions.length) {
          startScorePhase();
        } else {
          gameState.timeEnd = Date.now() + VOTE_TIME;
          namespace.emit("gameState", gameState);
          answerTimer = global.setTimeout(
            progressGame,
            VOTE_TIME + BUFFER_TIME
          );
        }
        break;
      case "score":
        gameState.round++;
        if (gameState.round <= MAX_ROUNDS) {
          startAnswerPhase();
        } else {
          endGame();
        }
        break;
    }
  }

  function startAnswerPhase() {
    gameState.stage = "answer";

    const totalPromptsNeeded =
      gameState.players.length * (QUESTIONS_PER_PLAYER / 2); // 2 players per question
    const allPrompts = getQuestions(totalPromptsNeeded);

    gameState.questions = [];

    for (let i = 0; i < totalPromptsNeeded; i++) {
      const player1Id = gameState.players[i % gameState.players.length].id;
      const player2Id =
        gameState.players[(i + 1) % gameState.players.length].id; // Wrap around to the start if needed

        gameState.questions.push({
          prompt: allPrompts[i],
          answers: [
            { player: gameState.players.find(p => p.id === player1Id)!, answer: "Blank Answer", votes: [] },
            { player: gameState.players.find(p => p.id === player2Id)!, answer: "Blank Answer", votes: [] }
          ]
        });              
    }

    gameState.timeEnd = Date.now() + ANSWER_TIME;
    namespace.emit("gameState", { ...gameState });
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
    // Call onGameEnd() after 5 seconds
    global.setTimeout(onGameEnd, 5000);
  }

  return {};
}
