import express from "express";
import { json } from "body-parser";
import { errorHandler, NotFoundError } from "@pass-manager/common";
import "express-async-errors"; // address async error with sync way
import { currentUserRouter } from "./routes/current-user";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { signupRouter } from "./routes/signup";
import cookieSession from "cookie-session";

const app = express();
app.set("trust proxy", true); // since nginx is used
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: false, // secure: process.env.NODE_ENV !== "test", // for https
  })
);

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

// router which is not implemented
app.all("*", async (req, res) => {
  // sync or async after installing express-async error
  throw new NotFoundError();

  // async before installing express-async error
  // next(new NotFoundError());
});

app.use(errorHandler);

export { app };
