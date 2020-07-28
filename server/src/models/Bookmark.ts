import mongoose, { Document } from "mongoose";
const Schema = mongoose.Schema;
import IBookmark from "../../types/IBookmark";

const schema = new Schema({
  url: { type: String, required: true },
  title: { type: String },
  memo: { type: String },
  tag: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
  folder: [{ type: Schema.Types.ObjectId, ref: "Folder" }],
  domain: { type: String },
  thumbnail: { type: String },
  watchNumber: { type: Number },
  articleCreatedAt: { type: String },
  articleUpdatedAt: { type: String },
  createdAt: { type: String },
  updatedAt: { type: String },
  createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
});

export default mongoose.model<IBookmark & Document>("Bookmark", schema);
