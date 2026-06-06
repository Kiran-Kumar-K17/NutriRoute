import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/DB.js";
dotenv.config();
const PORT = 8000;


app.listen(PORT, () => {
  console.log(`Server is Running one Port: ${PORT}`);
  connectDB();
});
