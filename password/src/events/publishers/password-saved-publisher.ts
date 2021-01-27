import { Subjects, Publisher, PasswordSavedEvent } from "@pass-manager/common";

export class PasswordSavedPublisher extends Publisher<PasswordSavedEvent> {
  subject: Subjects.PasswordSaved = Subjects.PasswordSaved;
}
