import { Generator } from "./../password-strategies/password-generator";
import express, { Request, Response } from "express";
import { requireAuth, validateRequest } from "@pass-manager/common";
import { body } from "express-validator";
import ArrayStrategy from "../password-strategies/array-strategy";
// import ToStringStrategy from "../password-strategies/tostring-strategy";
// import CryptoStrategy from "../password-strategies/crypto-strategy";

const MIN_LENGTH = 4;
const MAX_LENGTH = 257;

const router = express.Router();
router.post(
  "/api/password",
  [
    body("length")
      .isFloat({ min: MIN_LENGTH, max: MAX_LENGTH })
      .withMessage(
        `Password length should be between ${MIN_LENGTH} to ${MAX_LENGTH}`
      ),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { length } = req.body;

    const strategy = new ArrayStrategy();
    const generator = new Generator(strategy);
    const password = generator.generatePassword(length);

    res.status(201).send({ password });
  }
);

export { router as createPasswordRouter };
