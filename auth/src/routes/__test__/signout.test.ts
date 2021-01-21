import request from "supertest";
import { app } from "../../app";
import ValidSessionFactory from "../../test/factories/valid-session-factory";

it("clears the cookies after signing out", async () => {
  const validSessionFactory = new ValidSessionFactory();
  await validSessionFactory.createSession(app);

  const response = await request(app)
    .post("/api/users/signout")
    .send({})
    .expect(200);
  expect(response.get("Set-Cookie")[0]).toContain("express:sess=; path=/;");
});
