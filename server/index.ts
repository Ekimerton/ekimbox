import express, { Express, Request, Response } from "express";
import http from "http";
import socketIo, { Server as IOServer, Socket } from "socket.io";
import cors from "cors";
import { createGame } from "./game";

const app: Express = express();
app.use(cors());
app.use(express.json()); // for parsing application/json

const server: http.Server = http.createServer(app);
const io: IOServer = new socketIo.Server(server, {
  cors: {
    origin: ["http://localhost:3001", "https://ekimbox.vercel.app"],
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World");
});

// Map to store all active games
const games: Record<string, ReturnType<typeof createGame>> = {};

// Handle game creation
app.post("/createGame", (req: Request, res: Response) => {
  const gameId = generateGameId();
  const gameNamespace = io.of(`/game/${gameId}`);
  games[gameId] = createGame(gameNamespace, gameId, () => {
    deleteGame(gameId);
  });
  res.json({ gameId });
  console.log(`Created game ${gameId}`);

  // Schedule the game for removal an hour from now
  setTimeout(() => {
    deleteGame(gameId);
  }, 60 * 60 * 1000); // 60 minutes * 60 seconds/minute * 1000 milliseconds/second
});

// Function to generate a unique game ID
function generateGameId(): string {
  let id = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789";
  for (let i = 0; i < 4; i++) {
    id += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return id;
}

function deleteGame(gameId: string) {
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
