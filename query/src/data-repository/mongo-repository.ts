import { BasicRepository } from "./basic-repository";
import mongoose from "mongoose";
import UserEntity from "./entities/user";
import PasswordEntity from "./entities/password";
import { User as UserRecord, UserDoc } from "./models/mongo-user";
import { PasswordRecord, PasswordDoc } from "./models/mongo-password";
import { DatabaseConnectionError, NotFoundError } from "@pass-manager/common";

export default class MongoRepository extends BasicRepository<
  UserDoc,
  PasswordDoc
> {
  async connect() {
    if (
      !process.env.MONGO_USER ||
      !process.env.MONGO_PASSWORD ||
      !process.env.MONGO_HOST ||
      !process.env.MONGO_PORT ||
      !process.env.MONGO_DB_NAME
    ) {
      throw new Error("MongoDB parameters must be defined.");
    }

    const connection = await mongoose.connect(
      `mongodb://${process.env.MONGO_USER}:${
        process.env.MONGO_PASSWORD
      }@${process.env.MONGO_HOST!}:${process.env.MONGO_PORT}/${
        process.env.MONGO_DB_NAME
      }?authSource=admin`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
      }
    );

    mongoose.connection.on("error", () => {
      console.error.bind(console, "connection error:");
      throw new DatabaseConnectionError();
    });
    mongoose.connection.once("open", function () {
      console.log("Connected to mongodb.");
    });
  }

  async initializeDB() {}

  async createUser(user: UserEntity) {
    const { id, email, password } = user;
    const userDoc = UserRecord.build({ id, email, password });
    await userDoc.save();
  }

  async getUser(user: UserEntity) {
    const userDoc = await UserRecord.findById(user.id).populate("records");
    if (!userDoc) {
      throw new NotFoundError();
    }
    return userDoc;
  }

  async getPasswords(user: UserEntity) {
    await UserRecord.findById(user.id);

    try {
      // deep populate https://mongoosejs.com/docs/populate.html#deep-populate
      const userWithPasswordDocs = await UserRecord.findById(user.id)
        .populate("records")
        .populate("passwordrecord");
      return userWithPasswordDocs.records;
    } catch (error) {
      return [];
    }
  }

  async getPassword(user: UserEntity, password: PasswordEntity) {
    await UserRecord.findById(user.id);
    const passwordRecord = await PasswordRecord.findOne({
      _id: password.id,
      userId: user.id,
    });

    if (!passwordRecord) {
      throw new NotFoundError();
    }
    return passwordRecord;
  }

  async insertPassword(user: UserEntity, password: PasswordEntity) {
    const userDoc = await this.getUser(user);
    const passwordRecord = await PasswordRecord.build({
      id: password.id,
      account: password.account,
      password: password.password,
      userId: password.userId,
      domain: password.domain,
      updatedAt: new Date(password.updatedAt!),
    });
    await passwordRecord.save();
    await userDoc.records.push(passwordRecord);
    await userDoc.save();
  }

  async updatePassword(user: UserEntity, password: PasswordEntity) {
    const passwordRecord = await PasswordRecord.findOneAndUpdate(
      {
        _id: password.id,
        version: password.version! - 1,
      },
      {
        domain: password.domain,
        account: password.account,
        password: password.password,
        updatedAt: new Date(password.updatedAt!),
      },
      { new: true }
    );

    if (!passwordRecord) {
      throw new NotFoundError();
    }

    await passwordRecord.save();
  }

  async deletePassword(user: UserEntity, password: PasswordEntity) {
    const userDoc = await UserRecord.findOneAndUpdate(
      { _id: user.id },
      {
        $pull: {
          records: {
            _id: password.id,
          },
        },
      }
    );
    await userDoc.save();

    await PasswordRecord.findByIdAndRemove(password.id);
  }
}

export const mongoRepository = new MongoRepository();
