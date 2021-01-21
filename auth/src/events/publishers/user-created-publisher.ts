import { Subjects, Publisher, UserCreatedEvent } from "@pass-manager/common";

export class UserCreatedPublisher extends Publisher<UserCreatedEvent> {
  subject: Subjects.UserCreated = Subjects.UserCreated;
}
