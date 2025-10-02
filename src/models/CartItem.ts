import mongoose, {Document, Schema, Types} from "mongoose";

export interface ICartItem extends Document {
    cart: Types.ObjectId;
    product: Types.ObjectId;
    quantity: number;
    price: number;
    note: string;
    isChecked: boolean;
    isDeleted: boolean;
}

const cartItemSchema: Schema<ICartItem> = new Schema<ICartItem>({
    cart: { type: Schema.Types.ObjectId, ref: "Cart", required: true },
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
    note: { type: String, default: "" },
    isChecked: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
});

const CartItem = mongoose.model<ICartItem>("CartItem", cartItemSchema);
export default CartItem;
