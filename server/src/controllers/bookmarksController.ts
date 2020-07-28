import Express, { Request, Response, NextFunction } from "express";
import axios from "axios";
import cheerio from "cheerio";
import * as fs from "fs";
const webshot = require("node-webshot");

import IController from "../../types/IController";
import IBookmark from "../../types/IBookmark";
import ISortType from "../../types/ISortType";
import ITag from "@@/types/ITag";
import BookmarkModel from "../models/Bookmark";
import NotFoundException from "../exceptions/NotFoundException";

export default class BookmarksController implements IController {
  public path = "/bookmarks";
  public router = Express.Router();

  private Model = BookmarkModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes = () => {
    this.router.route(`${this.path}/all/:userId`).get(this.getAllBookmarks);
    this.router
      .route(`${this.path}/unfoldered/:userId`)
      .get(this.getUnfolderedBookmarks);
    this.router
      .route(`${this.path}/list/:userId`)
      .post(this.getDisplayBookmarks);

    this.router.route(`${this.path}/scrape`).post(this.getPageInfo);
    this.router.route(`${this.path}/check_url`).post(this.checkUrl);
    this.router.route(`${this.path}/:_id`).get(this.getBookmarkById);
    this.router.route(`${this.path}/:_id`).patch(this.modifyBookmark);
    this.router.route(`${this.path}/:_id`).delete(this.deleteBookmark);
    this.router.route(this.path).post(this.createBookmarkByUrl);
    this.router.route(`${this.path}/create`).post(this.createBookmarkByUrl);
  };

