import express from "express";
import { json } from "body-parser";
import "express-async-errors"; 
import cookieSession from "cookie-session";
import {
  setCurrentUser,
  errorHandler,
  NotFoundError,
} from "@pass-manager/common";
import { createPasswordRouter } from "./routes/new";
import { updatePasswordRouter } from "./routes/update";
import { savePasswordRouter } from "./routes/save";
import { deletePasswordRouter } from "./routes/delete";
import { indexPasswordRouter } from "./routes";

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

app.use(createPasswordRouter);
app.use(updatePasswordRouter);
app.use(savePasswordRouter);
app.use(deletePasswordRouter);
app.use(indexPasswordRouter);

app.all("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
