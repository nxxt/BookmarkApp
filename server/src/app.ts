import Express from "express";
import cors from "cors";
import logger from "morgan";
import mongoose from "mongoose";
import IController from "../types/IController";
import errorMiddleware from "./middleware/error";

export default class App {
  public app: Express.Application;
  private port: number;
  private host: string;
  private env: string;

  constructor(controllers: IController[]) {
    this.app = Express();
    this.port = Number(process.env.PORT) || 5000;
    this.host = process.env.HOST || "localhost";
    this.env = process.env.NODE_ENV || "development";

    this.connectToTheDatabase();
    this.setApiParams();
    this.initializeMiddlewares();
    this.initializeControllers(controllers);
    this.initializeErrorHandling();
  }

  public listen() {
    this.app.listen(this.port, this.host, () => {
      const root = `http://${this.host}:${this.app.get("port")}`;
      const env = `${this.app.get("env")}`;
      console.log(`Running on ${root} | Environment : ${env}`);
    });
  }

  private connectToTheDatabase() {
    const { DBURL, DBNAME } = process.env;

    mongoose.connect(`${DBURL}/${DBNAME}`, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
    const db = mongoose.connection;
    db.once("open", () =>
      console.log("Successfully connected to MongoDB using Mongoose!")
    );
  }

  private setApiParams() {
    this.app.set("port", this.port);
    this.app.set("env", this.env);
  }

  private initializeMiddlewares(): void {
    this.app.use(cors()); // CORSの許可
    this.app.use(logger("tiny"));

    this.app.use("/static", Express.static("shots"));

    // body-parserに基づいた着信リクエストの解析
    this.app.use(Express.json());
    this.app.use(Express.urlencoded({ extended: false }));
  }

  private initializeControllers(controllers: IController[]) {
    controllers.forEach((controller: IController) => {
      this.app.use("/api/v1", controller.router);
    });
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }
}
