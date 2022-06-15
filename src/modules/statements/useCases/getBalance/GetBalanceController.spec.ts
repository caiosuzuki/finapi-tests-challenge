import request from "supertest";
import { Connection } from "typeorm";
import { app } from "../../../../app";
import createConnection from "../../../../database";

let connection: Connection;

async function createUser() {
    await request(app)
        .post("/api/v1/users")
        .send({
            name: "Hannah",
            email: "hannah@email.com",
            password: "bestpasswordever"
        });
}

async function authenticateUser() {
    return request(app)
        .post("/api/v1/sessions")
        .send({
            email: "hannah@email.com",
            password: "bestpasswordever"
        });
}

describe("Get Balance Controller", () => {
    beforeAll(async () => {
        connection = await createConnection();
        await connection.runMigrations();
    });

    afterAll(async () => {
        await connection.dropDatabase();
        await connection.close();
    });

    it("should be able to get the balance", async () => {
        await createUser();
        const responseToken = await authenticateUser();
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
        await request(app)
            .post("/api/v1/statements/withdraw")
            .send({
                amount: 6,
                description: "Buying a sandwich",
            })
            .set({
                Authorization: `Bearer ${token}`
            });

        const response = await request(app)
            .get("/api/v1/statements/balance")
            .set({
                Authorization: `Bearer ${token}`
            });

        expect(response.status).toBe(200);
        expect(response.body.balance).toBe(94);
    });
});
