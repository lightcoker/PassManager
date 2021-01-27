import { NotFoundError, requireAuth } from "@pass-manager/common";
import express, { Request, Response } from "express";
import RedisCache from "../cache-strategies/redis-cache";
import { UserCacheStrategy } from "../cache-strategies/user-cache-strategy";

// import { mongoRepository as repository } from "../repository/mongo-repository";
import { postgresRepository as repository } from "../data-repository/postgres-repository";
const router = express.Router();
router.get(
  "/api/query/user",
  requireAuth,
  async (req: Request, res: Response) => {
    const cacheStrategy = new UserCacheStrategy();
    const redisCache = new RedisCache(cacheStrategy);
    let user: any = await redisCache.get(req.currentUser!.id);
    if (user) {
      console.log("Get user from cache");
      return res.send(user);
    }

    user = await repository.getUser(req.currentUser!);
    if (!user) {
      throw new NotFoundError();
    }
    console.log("Get user from DB");

    await redisCache.set(req.currentUser!.id, user);
    res.send(user);
  }
);

export { router as userRouter };
