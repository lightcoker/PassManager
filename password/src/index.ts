import mongoose from "mongoose";
import { app } from "./app";
import { natsWrapper } from "./nats-wrapper";

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }

  // Initialize MongoDB
  try {
    const mongoUser = process.env.MONGO_USER;
    const mongoPassword = process.env.MONGO_PASSWORD;
    const mongoHost = process.env.MONGO_HOST;
    const mongoPort = process.env.MONGO_PORT;
    const dbName = process.env.MONGO_DB_NAME;

    await mongoose.connect(
      `mongodb://${mongoUser}:${mongoPassword}@${mongoHost}:${mongoPort}/${dbName}?authSource=admin`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
      }
    );
    console.log("Connected to mongodb.");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }

  // initialize NATS connection
  if (
    !process.env.NATS_CLIENT_ID ||
    !process.env.NATS_URL ||
    !process.env.NATS_CLUSTER_ID
  ) {
    throw new Error("NATS parameters must be defined");
  }

  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );
    
    natsWrapper.client.on("close", () => {
      console.log("NATS connection closed.");
      process.exit();
    });
    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());
  } catch (error) {
    console.log(error);
  }
};
start();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
