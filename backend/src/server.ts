import http from "http";
import app from "./app.js";
import { initSocket } from "./config/socket.js";

const PORT = 8000;

const server = http.createServer(app);
initSocket(server);

server.listen(PORT, () => {
  console.log(`Server is Running on Port: ${PORT}`);
});
