import { redisWrapper } from "./../wrappers/redis-wrapper";

export class UserCacheStrategy {
  private ttl: number = 3600;

  public generateKey(keyId: string) {
    return JSON.stringify({
      field: "User",
      id: keyId,
    });
  }

  public async setCache(keyId: string, values: any) {
    const key = this.generateKey(keyId);
    await redisWrapper.set(key, JSON.stringify(values));
    redisWrapper.client.expire(key, this.ttl);
  }

  public async getCache(keyId: string) {
    const key = this.generateKey(keyId);
    return JSON.parse(await redisWrapper.get(key));
  }

  public async clearCache(keyId: string) {
    const key = this.generateKey(keyId);
    await redisWrapper.del(key);
  }
}
