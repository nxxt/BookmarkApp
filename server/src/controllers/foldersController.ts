import Express, { Request, Response, NextFunction } from "express";
import IController from "../../types/IController";
import IFolder from "../../types/IFolder";
import FolderModel from "../models/Folder";
import NotFoundException from "../exceptions/NotFoundException";

export default class FoldersController implements IController {
  public path = "/folders";
  public router = Express.Router();

  private Model = FolderModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes = () => {
    this.router.route(`${this.path}/lists/:userId`).get(this.getAllFolders);
    this.router.route(`${this.path}/check_name`).post(this.checkName);
    this.router.route(`${this.path}/:_id`).get(this.getFolderById);
    this.router.route(`${this.path}/:_id`).patch(this.modifyFolder);
    this.router.route(`${this.path}/:_id`).delete(this.deleteFolder);
    this.router.route(this.path).post(this.createFolder);
  };

  private getFolderById = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const _id = request.params._id;
    try {
      const item = await this.Model.findById(_id);
      if (item) {
        response.send(item);
      } else {
        next(new NotFoundException("Folder", _id));
      }
    } catch (err) {
      next(err);
    }
  };

  private getAllFolders = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const userId = request.params.userId;
      const items = await this.Model.find({ createdBy: userId }).sort({
        createdAt: -1,
      });
      response.send(items);
    } catch (err) {
      next(err);
    }
  };

  private modifyFolder = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const _id = request.params._id;
    const itemData: IFolder = Object.assign({}, request.body, {
      updatedAt: new Date().toISOString(),
    });

    try {
      const item = await this.Model.findByIdAndUpdate(_id, itemData, {
        new: true,
      });

      if (item) {
        response.send(item);
      } else {
        next(new NotFoundException("Folder", _id));
      }
    } catch (err) {
      next(err);
    }
  };

  private createFolder = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const itemData: IFolder = Object.assign({}, request.body, {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    const createdFolder = new this.Model(itemData);
    try {
      const item = await createdFolder.save();
      response.send(item);
    } catch (err) {
      next(err);
    }
  };

  private deleteFolder = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const _id = request.params._id;
    try {
      const successResponse = await this.Model.findByIdAndDelete(_id);
      if (successResponse) {
        response.send(`Deleting folder (_id:${_id}) is success`);
      } else {
        next(new NotFoundException("Folder", _id));
      }
    } catch (err) {
      next(err);
    }
  };

  private checkName = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { _id, name } = req.body;
    try {
      const item = await this.Model.findOne({ createdBy: _id, name });
      const isName = item ? true : false;
      res.send(isName);
    } catch (err) {
      next(err);
    }
  };
}
