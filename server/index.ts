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
    origin: ["http://localhost:3001", "http://192.168.1.139:3001"],
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

io.on("connection", (socket: Socket) => {
  socket.on("joinRoom", (gameId) => {
    if (games[gameId]) {
      socket.join(gameId);
    } else {
      console.log("Invalid room join.")
    }
  });
});

// Map to store all active games
const games: Record<string, ReturnType<typeof createGame>> = {};

// Handle game creation
app.post("/createGame", (req: Request, res: Response) => {
  const gameId = generateGameId();
  games[gameId] = createGame(io, gameId, () => {
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
  if (games[gameId]) {
  delete games[gameId];
  io.in(gameId).socketsLeave(gameId);
  }
  console.log(`Deleted game ${gameId}`);
}

server.listen(3000, () => console.log("Server listening on port 3000"));
