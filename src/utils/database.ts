import mongoose from "mongoose";

export const isValidObjectId = mongoose.Types.ObjectId.isValid;
export const toObjectId = (id: string) => new mongoose.Types.ObjectId(id);
