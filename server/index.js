"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = __importDefault(require("socket.io"));
const cors_1 = __importDefault(require("cors"));
const game_1 = require("./game");
const app = express_1.default();
app.use(cors_1.default());
app.use(express_1.default.json()); // for parsing application/json
const server = http_1.default.createServer(app);
const io = new socket_io_1.default.Server(server, {
    cors: {
        origin: ["http://localhost:3001", "https://ekimbox.vercel.app"],
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true,
    },
});
app.get("/", (req, res) => {
    res.send("Hello World");
});
// Map to store all active games
const games = {};
// Handle game creation
app.post("/createGame", (req, res) => {
    const gameId = generateGameId();
    const gameNamespace = io.of(`/game/${gameId}`);
    console.log("fuck");
    console.log(gameNamespace === io.of(`/game/${gameId}`));
    games[gameId] = game_1.createGame(gameNamespace, gameId, () => {
        deleteGame(gameId);
    });
    res.json({ gameId });
    console.log(Object.keys(io._nsps));
    console.log(`Created game ${gameId}`);
    // Schedule the game for removal an hour from now
    setTimeout(() => {
        deleteGame(gameId);
    }, 60 * 60 * 1000); // 60 minutes * 60 seconds/minute * 1000 milliseconds/second
});
// Function to generate a unique game ID
function generateGameId() {
    let id = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789";
    for (let i = 0; i < 4; i++) {
        id += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return id;
}
function deleteGame(gameId) {
    /*
    if (games[gameId]) {
      io.of(`/game/${gameId}`).local.disconnectSockets();
      io._nsps.delete(`/game/${gameId}`);
      delete games[gameId];
      console.log(`Deleted game ${gameId}`);
    }
    */
}
server.listen(3000, () => console.log("Server listening on port 3000"));
