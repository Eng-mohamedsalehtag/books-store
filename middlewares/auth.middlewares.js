import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
export const authMiddleware = (req, res, next) => {
  const { authorization } = req.headers;
  try {
    if (!authorization || typeof authorization !== "string") {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (!authorization.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const token = authorization.split(" ").at(-1);
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodedToken;
    next();
  } catch (error) {
    next(error);
  }
};