  private getBookmarkById = async (
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
        next(new NotFoundException("Bookmark", _id));
      }
    } catch (err) {
      next(err);
    }
  };

  private getAllBookmarks = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const userId = request.params.userId;
      const items = await this.Model.find({ createdBy: userId }).exec();
      response.send(items);
    } catch (err) {
      next(err);
    }
  };

  private getUnfolderedBookmarks = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const userId = request.params.userId;
      const items = await this.Model.find({
        folder: { $exists: true, $size: 0 },
        createdBy: userId,
      }).exec();
      response.send(items);
    } catch (err) {
      next(err);
    }
  };

  private getDisplayBookmarks = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const per_page = Number(request.query.per_page) || 10;
      const page_no = Number(request.query.page_no) || 1;
      const folder_id = request.query.folder_id;
      const sort = request.body.sort || { id: 0 };
      const filter = request.body.filter || [];
      const pagination = { limit: per_page, skip: per_page * (page_no - 1) };
      const userId = request.params.userId;

      const sortOption = this.createSortOption(sort);
      const filterOption = this.createFilterOption(filter);
      let items;
      let _items;
      if (folder_id === "h-0") {
        items = await this.Model.find({
          ...filterOption,
          createdBy: userId,
        })
          .sort(sortOption)
          .limit(pagination.limit)
          .skip(pagination.skip)
          .exec();
        _items = await this.Model.find({
          ...filterOption,
          createdBy: userId,
        }).exec();
      } else if (folder_id === "h-1") {
        items = await this.Model.find({
          ...filterOption,
          folder: { $exists: true, $size: 0 },
          createdBy: userId,
        })
          .sort(sortOption)
          .limit(pagination.limit)
          .skip(pagination.skip)
          .exec();
        _items = await this.Model.find({
          ...filterOption,
          folder: { $exists: true, $size: 0 },
          createdBy: userId,
        }).exec();
      } else {
        items = await this.Model.find({
          ...filterOption,
          folder: { $all: [folder_id] },
          createdBy: userId,
        })
          .sort(sortOption)
          .limit(pagination.limit)
          .skip(pagination.skip)
          .exec();
        _items = await this.Model.find({
          ...filterOption,
          folder: { $all: [folder_id] },
          createdBy: userId,
        }).exec();
      }
      response.set("x-list-total-length", `${_items.length}`);
      response.send(items);
    } catch (err) {
      next(err);
    }
  };

  private modifyBookmark = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const _id = request.params._id;
    const itemData: IBookmark = Object.assign({}, request.body, {
      updatedAt: new Date().toISOString(),
    });

    try {
      const item = await this.Model.findByIdAndUpdate(_id, itemData, {
        new: true,
      });

      if (item) {
        response.send(item);
      } else {
        next(new NotFoundException("Bookmark", _id));
      }
    } catch (err) {
      next(err);
    }
  };

  private createBookmarkByUrl = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const { url, userId } = request.body;

    try {
      // check DB data
      const dataInDB = await this.Model.findOne({ url, createdBy: userId });
      const isUrl = dataInDB ? true : false;

      if (!isUrl) {
        // get page data
        const pageData = await this.createPageData(url);

        const itemData: IBookmark = Object.assign(
          {
            url,
            title: "",
            memo: "",
            domain: "",
            folder: [],
            tag: [],
            thumbnail: "",
            watchNumber: 0,
            articleCreatedAt: "",
            articleUpdatedAt: "",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            createdBy: userId,
            updatedBy: userId,
          },
          pageData
        );

        const createdBookmark = new this.Model(itemData);

        const item = await createdBookmark.save();
        await this.getThumbnail(item.url, item._id);
        Object.assign(item, { thumbnail: `${item._id}.png` });
        item.save();

        response.send(item);
      } else {
        throw new Error("This url is already exist.");
      }
    } catch (err) {
      next(err);
    }
  };

  private createBookmark = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const itemData: IBookmark = Object.assign({}, request.body, {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    const createdBookmark = new this.Model(itemData);
    try {
      const item = await createdBookmark.save();
      await this.getThumbnail(item.url, item._id);
      Object.assign(item, { thumbnail: `${item._id}.png` });
      item.save();
      response.send(item);
    } catch (err) {
      next(err);
    }
  };

  private deleteBookmark = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const _id = request.params._id;
    const imgPath = `shots/${_id}.png`;

    try {
      const successResponse = await this.Model.findByIdAndDelete(_id);
      if (successResponse) {
        if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
        response.send(`Deleting bookmark (_id:${_id}) is success`);
      } else {
        next(new NotFoundException("Bookmark", _id));
      }
    } catch (err) {
      next(err);
    }
  };

  private checkUrl = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const { id, url } = request.body;
    try {
      const item = await this.Model.findOne({ url, createdBy: id });
      const isUrl = item ? true : false;
      response.send(isUrl);
    } catch (err) {
      next(err);
    }
  };

  private getPageInfo = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const data = await this.createPageData(request.body.url);
      response.send(data);
    } catch (err) {
      next(err);
    }
  };

  private createPageData = async (url: string) => {
    try {
      // domain文字列の取得
      const a = url.match(/^https?:\/{2,}(.*?)(?:\/|\?|#|$)/);
      const b = url.match(/^http?:\/{2,}(.*?)(?:\/|\?|#|$)/);
      const domain = (a ? a[1] : false) || (b ? b[1] : "");

      // Web page情報の取得
      let title;
      let ogTitle;
      let metaDescription;
      let ogDescription;
      let articleCreatedAt = "";
      let articleUpdatedAt = "";

      const res = await axios.get(url);
      if (res.status == 200) {
        const $ = cheerio.load(res.data);
        const nucUrl =
          "https://www.tv-tokyo.co.jp/broad_tvtokyo/program/detail";
        if (url.includes(nucUrl)) {
          title = $("h1.tbcms_program-summary__heading").text();
          ogTitle = "";
          metaDescription = $(".tbcms_program-detail__inner p").text();
          ogDescription = "";
          articleCreatedAt = this.formatDate(
            $(".tbcms_program-summary__meta-onair").text()
          );
          articleUpdatedAt = this.formatDate(
            $(".tbcms_program-summary__meta-onair").text()
          );
        } else {
          title = $("title").text() || "";
          ogTitle = $("meta[property='og:title']").attr("content") || "";
          metaDescription = $("meta[name=description]").attr("content") || "";
          ogDescription =
            $("meta[property='og:description']").attr("content") || "";
        }

        return {
          title: title || ogTitle || "",
          memo:
            metaDescription.trim().replace(/\n+/g, "") ||
            ogDescription.trim().replace(/\n+/g, "") ||
            "",
          domain,
          articleCreatedAt,
          articleUpdatedAt,
        };
      }
    } catch (err) {
      throw err;
    }
  };

  private getThumbnail = async (url: string, _id: string) => {
    try {
      const imgName = `shots/${_id}.png`;
      const res = await axios.get(url);

      if (res.status == 200) {
        const $ = cheerio.load(res.data);
        const ogImage = $("meta[property='og:image']").attr("content") || null;

        if (ogImage) {
          const img = await axios.get(ogImage, { responseType: "arraybuffer" });
          fs.writeFileSync(
            imgName,
            // @ts-ignore
            new Buffer.from(img.data),
            "binary"
          );
        } else {
          webshot(url, imgName, (err: Error) => {
            if (err) throw err;
          });
        }
      }
    } catch (err) {
      throw err;
    }
  };

  private formatDate = (str: string) => {
    // 入力例: 2015年9月10日
    if (str !== "") {
      const arrayY = str.split("年");
      const arrayM = arrayY[1].split("月");
      const arrayD = arrayM[1].split("日");
      const year = Number(arrayY[0]);
      const month = Number(arrayM[0]) - 1;
      const date = Number(arrayD[0]);
      return new Date(year, month, date).toISOString();
    } else {
      return "";
    }
  };

  private createSortOption = (sort: ISortType) => {
    switch (sort.id) {
      case 0:
        return { createdAt: -1 };
      case 1:
        return { createdAt: 1 };
      case 2:
        return { title: 1 };
      case 3:
        return { title: -1 };
    }
  };

  private createFilterOption = (
    filter: (string | (ITag & { _id: string }))[]
  ) => {
    if (filter.length === 0) {
      return {};
    } else {
      const $or = [] as { [key: string]: RegExp }[];
      const tag = { $all: [] as string[] };
      filter.forEach((d) => {
        if (typeof d === "string") {
          $or.push({ title: new RegExp(d) }, { memo: new RegExp(d) });
        } else {
          tag.$all.push(d._id);
        }
      });
      if ($or.length > 0 && tag.$all.length > 0) return { $or, tag };
      else if ($or.length > 0 && tag.$all.length === 0) return { $or };
      else if ($or.length === 0 && tag.$all.length > 0) return { tag };
    }
  };
}
