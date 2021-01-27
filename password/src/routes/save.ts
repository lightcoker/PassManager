import express, { Request, Response } from "express";
import { requireAuth, validateRequest } from "@pass-manager/common";
import { body } from "express-validator";
import { Password } from "../models/password";
import { natsWrapper } from "../nats-wrapper";
import { PasswordSavedPublisher } from "../events/publishers/password-saved-publisher";

const router = express.Router();

router.post(
  "/api/password/save",
  requireAuth,
  [
    body("domain").not().isEmpty().withMessage("Domain is required."),
    body("password").not().isEmpty().withMessage("Password is required."),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { domain, password } = req.body;
    const updatedAt = new Date();
    const passwordRecord = Password.build({
      domain,
      password,
      userId: req.currentUser!.id,
      updatedAt,
    });
    await passwordRecord.save();

    await new PasswordSavedPublisher(natsWrapper.client).publish({
      id: passwordRecord.id,
      userId: req.currentUser!.id,
      password: passwordRecord.password,
      domain: passwordRecord.domain,
      updatedAt: passwordRecord.updatedAt.toISOString(),
    });
    res.status(201).send(passwordRecord);
  }
);

export { router as savePasswordRouter };
