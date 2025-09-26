import mongoose, { Document, Schema, Types } from "mongoose";
export interface IOrderDetail extends Document {
  order: Types.ObjectId;
  product: Types.ObjectId;
  discount: Types.ObjectId;
  quantity: number;
  price: number;
  isDeleted: boolean;
}
const OrderDetailSchema: Schema<IOrderDetail> = new Schema<IOrderDetail>(
  {
    order: { type: Schema.Types.ObjectId, ref: "Order", required: true },
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    discount: { type: Schema.Types.ObjectId, ref: "Discount", default: null },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const OrderDetail = mongoose.model<IOrderDetail>(
  "OrderDetail",
  OrderDetailSchema
);
export default OrderDetail;
