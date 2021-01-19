import { CustomError } from "./custom-error";

export class NotFoundError extends CustomError {
  statusCode = 404;
  constructor() {
    super("Invalid request parameters"); 
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializedErrors() {
    return [{ message: "Not found" }];
  }
}
