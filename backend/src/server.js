import express from "express";
import cors from "cors";
import dotenv from "dotenv"

import notesRoutes from "./routes/notesRoutes.js";
import { connectDB } from "./config/db.js";
import RateLimiter from "./middleware/rateLimiter.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001
connectDB();

//midleware 
app.use(cors(
  {origin : "http://localhost:5173",}
));
app.use(express.json()); // this middleware is used to parse JSON request bodies 
// app.use((req, res, next) => {
//   console.log(`Req method is ${req.method} & Req URL is ${req.url}`);
//   next();
// });
app.use(RateLimiter)

//routes
app.use("/api/notes", notesRoutes);

app.listen(PORT, () => {
  console.log("The server has started:",PORT);
});
