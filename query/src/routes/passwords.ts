import { requireAuth } from "@pass-manager/common";
import express, { Request, Response } from "express";
import RedisCache from "../cache-strategies/redis-cache";
import { PasswordsCacheStrategy } from "../cache-strategies/passwords-cache-strategy";

// import { mongoRepository as repository } from "../repository/mongo-repository";
import { postgresRepository as repository } from "../data-repository/postgres-repository";

const router = express.Router();
router.get(
  "/api/query/passwords",
  requireAuth,
  async (req: Request, res: Response) => {
    const cacheStrategy = new PasswordsCacheStrategy();
    const redisCache = new RedisCache(cacheStrategy);
    let passwords: any = await redisCache.get(req.currentUser!.id);
    if (passwords.length !== 0) {
      console.log("Get passwords from cache");
      return res.send(passwords);
    }

    passwords = await repository.getPasswords(req.currentUser!);
    console.log("Get passwords from DB");

    if (passwords) {
      await redisCache.set(req.currentUser!.id, passwords);
    }
    res.send(passwords);
  }
);

export { router as passwordsRouter };
