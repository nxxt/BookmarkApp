import Express from "express";
import getToken from "./token";
import counter from "./counter";
import errors from "./errors";

export default {
  token: (req: Express.Request, next: Express.NextFunction) => {
    const token = getToken(req);
    if (!token) {
      next(errors.err401());
      return null;
    }
    return token;
  },
  isId: (id: number | string, next: Express.NextFunction) => {
    if (!id) {
      next(errors.err400());
      return false;
    }
    return true;
  },
  counter,
  ...errors,
};
