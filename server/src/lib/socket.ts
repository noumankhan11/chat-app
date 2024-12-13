import { Server } from "socket.io";
import { createServer } from "http";
import express from "express";

const app = express();
const server = createServer(app);

// io config
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

export function getReceiverSocketId(userId: string) {
  return userSocketMap[userId];
}

// store online users
const userSocketMap: Record<string, string> = {};
//  handle socket.io connection
io.on("connection", (socket) => {
  console.log("A user connected", socket.id);
  const userId = socket.handshake.query.userId as string | undefined;
  if (userId) userSocketMap[userId] = socket.id;

  // io.emit() - send events to all the connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
    userId && delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };
