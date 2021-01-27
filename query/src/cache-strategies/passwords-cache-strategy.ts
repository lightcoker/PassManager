import { promisify } from "util";
import { redisWrapper } from "../wrappers/redis-wrapper";
import { BasicCacheStrategy } from "./basic-cache-strategy";
import PasswordEntity from "../data-repository/entities/password";

export class PasswordsCacheStrategy extends BasicCacheStrategy {
  private ttl: number = 3600;

  public generateKey(keyId: string): string {
    return JSON.stringify({
      field: "Passwords",
      id: keyId,
    });
  }

  public async setCache(keyId: string, values: PasswordEntity[]) {
    const key = this.generateKey(keyId);
    const stringifiedValues = JSON.stringify({ values });
    redisWrapper.set(key, stringifiedValues);
    redisWrapper.client.expire(key, this.ttl);
  }

  public async getCache(keyId: string) {
    const key = this.generateKey(keyId);
    const valueString: any = await redisWrapper.get(key);
    return valueString ? JSON.parse(valueString).values : [];
  }

  public async clearCache(keyId: string) {
    const key = this.generateKey(keyId);
    await redisWrapper.del(key);
  }
}
