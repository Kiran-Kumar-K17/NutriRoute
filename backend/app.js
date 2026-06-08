import express from "express";
import userRoutes from "./routes/user.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import restaurantRoutes from "./routes/restaurant.route.js";
import orderRoutes from "./routes/order.routes.js";
import foodRoutes from "./routes/food.routes.js";

const app = express();
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Backend Working..");
});

app.use("/api/users", userRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/foods", foodRoutes);
export default app;
