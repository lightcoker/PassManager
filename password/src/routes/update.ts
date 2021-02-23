import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  validateRequest,
  NotFoundError,
  requireAuth,
  NotAuthorizedError,
} from "@pass-manager/common";
import { Password } from "../models/password";
import { natsWrapper } from "../nats-wrapper";
import { PasswordUpdatedPublisher } from "../events/publishers/password-updated-publisher";

const router = express.Router();

router.put(
  "/api/password/:id",
  requireAuth,
  [
    body("domain").not().isEmpty().withMessage("Domain is required."),
    body("account").not().isEmpty().withMessage("Account is required."),
    body("password").not().isEmpty().withMessage("Password is required."),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const passwordRecord = await Password.findById(req.params.id);

    if (!passwordRecord) {
      throw new NotFoundError();
    }

    if (passwordRecord.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    const updatedAt = new Date();
    passwordRecord.set({
      domain: req.body.domain,
      account: req.body.account,
      password: req.body.password,
      updatedAt,
    });
    await passwordRecord.save();

    await new PasswordUpdatedPublisher(natsWrapper.client).publish({
      id: passwordRecord.id,
      userId: req.currentUser!.id,
      domain: passwordRecord.domain,
      account: passwordRecord.account,
      password: passwordRecord.password,
      updatedAt: passwordRecord.updatedAt.toISOString(),
      version: passwordRecord.version,
    });

    res.send(passwordRecord);
  }
);

export { router as updatePasswordRouter };
