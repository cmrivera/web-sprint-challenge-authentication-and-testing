const test = require("supertest");

const server = require("./server.js");
const db = require("../database/dbConfig.js");

describe("server", function () {
  beforeEach(async () => {
    await db("users").truncate();
  });
  describe("post /register", function () {
    it("should return status 201", function () {
      return test(server)
        .post("/api/auth/register")
        .send({
          username: "sam",
          password: "apples",
        })
        .then((res) => {
          expect(res.status).toBe(201);
        });
    });
    it("should return a success message", function () {
      return test(server)
        .post("/api/auth/register")
        .send({
          username: "jondoe",
        })
        .then((res) => {
          expect(res.status).toBe(500);
        });
    });
  });
  describe("post /login", function () {
    it("should return a fail message", function () {
      return test(server)
        .post("/api/auth/login")
        .send({
          username: "jondoe",
          password: "winemaker",
        })
        .then((res) => {
          expect(res.status).toBe(401);
        });
    });
    it("should return authentication error", function () {
      return test(server)
        .post("/api/auth/login")
        .send({
          username: "jondoe",
          password: "winemaker",
        })
        .then((res) => {
          expect(res.body.message).toBe(
            "Invalid username or password - no jokes for you"
          );
        });
    });
  });
  describe("get jokes", function () {
    describe("should return invalid credentials message", function () {
      return test(server)
        .get("/api/jokes")
        .then((res) => {
          expect(res.body.message).toBe("invalid credentials");
        });
    });
    describe("should return status 400", function () {
      return test(server)
        .get("/api/jokes")
        .then((res) => {
          expect(res.status).toBe(400);
        });
    });
  });
});
