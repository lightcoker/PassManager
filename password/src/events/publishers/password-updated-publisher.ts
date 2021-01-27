import {
  Subjects,
  Publisher,
  PasswordUpdatedEvent,
} from "@pass-manager/common";

export class PasswordUpdatedPublisher extends Publisher<PasswordUpdatedEvent> {
  subject: Subjects.PasswordUpdated = Subjects.PasswordUpdated;
}
