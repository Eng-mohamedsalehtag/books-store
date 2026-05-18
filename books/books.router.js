import express from "express";
import {
  getAllBooks,
  getMyBooks,
  purchaseBook,
  createBook,
  updateBook,
  deleteBook,
} from "./books.controller.js";
import { roleMiddleware } from "../middlewares/role.middlewares.js";
import { authMiddleware } from "../middlewares/auth.middlewares.js";
const router = express.Router();
router.get("/", getAllBooks);
router.get("/me", authMiddleware, getMyBooks);
router.post("/purchase/:id", authMiddleware, purchaseBook);
router.post("/", authMiddleware, roleMiddleware("admin"), createBook);
router.patch("/:id", authMiddleware, roleMiddleware("admin"), updateBook);
router.delete("/:id", authMiddleware, roleMiddleware("admin"), deleteBook);

export default router;
