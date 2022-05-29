// import { response } from "express";
const request = require("supertest");

const dotenv = require("dotenv");
dotenv.config();

const ip = process.env.IP;
const port = process.env.PORT;
const url = `${ip}:${port}`;

describe("Basic test", () => {
    describe("GET /", () => {
        it("Sould return 200 with Hello World", async () => {
            const response = await request(url).get("/");
            expect(response.statusCode).toBe(200);
        });
    
    });
});
