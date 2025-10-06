import mongoose, { Document, Schema, Types } from "mongoose";
export interface IReview extends Document {
  user: Types.ObjectId;
  product: Types.ObjectId;
  rating: number;
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
  likes: Types.ObjectId[];
  isDeleted: boolean;
}
const reviewSchema: Schema<IReview> = new Schema<IReview>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);
export const Review = mongoose.model<IReview>("Review", reviewSchema);
export default Review;
