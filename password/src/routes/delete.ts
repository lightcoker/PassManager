import { PasswordDeletedPublisher } from "./../events/publishers/password-deleted-publisher";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  validateRequest,
  NotFoundError,
  requireAuth,
  NotAuthorizedError,
  BadRequestError,
} from "@pass-manager/common";
import { Password } from "../models/password";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.delete(
  "/api/password/:id",
  requireAuth,
  async (req: Request, res: Response) => {
    const passwordRecord = await Password.findById(req.params.id);

    if (!passwordRecord) {
      throw new NotFoundError();
    }

    if (passwordRecord.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    await passwordRecord.remove();

    await new PasswordDeletedPublisher(natsWrapper.client).publish({
      id: passwordRecord.id,
      userId: req.currentUser!.id,
    });

    res.status(204).send(passwordRecord);
  }
);

export { router as deletePasswordRouter };
