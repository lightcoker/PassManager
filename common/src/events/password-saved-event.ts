import { Subjects } from "./subjects";

export interface PasswordSavedEvent {
  subject: Subjects.PasswordSaved;
  data: {
    id: string;
    userId: string;
    password: string;
    domain: string;
  };
}
