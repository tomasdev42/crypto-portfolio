import dotenv from "dotenv";
import { createServer } from "node:http";
import { Server as SocketIOServer } from "socket.io";
import express, { Express } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import passport from "passport";
import mongoose from "mongoose";
import authRouter from "./routes/auth";
import portfolioRouter from "./routes/portfolio";
import dataRouter from "./routes/data";
import uploadRouter from "./routes/upload";
import { setupCronJob } from "./utils/portfolioUpdater";
import path from "path";

dotenv.config();

const ORIGIN_URL = process.env.ORIGIN_URL || "http://localhost:5173";

// express app & http server
const app: Express = express();
const server = createServer(app);

// socket.io w/ http server
const io = new SocketIOServer(server, {
  cors: {
    origin: [ORIGIN_URL],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// db connection
mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

// middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [ORIGIN_URL],
    credentials: true, // allow cookies & auth headers with CORS
  })
);
app.use(passport.initialize());

// routes
app.use("/auth", authRouter);
app.use("/portfolio", portfolioRouter);
app.use("/data", dataRouter);
app.use("/upload", uploadRouter);
app.use(
  "/images",
  express.static(path.join(__dirname, "..", "uploads", "images"))
);

// socket.io
app.set("socketio", io);

// start server
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  setupCronJob();

  console.log(`Express listening on port: ${PORT}`);
});

// extend Express request type to include io
declare global {
  namespace Express {
    interface Application {
      get(name: "socketio"): SocketIOServer;
      set(name: "socketio", value: SocketIOServer): void;
    }
  }
}
