import mongoose, { Document } from "mongoose";
const Schema = mongoose.Schema;
import ITag from "../../types/ITag";

const schema = new Schema({
  name: { type: String, required: true },
  createdAt: { type: String },
  updatedAt: { type: String },
  createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
});

export default mongoose.model<ITag & Document>("Tag", schema);
