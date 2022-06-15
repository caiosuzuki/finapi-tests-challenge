import request from "supertest";
import { Connection } from "typeorm";
import { app } from "../../../../app";
import createConnection from "../../../../database";

let connection: Connection;

describe("Create User Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to authenticate a user", async () => {
    await request(app)
      .post("/api/v1/users")
      .send({
        name: "Hannah",
        email: "hannah@email.com",
        password: "bestpasswordever"
      });
      const responseToken = await request(app)
      .post("/api/v1/sessions")
      .send({
        email: "hannah@email.com",
        password: "bestpasswordever"
      });
      const { token } = responseToken.body;

      const response = await request(app)
      .get("/api/v1/profile")
      .set({
        Authorization: `Bearer ${token}`
      });

    expect(response.body.name).toBe("Hannah");
  });
});
