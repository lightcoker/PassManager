import { NullObjectCacheStrategy } from "./null-object-cache-strategy";
import { BasicCacheStrategy } from "./basic-cache-strategy";

export default class RedisCache {
  private strategy: BasicCacheStrategy = new NullObjectCacheStrategy();

  constructor(strategy: BasicCacheStrategy) {
    this.strategy = strategy;
  }

  public async set(keyId: string, values: any) {
    this.strategy.setCache(keyId, values);
  }

  public async get(keyId: string) {
    return this.strategy.getCache(keyId);
  }

  public async clear(keyId: string) {
    this.strategy.clearCache(keyId);
  }
}
