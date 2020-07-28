import mongoose, { Document } from "mongoose";
const Schema = mongoose.Schema;
import ICounter from "../../types/ICounter";

const schema = new Schema({
  _id: { type: String }, // _idはカウンター名。ObjectIdは使用しない。
  seq: { type: Number },
});

export default mongoose.model<ICounter & Document>("Counter", schema);
