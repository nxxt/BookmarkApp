import mongoose, { Document } from "mongoose";
const Schema = mongoose.Schema;
import IUser from "../../types/IUser";

const schema = new Schema({
  role: { type: Number, required: true, default: 0 },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

export default mongoose.model<IUser & Document>("User", schema);
