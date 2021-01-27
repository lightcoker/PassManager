import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import PasswordEntity from "../entities/password";

// PasswordDoc is equivalent to:
// interface PasswordDoc extends mongoose.Document {
//   domain: string;
//   password: string;
//   userId: string;
//   version: number;
// }
export interface PasswordDoc
  extends mongoose.Document,
    Omit<PasswordEntity, "id"> {}

interface PasswordModel extends mongoose.Model<PasswordDoc> {
  build(attrs: PasswordEntity): PasswordDoc;
}

export const passwordSchema = new mongoose.Schema(
  {
    domain: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    updatedAt: {
      type: mongoose.Schema.Types.Date,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

passwordSchema.set("versionKey", "version");
passwordSchema.plugin(updateIfCurrentPlugin);

passwordSchema.statics.build = (attrs: Omit<PasswordEntity, "version">) => {
  return new PasswordRecord({
    _id: attrs.id,
    userId: attrs.userId,
    domain: attrs.domain,
    password: attrs.password,
    updatedat: attrs.updatedAt,
  });
};

const PasswordRecord = mongoose.model<PasswordDoc, PasswordModel>(
  "PasswordRecord",
  passwordSchema
);

export { PasswordRecord };
