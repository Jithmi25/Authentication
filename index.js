import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
import userRouter from './Routes/userRouter.js';

const app = express();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ Connection error:", err));

const db = mongoose.connection; 
  
  db.on("error", (err) => {
    console.error("Connection error:", err);
  });
  
  db.once("open", () => {
    console.log("Database connected.");
  });
 
app.use(bodyParser.json())
app.use(express.json());

app.use("/api/user", userRouter);

app.listen(5000, () => {
    console.log("Server is running on port 5000");
});
