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

      const response = await request(app)
      .post("/api/v1/sessions")
      .send({
        email: "hannah@email.com",
        password: "bestpasswordever"
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("user");
    expect(response.body).toHaveProperty("token");
  });
});
