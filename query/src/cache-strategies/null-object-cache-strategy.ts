import { redisWrapper } from "../wrappers/redis-wrapper";
import { BasicCacheStrategy } from "./basic-cache-strategy";

export class NullObjectCacheStrategy extends BasicCacheStrategy {
  public generateKey(keyId: string): string {
    return JSON.stringify({
      field: "Null",
      id: keyId,
    });
  }

  public async setCache(keyId: string, values: any) {
    console.log("Default strategy is applied and does nothing.")
  }

  public async getCache(keyId: string) {
    console.log("Default strategy is applied and does nothing.")
  }
  
  public async clearCache(keyId: string) {
    console.log("Default strategy is applied and does nothing.")
  }
}
