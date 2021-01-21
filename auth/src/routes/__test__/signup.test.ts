import request from "supertest";
import { app } from "../../app";
import { natsWrapper } from "../../nats-wrapper";

it("returns a 201 on successful signup", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({ email: "test@test.test", password: "password" })
    .expect(201);
});

it("returns a 400 on failure signup with invalid password", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({ email: "test@test.test", password: "" })
    .expect(400);
});

it("returns a 400 on failure signup with invalid email", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({ email: "test.test.test", password: "password" })
    .expect(400);

  await request(app)
    .post("/api/users/signup")
    .send({ email: "test", password: "password" })
    .expect(400);
});

it("disallow duplicate email", async () => {
  const email = "test@test.test";
  const password = "password";

  await request(app)
    .post("/api/users/signup")
    .send({ email, password })
    .expect(201);
  await request(app)
    .post("/api/users/signup")
    .send({ email, password })
    .expect(400);
});

it("sets a cookie after signup", async () => {
  const email = "test@test.test";
  const password = "password";

  const response = await request(app)
    .post("/api/users/signup")
    .send({ email, password })
    .expect(201);
  expect(response.get("Set-Cookie")).toBeDefined();
});

it("publishes an event", async () => {
  const email = "test@test.test";
  const password = "password";

  const response = await request(app)
    .post("/api/users/signup")
    .send({ email, password })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
