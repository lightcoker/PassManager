import { Subjects } from "./subjects";

export interface PasswordDeletedEvent {
  subject: Subjects.PasswordDeleted;
  data: {
    id: string;
    userId: string;
  };
}
