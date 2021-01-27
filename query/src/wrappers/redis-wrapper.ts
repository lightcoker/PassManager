import redis, { RedisClient } from "redis";
const { promisify } = require("util");

export class RedisWrapper {
  private _client?: RedisClient;

  get client() {
    if (!this._client) {
      throw new Error("Cannot access Redis client before connecting");
    }

    return this._client;
  }

  connect() {
    if (!process.env.REDIS_HOST || !process.env.REDIS_PORT) {
    }
    this._client = redis.createClient({
      host: process.env.REDIS_HOST!,
      port: parseInt(process.env.REDIS_PORT!),
    });

    return new Promise<void>((resolve, reject) => {
      this.client.on("ready", () => {
        console.log("Connected to Redis");

        this.client.set("key", "value", redis.print);
        this.client.get("key", redis.print);
        resolve();
      });
      this.client.on("error", (err: Error) => {
        console.error(err);
        reject(err);
      });
    });
  }

  public async set(key: string, value: string) {
    const setAsync = promisify(this.client.set).bind(this.client);
    return setAsync(key, value);
  }
  public async get(key: string) {
    const getAsync = promisify(this.client.get).bind(this.client);
    return getAsync(key);
  }
  public async del(key: string) {
    const delAsync = promisify(this.client.del).bind(this.client);
    return delAsync(key);
  }
}

export const redisWrapper = new RedisWrapper();
