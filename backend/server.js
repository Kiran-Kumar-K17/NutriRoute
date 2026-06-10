import app from "./app.js";
import connectDB from "./config/db.js";
import { createServer } from "http";
import { Server } from "socket.io";
import { initializeSocket } from "./utils/socket.js";

const PORT = 8000;
const server = createServer(app);
const io = initializeSocket(server);

server.listen(PORT, () => {
  console.log(`Server is Running one Port: ${PORT}`);
  connectDB();
});
