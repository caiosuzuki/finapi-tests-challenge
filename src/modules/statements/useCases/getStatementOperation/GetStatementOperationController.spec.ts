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

describe("Get Statement Operation Controller", () => {
    beforeAll(async () => {
        connection = await createConnection();
        await connection.runMigrations();
    });

    afterAll(async () => {
        await connection.dropDatabase();
        await connection.close();
    });

    it("should be able to get a statement operation by its id", async () => {
        await createUser();
        const responseToken = await authenticateUser();
        const { token } = responseToken.body;
        const responseStatement = await request(app)
            .post("/api/v1/statements/deposit")
            .send({
                amount: 100,
                description: "Saving some money",
            })
            .set({
                Authorization: `Bearer ${token}`
            });
    
        const response = await request(app)
            .get(`/api/v1/statements/${responseStatement.body.id}`)
            .set({
                Authorization: `Bearer ${token}`
            });

        expect(response.status).toBe(200);
        expect(response.body.amount).toEqual("100.00");
        expect(response.body.description).toEqual("Saving some money");
    });
});
