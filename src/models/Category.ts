import mongoose, {Document, Schema } from "mongoose";

export interface ICategory extends Document {
    name: string;
    productCount: number;
    isDeleted: boolean;
}

const categorySchema: Schema<ICategory> = new Schema<ICategory>({
    name: { type: String, required: true, unique: true },
    productCount: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false }
})
const Category = mongoose.model<ICategory>("Category", categorySchema);

export default Category;