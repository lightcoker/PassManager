import {
  Subjects,
  Publisher,
  PasswordDeletedEvent,
} from "@pass-manager/common";

export class PasswordDeletedPublisher extends Publisher<PasswordDeletedEvent> {
  subject: Subjects.PasswordDeleted = Subjects.PasswordDeleted;
}
