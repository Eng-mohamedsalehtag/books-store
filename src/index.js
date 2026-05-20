import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import user from "../users/users.router.js";
import book from "../books/books.router.js";
import { authMiddleware } from "../middlewares/auth.middlewares.js";
dotenv.config();
const app = express();
const PORT = process.env.PORT_NUMBER || 5000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//user routes
app.use("/users", user);

//books routes
// app.use(authMiddleware);
app.use("/books", book);

app.use((error, req, res, next) => {
  if (error.code === 11000) {
    return res.status(400).json({ message: "Email already exists" });
  }
  if (error.name === "CastError") {
    return res.status(400).json({ message: "Invalid ID" });
  }
  console.error(error);
  res.status(500).json({ message: "Internal Server Error" });
});
try {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Database connected");
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
} catch (error) {
  console.error(error);
  process.exit();
}
