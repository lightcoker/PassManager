import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { PasswordUpdatedEvent, Listener, Subjects } from "@pass-manager/common";
import RedisCache from "../../cache-strategies/redis-cache";
import { PasswordsCacheStrategy } from "../../cache-strategies/passwords-cache-strategy";

// import { mongoRepository as repository } from "../../repository/mongo-repository";
import { postgresRepository as repository } from "../../data-repository/postgres-repository";

export class PasswordUpdatedListener extends Listener<PasswordUpdatedEvent> {
  subject: Subjects.PasswordUpdated = Subjects.PasswordUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: PasswordUpdatedEvent["data"], msg: Message) {
    const { id, domain, password, userId, version, updatedAt } = data;
    const userObject = { id: userId };
    const passwordObject = {
      id,
      domain,
      password,
      userId,
      version,
      updatedAt: new Date(updatedAt),
    };
    try {
      // Get new data
      await repository.updatePassword(userObject, passwordObject);
      msg.ack();

      // Clear the old data from cache
      const cacheStrategy = new PasswordsCacheStrategy();
      new RedisCache(cacheStrategy).clear(data.userId);
    } catch (error) {
      console.error(error);
    }
  }
}
