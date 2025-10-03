import mongoose, { Document, Schema, Types } from "mongoose";

export interface ICart extends Document {
  user: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
}

const cartSchema: Schema<ICart> = new Schema<ICart>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const Cart = mongoose.model<ICart>("Cart", cartSchema);
export default Cart;
