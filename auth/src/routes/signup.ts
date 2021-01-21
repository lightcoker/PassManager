import { natsWrapper } from "./../nats-wrapper";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  BadRequestError,
  validateRequest,
} from "@pass-manager/common";
import { User } from "./../models/user";
import jwt from "jsonwebtoken";
import { UserCreatedPublisher } from "../events/publishers/user-created-publisher";

const router = express.Router();

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Email must be valid."),
    body("password")
      .trim()
      .isLength({ min: 8, max: 128 })
      .withMessage("Password must be between 8 and 128 characters."),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new BadRequestError("Email in use.");
    }
    const user = User.build({ email, password });
    await user.save();

    // generate JWT with signing key
    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY!
    );

    // store JWT on session object
    req.session = {
      jwt: userJwt,
    };

    await new UserCreatedPublisher(natsWrapper.client).publish({
      id: user.id,
      email: user.email,
      password: user.password,
    });

    res.status(201).send(user);
  }
);

export { router as signupRouter };
