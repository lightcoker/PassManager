import { CustomError } from "./custom-error";

export class DatabaseConnectionError extends CustomError {
  statusCode = 500;
  reason = "Database connection failed";

  constructor() {
    super("Database connection failed");
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  serializedErrors() {
    return [{ message: this.reason }];
  }
}
