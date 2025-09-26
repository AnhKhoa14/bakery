import mongoose, { Document, Schema, Types } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  inStock: boolean;
  imageUrl?: string;
  category: Types.ObjectId;
  isDeleted: boolean;
}
const productSchema: Schema<IProduct> = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    inStock: { type: Boolean, required: true, default: true },
    imageUrl: { type: String },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);
const Product = mongoose.model<IProduct>("Product", productSchema);
export default Product;