import mongoose, { Document, Schema } from "mongoose";
export interface IPaymentMethod extends Document {
  name: string;
  isEnabled: boolean;
}
const paymentMethodSchema: Schema<IPaymentMethod> = new Schema<IPaymentMethod>({
  name: { type: String, required: true, unique: true },
  isEnabled: { type: Boolean, default: true },
});
const PaymentMethod = mongoose.model<IPaymentMethod>(
  "PaymentMethod",
  paymentMethodSchema
);
export default PaymentMethod;
