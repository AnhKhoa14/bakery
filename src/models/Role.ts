import mongoose, {Document, Schema} from "mongoose";

export interface IRole extends Document {
  name: string;
}

const roleSchema: Schema<IRole> = new Schema<IRole>({
  name: { type: String, required: true, unique: true },
})

const Role = mongoose.model<IRole>("Role", roleSchema);

export default Role;