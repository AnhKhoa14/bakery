import mongoose, {Document, Schema } from "mongoose";

export interface ICategory extends Document {
    name: string;
}

const categorySchema: Schema<ICategory> = new Schema<ICategory>({
    name: { type: String, required: true, unique: true },
})
const Category = mongoose.model<ICategory>("Category", categorySchema);

export default Category;