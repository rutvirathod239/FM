import mongoose, { Schema, Document, model, Model } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: string
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true }
  },
  { timestamps: true }
);

const UserModel: Model<IUser> = mongoose.models.User || model<IUser>('User', UserSchema);
export default UserModel;