import express from "express";
import userRoutes from "./routes/user.routes.js";

const app = express();
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Backend Working..");
});

app.use("/api/user", userRoutes);

export default app;
