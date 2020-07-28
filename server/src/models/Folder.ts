import mongoose, { Document } from "mongoose";
const Schema = mongoose.Schema;
import IFolder from "../../types/IFolder";

const schema = new Schema({
  name: { type: String, required: true },
  items: [{ type: Schema.Types.ObjectId, ref: "Bookmark" }],
  createdAt: { type: String },
  updatedAt: { type: String },
  createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
});

export default mongoose.model<IFolder & Document>("Folder", schema);
