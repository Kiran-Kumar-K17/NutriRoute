import { verifyToken } from "../utils/jwt.js";

export const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }
    const token = authHeader.split(" ")[1];
    const decode = verifyToken(token);

    req.user = decode;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid token",
    });
  }
};
