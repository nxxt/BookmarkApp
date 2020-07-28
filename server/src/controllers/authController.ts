import Express, { Request, Response, NextFunction } from "express";
import IController from "../../types/IController";
import IUser from "../../types/IUser";
import UserModel from "../models/User";
import NotFoundException from "../exceptions/NotFoundException";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const saltRounds = 10;

export default class AuthController implements IController {
  public path = "/auth";
  public router = Express.Router();

  private Model = UserModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes = () => {
    this.router.route(`${this.path}/register`).post(this.register);
    this.router.route(`${this.path}/login`).post(this.login);
    this.router.route(`${this.path}/user`).get(this.getUser);
    this.router.route(`${this.path}/logout`).delete(this.logout);
  };

  private register = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const { firstName, lastName, email, password, role } = request.body;
    try {
      // passwordをhash化してDBへ登録する。
      const hash = await bcrypt.hash(password, saltRounds);
      const user = await this.Model.create({
        firstName,
        lastName,
        email,
        password: hash,
        role,
      });
      response.send(user);
    } catch (err) {
      next(err);
    }
  };

  login = async (request: Request, response: Response, next: NextFunction) => {
    const { email, password } = request.body;
    try {
      const user = await this.Model.findOne({ email });
      if (!user) {
        throw new NotFoundException("user", email);
      } else {
        // hash化されていない password と hash化された passowrd をチェック
        const result = bcrypt.compareSync(password, user.password);
        if (!result) {
          throw new Error("invalid password");
        } else {
          const { id, email, role, firstName, lastName } = user;
          // リクエスト毎にTokenの値が変わる;
          const token = jwt.sign(
            { id, email, role, firstName, lastName },
            "secret"
          );
          response.send(token);
        }
      }
    } catch (err) {
      next(err);
    }
  };

  getUser = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const auth = request.headers["authorization"]; // bearer XXXX
      const bearer = auth && auth.includes("Bearer ") ? auth.split(" ") : null;
      if (bearer && bearer.length > 1) {
        const token = bearer[1];
        const user = jwt.verify(token, "secret");
        response.send(user);
      } else {
        throw new Error("There is not token.");
      }
    } catch (err) {
      next(err);
    }
  };

  logout = (request: Request, response: Response, next: NextFunction) => {
    response.send({ message: "logout is success" });
  };
}
