import { JwtPayload } from "../utils/jwt.ts";
import "multer";
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
      file?: Express.Multer.File;
    }
  }
}
export {};
