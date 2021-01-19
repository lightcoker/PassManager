import { Subjects } from "./subjects";

export interface PasswordUpdatedEvent {
  subject: Subjects.PasswordUpdated;
  data: {
    id: string;
    userId: string;
    password: string;
    domain: string;
    version: number;
  };
}
