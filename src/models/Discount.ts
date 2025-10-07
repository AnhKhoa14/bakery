import mongoose, { Document, Schema, Types } from "mongoose";
export interface IDiscount extends Document {
  code: string;
  coupon: Types.ObjectId;
  startDate: Date;
  endDate: Date;
  isDeleted?: boolean;
}

const DiscountSchema: Schema<IDiscount> = new Schema<IDiscount>({
  code: { type: String, required: true, unique: true },
  coupon: { type: Schema.Types.ObjectId, ref: "Coupon" },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  isDeleted: { type: Boolean, default: false },
});

const Discount = mongoose.model<IDiscount>("Discount", DiscountSchema);

export default Discount;
