import request from "supertest";
import { Connection } from "typeorm";
import { app } from "../../../../app";
import createConnection from "../../../../database";

let connection: Connection;

describe("Create Statement Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to create a deposit", async () => {
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
      .post("/api/v1/statements/deposit")
      .send({
        amount: 100,
        description: "Saving some money",
      })
      .set({
        Authorization: `Bearer ${token}`
      });

    expect(response.status).toBe(201);
    expect(response.body.amount).toBe(100);
    expect(response.body.description).toBe("Saving some money");
  });

  it("should be able to create a withdrawal", async () => {
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
      await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 100,
        description: "Saving some money",
      })
      .set({
        Authorization: `Bearer ${token}`
      });

      const response = await request(app)
      .post("/api/v1/statements/withdraw")
      .send({
        amount: 6,
        description: "Buying a sandwich",
      })
      .set({
        Authorization: `Bearer ${token}`
      });

    expect(response.status).toBe(201);
    expect(response.body.amount).toBe(6);
    expect(response.body.description).toBe("Buying a sandwich");
  });
});
