import request from "supertest";
import { app } from "../app";

import createConnection from "../database"


describe("Users",  () =>{
    beforeAll(async () => {
        const connection = await createConnection();
        await connection.runMigrations();
    });

    // primeiro teste
   it("Should be able to create a new user", async ()=>{
    const response = await request(app).post("/users")
    .send({
        email:"user10@example.com",
        name:"User Exemple"
    });
    expect(response.status).toBe(201);
   });

   //segundo teste
   it("Should not be able to create a user with exists email", async () => {
    const response = await request(app).post("/users")
    .send({
        email:"user@example.com",
        name:"User Exemple"
    });
    expect(response.status).toBe(400);
   })


});