import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface PasswordAttrs {
  domain: string;
  password: string;
  userId: string;
  updatedAt: Date;
}

interface PasswordDoc extends mongoose.Document {
  domain: string;
  password: string;
  userId: string;
  updatedAt: Date;
  version: number;
}

interface PasswordModel extends mongoose.Model<PasswordDoc> {
  build(attrs: PasswordAttrs): PasswordDoc;
}

const passwordSchema = new mongoose.Schema(
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

passwordSchema.statics.build = (attrs: PasswordAttrs) => {
  return new Password(attrs);
};

const Password = mongoose.model<PasswordDoc, PasswordModel>(
  "Password",
  passwordSchema
);

export { Password };
