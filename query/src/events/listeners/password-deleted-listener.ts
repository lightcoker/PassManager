import { PasswordsCacheStrategy } from "../../cache-strategies/passwords-cache-strategy";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { PasswordDeletedEvent, Listener, Subjects } from "@pass-manager/common";
import RedisCache from "../../cache-strategies/redis-cache";

// import { mongoRepository as repository } from "../../repository/mongo-repository";
import { postgresRepository as repository } from "../../data-repository/postgres-repository";

export class PasswordDeletedListener extends Listener<PasswordDeletedEvent> {
  subject: Subjects.PasswordDeleted = Subjects.PasswordDeleted;
  queueGroupName = queueGroupName;

  async onMessage(data: PasswordDeletedEvent["data"], msg: Message) {
    const userObject = { id: data.userId };
    const passwordObject = data;
    try {
      // Get new data
      await repository.deletePassword(userObject, passwordObject);
      msg.ack();

      // Clear the old data from cache
      const cacheStrategy = new PasswordsCacheStrategy();
      new RedisCache(cacheStrategy).clear(data.userId);
    } catch (error) {
      console.error(error);
    }
  }
}
