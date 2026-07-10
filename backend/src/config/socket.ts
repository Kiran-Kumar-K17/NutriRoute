import { Server as SocketIOServer, Socket } from "socket.io";
import { Server as HTTPServer } from "http";

export let io: SocketIOServer;

export const initSocket = (server: HTTPServer) => {
  io = new SocketIOServer(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket: Socket) => {
    console.log(`Client connected: ${socket.id}`);

    // Join order room
    socket.on("join-order", (orderId: string) => {
      socket.join(`order:${orderId}`);
      console.log(`Socket ${socket.id} joined room order:${orderId}`);
    });

    // Leave order room
    socket.on("leave-order", (orderId: string) => {
      socket.leave(`order:${orderId}`);
      console.log(`Socket ${socket.id} left room order:${orderId}`);
    });

    // Update location from rider
    socket.on(
      "update-location",
      (data: { orderId: string; latitude: number; longitude: number }) => {
        const { orderId, latitude, longitude } = data;
        console.log(
          `Location update for order ${orderId}: Lat ${latitude}, Lng ${longitude}`,
        );

        // Emit to all users in the room (including the customer)
        io.to(`order:${orderId}`).emit("location-updated", {
          latitude,
          longitude,
        });
      },
    );

    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });

  return io;
};
