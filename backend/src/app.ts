import express from "express";
import authRoutes from "./routes/auth.routes.js";
import cors from "cors";
import restaurantRoutes from "./routes/restaurant.routes.js";
import foodRoutes from "./routes/food.routes.js";
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
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/foods", foodRoutes);
export default app;
