import mongoose from "mongoose";
import UserEntity from "../entities/user";
// import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { PasswordDoc, passwordSchema } from "./mongo-password";

// Interface describing properties a user model (collection of documents) has
interface UserModel extends mongoose.Model<UserDoc> {
  build(userAttributes: UserEntity): UserDoc;
}

// Interface describing properties a user document has
// UserDocument is equivalent to:
// interface UserDocument extends mongoose.Document {
//   email: string;
//   password: string;
// }
export interface UserDoc extends mongoose.Document, Omit<UserEntity, "id"> {
  records: [PasswordDoc];
}

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    password: { type: String, required: true },
    records: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PasswordRecord",
      },
    ],
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.__v;

        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

userSchema.set("versionKey", "version");
// userSchema.plugin(updateIfCurrentPlugin);

userSchema.statics.build = (userAttributes: UserEntity) => {
  return new User({
    _id: userAttributes.id,
    email: userAttributes.email,
    password: userAttributes.password,
  });
};

const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

export { User };
