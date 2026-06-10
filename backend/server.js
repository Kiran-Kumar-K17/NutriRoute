import app from "./app.js";
import connectDB from "./config/db.js";
import { createServer } from "http";
import { Server } from "socket.io";
import { initializeSocket } from "./utils/socket.js";

const PORT = 8000;
const server = createServer(app);
const io = initializeSocket(server);

io.on("connection", (socket) => {
  console.log("Connected:", socket.id);

  socket.on("join-order-room", (orderId) => {
    socket.join(orderId);
    console.log(`Joined room ${orderId}`);
  });

  socket.on("location-update", (data) => {
    const { orderId, latitude, longitude } = data;

    io.to(orderId).emit("driver-location", {
      latitude,
      longitude,
    });
  });

  socket.on("disconnect", () => {
    console.log("Disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server is Running one Port: ${PORT}`);
  connectDB();
});
