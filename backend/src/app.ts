import express from "express";
import authRoutes from "./routes/auth.routes.js";
import cors from "cors";
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);
app.get("/", (req, res) => {
  res.send("Backend Working..");
});

app.use("/api/auth", authRoutes);

export default app;
