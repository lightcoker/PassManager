export abstract class BasicCacheStrategy {
  public abstract generateKey(keyId: string): string;
  public abstract setCache(keyId: string, values: any): void;
  public abstract getCache(keyId: string): any;
  public abstract clearCache(keyId: string): void;
}
