// utils/socket.js

import { Server, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import { User } from "../models/user.model.js";
import { Order } from "../models/order.model.js";

interface LocationUpdateData {
  orderId: string;
  latitude: number;
  longitude: number;
}

let io: Server;

export const initializeSocket = (server: HttpServer): Server => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:5173",
      credentials: true,
    },
  });

  io.on("connection", (socket: Socket) => {
    console.log("Connected:", socket.id);

    socket.on("join-order-room", (orderId: string) => {
      socket.join(orderId);
      console.log("JOINED ROOM:", orderId);
    });

    socket.on(
      "location-update",
      async (data: LocationUpdateData): Promise<void> => {
        try {
          console.log("LOCATION RECEIVED:", data);

          const { orderId, latitude, longitude } = data;

          const order = await Order.findById(orderId);

          if (!order) {
            console.log("ORDER NOT FOUND");
            return;
          }

          if (!order.deliveryPartnerId) {
            console.log("NO DELIVERY PARTNER");
            return;
          }

          const updatedUser = await User.findByIdAndUpdate(
            order.deliveryPartnerId,
            {
              currentLocation: {
                lat: latitude,
                lng: longitude,
                updatedAt: new Date(),
              },
            },
            { new: true },
          );
          if (!updatedUser) {
            return;
          }
          console.log("UPDATED USER LOCATION:", updatedUser.currentLocation);

          io.to(orderId).emit("driver-location", {
            latitude,
            longitude,
          });

          console.log("EMITTED TO ROOM:", orderId);
        } catch (error) {
          console.error(error);
        }
      },
    );

    socket.on("disconnect", () => {
      console.log("Disconnected:", socket.id);
    });
  });

  return io;
};

export const getIO = (): Server => {
  return io;
};
