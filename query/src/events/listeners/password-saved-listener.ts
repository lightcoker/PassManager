import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { PasswordSavedEvent, Listener, Subjects } from "@pass-manager/common";

import { PasswordsCacheStrategy } from "../../cache-strategies/passwords-cache-strategy";
import RedisCache from "../../cache-strategies/redis-cache";

// import { mongoRepository as repository } from "../../repository/mongo-repository";
import { postgresRepository as repository } from "../../data-repository/postgres-repository";

export class PasswordSavedListener extends Listener<PasswordSavedEvent> {
  subject: Subjects.PasswordSaved = Subjects.PasswordSaved;
  queueGroupName = queueGroupName;

  async onMessage(data: PasswordSavedEvent["data"], msg: Message) {
    const { id, domain, password, userId, updatedAt } = data;
    const userObject = { id: userId };
    const passwordObject = {
      id,
      domain,
      password,
      userId,
      updatedAt: new Date(updatedAt),
    };
    try {
      // Get new data
      await repository.insertPassword(userObject, passwordObject);
      msg.ack();

      // Clear the old data from cache
      const cacheStrategy = new PasswordsCacheStrategy();
      new RedisCache(cacheStrategy).clear(userId);
    } catch (error) {
      console.error(error);
    }
  }
}
