import request from "supertest";
import { app } from "../../app";
import ValidSessionFactory from "../../test/factories/valid-session-factory";

it("fails when supplying non-existing email", async () => {
  const email = "non.existing@test.test";
  const password = "password";

  await request(app)
    .post("/api/users/signin")
    .send({ email, password })
    .expect(400);
});

it("signs in when supplying correct password", async () => {
  const validSessionFactory = new ValidSessionFactory();
  await validSessionFactory.createSession(app);

  const response = await request(app)
    .post("/api/users/signin")
    .send({
      email: validSessionFactory.email,
      password: validSessionFactory.password,
    })
    .expect(200);
  expect(response.get("Set-Cookie")).toBeDefined();
});

it("fails whe supplying wrong password", async () => {
  const validSessionFactory = new ValidSessionFactory();
  await validSessionFactory.createSession(app);

  await request(app)
    .post("/api/users/signin")
    .send({ email: validSessionFactory.email, password: "incorrect_password" })
    .expect(400);
});
