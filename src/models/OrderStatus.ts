import mongoose, { Document, Schema } from "mongoose";
export interface IOrderStatus extends Document {
  name: string;
}
const orderStatusSchema: Schema<IOrderStatus> = new Schema<IOrderStatus>({
  name: { type: String, required: true, unique: true },
});
const OrderStatus = mongoose.model<IOrderStatus>(
  "OrderStatus",
  orderStatusSchema
);
export default OrderStatus;
