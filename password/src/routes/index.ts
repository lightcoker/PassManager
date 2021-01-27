import { requireAuth } from "@pass-manager/common";
import express, { Request, Response } from "express";
import { Password } from "../models/password";

const router = express.Router();

router.get(
  "/api/password",
  requireAuth,
  async (req: Request, res: Response) => {
    const passwords = await Password.find({
      userId: req.currentUser!.id,
    });
    res.send(passwords);
  }
);

export { router as indexPasswordRouter };
