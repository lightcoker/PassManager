import express from "express";
import { json } from "body-parser";
import "express-async-errors";
import cookieSession from "cookie-session";
import {
  setCurrentUser,
  errorHandler,
  NotFoundError,
} from "@pass-manager/common";
import { userRouter } from "./routes/user";
import { passwordRouter } from "./routes/password";
import { passwordsRouter } from "./routes/passwords";

const app = express();

app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: false,
  })
);
app.use(setCurrentUser);

app.use(userRouter);
app.use(passwordRouter);
app.use(passwordsRouter);

app.all("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
