import { Express } from "express";
import BasicSessionFactory from "./basic-session-factory";

export default class InvalidSessionFactory extends BasicSessionFactory {
  async createSession(app: Express) {
    const cookie = ["express:sess=; Path=/; Domain=passmanager.com; HttpOnly;"];
    return cookie;
  }
}
