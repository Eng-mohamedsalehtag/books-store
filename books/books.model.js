import mongoose from "mongoose";
const bookSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 100,
  },
  price: {
    type: Number,
    required: true,
    minlength: 1,
    maxlength: 10,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});
const Book = mongoose.model("Book", bookSchema);
export default Book;
