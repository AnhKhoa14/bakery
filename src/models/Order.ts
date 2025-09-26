import mongoose, {Document, Schema, Types} from "mongoose";
export interface IOrder extends Document{
    user: Types.ObjectId;
    totalPrice: number;
    date: Date;
    orderStatus: Types.ObjectId;
    paymentMethod: Types.ObjectId;
    discount: Types.ObjectId;
    isDeleted: boolean;
}
const orderSchema: Schema<IOrder> = new Schema<IOrder>({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    totalPrice: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    orderStatus: { type: Schema.Types.ObjectId, ref: "OrderStatus", required: true },
    paymentMethod: { type: Schema.Types.ObjectId, ref: "PaymentMethod", required: true },
    discount: { type: Schema.Types.ObjectId, ref: "Discount" },
    isDeleted: { type: Boolean, default: false },
});

const Order = mongoose.model<IOrder>("Order", orderSchema);

export default Order;