import { Express } from "express";
export default abstract class BasicSessionFactory {
  public abstract createSession(app: Express): Promise<string[]>;
}
