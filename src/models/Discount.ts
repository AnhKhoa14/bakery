import mongoose, { Document, Schema } from "mongoose";
export interface IDiscount extends Document {
  code: string;
  percentage: number;
  startDate: Date;
  endDate: Date;
}

const DiscountSchema: Schema<IDiscount> = new Schema<IDiscount>({
  code: { type: String, required: true, unique: true },
  percentage: { type: Number, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
});

const Discount = mongoose.model<IDiscount>("Discount", DiscountSchema);

export default Discount;
