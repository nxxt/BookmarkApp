import Express, { Request, Response, NextFunction } from "express";
import IController from "../../types/IController";
import ITag from "../../types/ITag";
import TagModel from "../models/Tag";
import NotFoundException from "../exceptions/NotFoundException";

export default class TagsController implements IController {
  public path = "/tags";
  public router = Express.Router();

  private Model = TagModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes = () => {
    this.router.route(`${this.path}/lists/:userId`).get(this.getAllTags);
    this.router.route(`${this.path}/check_name`).post(this.checkName);
    this.router.route(`${this.path}/:_id`).get(this.getTagById);
    this.router.route(`${this.path}/:_id`).patch(this.modifyTag);
    this.router.route(`${this.path}/:_id`).delete(this.deleteTag);
    this.router.route(this.path).post(this.createTag);
  };

  private getTagById = async (
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
        next(new NotFoundException("Tag", _id));
      }
    } catch (err) {
      next(err);
    }
  };

  private getAllTags = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const userId = request.params.userId;
      const items = await this.Model.find({ createdBy: userId }).sort({
        name: 1,
      });
      response.send(items);
    } catch (err) {
      next(err);
    }
  };

  private modifyTag = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const _id = request.params._id;
    const itemData: ITag = Object.assign({}, request.body, {
      updatedAt: new Date().toISOString(),
    });

    try {
      const item = await this.Model.findByIdAndUpdate(_id, itemData, {
        new: true,
      });

      if (item) {
        response.send(item);
      } else {
        next(new NotFoundException("Tag", _id));
      }
    } catch (err) {
      next(err);
    }
  };

  private createTag = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const itemData: ITag = Object.assign({}, request.body, {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    const createdTag = new this.Model(itemData);
    try {
      const item = await createdTag.save();
      response.send(item);
    } catch (err) {
      next(err);
    }
  };

  private deleteTag = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const _id = request.params._id;
    try {
      const successResponse = await this.Model.findByIdAndDelete(_id);
      if (successResponse) {
        response.send(`Deleting tag (_id:${_id}) is success`);
      } else {
        next(new NotFoundException("Tag", _id));
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
