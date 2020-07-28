import "dotenv/config";
import App from "./app";
import AuthController from "./controllers/authController";

import BookmarksController from "./controllers/bookmarksController";
import FoldersController from "./controllers/foldersController";
import TagsController from "./controllers/tagsController";
import { validateEnv } from "./util/validateEnv";

validateEnv();

const app = new App([
  new AuthController(),
  new BookmarksController(),
  new FoldersController(),
  new TagsController(),
]);

app.listen();
