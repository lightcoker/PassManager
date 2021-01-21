import { Express } from "express";
import request from "supertest";
import BasicSessionFactory from "./basic-session-factory";

// sign up and get its cookie
export default class ValidSessionFactory extends BasicSessionFactory {
  public email = "valid.email@test.test";
  public password = "some_password";
  async createSession(app: Express) {
    const signupResponce = await request(app)
      .post("/api/users/signup")
      .send({ email: this.email, password: this.password })
      .expect(201);
    expect(signupResponce.get("Set-Cookie")).toBeDefined();

    const cookie = signupResponce.get("Set-Cookie");
    return cookie;
  }
}
