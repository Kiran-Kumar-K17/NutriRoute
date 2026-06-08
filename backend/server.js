import app from "./app.js";
import connectDB from "./config/db.js";

const PORT = 8000;

app.listen(PORT, () => {
  console.log(`Server is Running one Port: ${PORT}`);
  connectDB();
});
