import request from "supertest";
import { app } from "../../app";
import ValidSessionFactory from "../../test/factories/valid-session-factory";
import InvalidSessionFactory from "../../test/factories/invalid-session-factori";

it("responds with details about the current user in JWT", async () => {
  const validSessionFactory = new ValidSessionFactory();
  const validCookie = await validSessionFactory.createSession(app);

  const currentUserResponse = await request(app)
    .get("/api/users/currentuser")
    .set("Cookie", validCookie)
    .expect(200);
  const userInfo = currentUserResponse.body.currentUser;
  expect(userInfo.email).toEqual(validSessionFactory.email);
});

it("responses with null when supplying invalid cookie", async () => {
  const invalidCookie = await new InvalidSessionFactory().createSession(app);

  const currentUserResponse = await request(app)
    .get("/api/users/currentuser")
    .set("Cookie", invalidCookie)
    .expect(200);

  const userInfo = currentUserResponse.body.currentUser;
  expect(userInfo).toBeNull();
});

it("responses with null if not authenticated", async () => {
  const currentUserResponse = await request(app)
    .get("/api/users/currentuser")
    .expect(200);
  const userInfo = currentUserResponse.body.currentUser;
  expect(userInfo).toBeNull();
});
