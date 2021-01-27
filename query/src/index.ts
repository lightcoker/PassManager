import { app } from "./app";
import { natsWrapper } from "./wrappers/nats-wrapper";
import { redisWrapper } from "./wrappers/redis-wrapper";
// import { mongoRepository as repository } from "./repository/mongo-repository";
import { postgresRepository as repository } from "./data-repository/postgres-repository";

import { UserCreatedListener } from "./events/listeners/user-created-listener";
import { PasswordDeletedListener } from "./events/listeners/password-deleted-listener";
import { PasswordUpdatedListener } from "./events/listeners/password-updated-listener";
import { PasswordSavedListener } from "./events/listeners/password-saved-listener";

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }

  // Initialize database
  try {
    await repository.connect();
    await repository.initializeDB();

    await redisWrapper.connect();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }

  // initialize NATS
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
      process.exit(1);
    });
    process.on("SIGINT", () => {
      natsWrapper.client.close();
    });
    process.on("SIGTERM", () => {
      natsWrapper.client.close();
    });

    new UserCreatedListener(natsWrapper.client).listen();
    new PasswordSavedListener(natsWrapper.client).listen();
    new PasswordUpdatedListener(natsWrapper.client).listen();
    new PasswordDeletedListener(natsWrapper.client).listen();
  } catch (error) {
    console.log(error);
  }
};
start();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
