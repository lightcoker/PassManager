import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { UserCreatedEvent, Listener, Subjects } from "@pass-manager/common";
// import { mongoRepository as repository } from "../../repository/mongo-repository";
import { postgresRepository as repository } from "../../data-repository/postgres-repository";

export class UserCreatedListener extends Listener<UserCreatedEvent> {
  subject: Subjects.UserCreated = Subjects.UserCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: UserCreatedEvent["data"], msg: Message) {
    try {
      await repository.createUser(data);
      msg.ack();
    } catch (error) {
      console.error(error);
    }
  }
}
