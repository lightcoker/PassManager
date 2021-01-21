import { Password } from "./../services/Password";
import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

// Interface describing properties required for creating new user
interface UserAttributes {
  email: string;
  password: string;
}

// Interface describing properties a user model (collection of documents) has
interface UserModel extends mongoose.Model<UserDocument> {
  build(userAttributes: UserAttributes): UserDocument;
}

// Interface describing properties a user document has
interface UserDocument extends mongoose.Document {
  email: string;
  password: string;
  version: number;
}

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    password: { type: String, required: true },
  },
  // change the returned JSON representation of user
  // https://mongoosejs.com/docs/guide.html#toJSON
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

userSchema.set("versionKey", "version");
userSchema.plugin(updateIfCurrentPlugin);

// Pre middleware functions are executed one after another, when each middleware calls next.
// https://mongoosejs.com/docs/middleware.html#pre
userSchema.pre("save", async function (done) {
  // hash when modified, including created
  // https://mongoosejs.com/docs/api.html#document_Document-isModified
  if (this.isModified("password")) {
    const hashedPassword = await Password.toHash(this.get("password"));
    this.set("password", hashedPassword);
  }
  done();
});

// Add method for mongoose schema to check types before creating new user
// typescript would check wether the input contains email and password
// https://mongoosejs.com/docs/guide.html#statics
userSchema.statics.build = (userAttributes: UserAttributes) => {
  return new User(userAttributes);
};

const User = mongoose.model<UserDocument, UserModel>("User", userSchema);

export { User };
