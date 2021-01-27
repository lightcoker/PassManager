import { promisify } from "util";
import { redisWrapper } from "../wrappers/redis-wrapper";
import { BasicCacheStrategy } from "./basic-cache-strategy";
import PasswordEntity from "../data-repository/entities/password";

export class PasswordCacheStrategy extends BasicCacheStrategy {
  private ttl: number = 3600;

  public generateKey(keyId: string): string {
    return JSON.stringify({
      field: "Password",
      id: keyId,
    });
  }

  public async setCache(keyId: string, value: PasswordEntity) {
    const key = this.generateKey(keyId);
    const stringifiedValue = JSON.stringify(value);
    redisWrapper.set(key, stringifiedValue);
    redisWrapper.client.expire(key, this.ttl);
  }

  public async getCache(keyId: string) {
    const key = this.generateKey(keyId);
    const valueString: any = await redisWrapper.get(key);
    return valueString;
  }

  public async clearCache(keyId: string) {
    const key = this.generateKey(keyId);
    await redisWrapper.del(key);
  }
}
