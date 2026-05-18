import express from "express";
import { getAllBooks, getMyBooks, purchaseBook } from "./books.controller.js";
const router = express.Router();
router.get("/", getAllBooks);
router.get("/me", getMyBooks);
router.post("/purchase/:id", purchaseBook);

export default router;
