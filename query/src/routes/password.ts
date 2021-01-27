import { requireAuth } from "@pass-manager/common";
import express, { Request, Response } from "express";
import RedisCache from "../cache-strategies/redis-cache";
import { PasswordCacheStrategy } from "../cache-strategies/password-cache-strategy";

// import { mongoRepository as repository } from "../repository/mongo-repository";
import { postgresRepository as repository } from "../data-repository/postgres-repository";

const router = express.Router();
router.get(
  "/api/query/password/:id",
  requireAuth,
  async (req: Request, res: Response) => {
    const cacheStrategy = new PasswordCacheStrategy();
    const redisCache = new RedisCache(cacheStrategy);
    let password: any = await redisCache.get(req.params.id);

    if (password) {
      console.log("Get password from cache");
      return res.send(password);
    }

    password = await repository.getPassword(req.currentUser!, {
      id: req.params.id,
    });
    console.log("Get password from DB");

    if (password) {
      await redisCache.set(req.params.id, password);
    }
    res.send(password);
  }
);

export { router as passwordRouter };
