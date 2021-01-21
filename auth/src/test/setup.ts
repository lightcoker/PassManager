import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

jest.setTimeout(30000);
jest.mock("../nats-wrapper");

// initialize in-memory mongodb just for test
let mongo: any;
beforeAll(async () => {
  process.env.JWT_KEY = "test";

  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

// cleaning up
beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

// close mongodb
afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});
