import Book from "./books.model.js";
export const getAllBooks = async (req, res, next) => {
  try {
    const books = await Book.find({ owner: { $exists: false } }).select(
      "-_id -__v",
    );

    res.status(200).json({
      message: "get all books",
      status: 200,
      data: books,
    });
  } catch (error) {
    next(error);
  }
};
export const getMyBooks = async (req, res, next) => {
  const { _id } = req.user;
  try {
    const books = await Book.find({ owner: _id }).select("-_id -__v");
    res.status(200).json({
      message: "get my books",
      status: 200,
      data: books,
    });
  } catch (error) {
    next(error);
  }
};
export const purchaseBook = async (req, res, next) => {
  const bookId = req.params.id;
  try {
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    if (book.owner) {
      return res.status(400).json({ message: "Book already purchased" });
    }
    book.owner = req.user._id;
    console.log(book);
    await book.save();
    console.log("saved", book);
    res.status(200).json({
      message: "Book purchased successfully",
      status: 200,
    });
  } catch (error) {
    next(error);
  }
};
