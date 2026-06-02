import request from "supertest";
import app from "../../src/app";
import { describe, it, expect, beforeEach } from "@jest/globals";

describe("Materials API", () => {
  describe("POST /materials", () => {
    it("should create a material with valid data", async () => {
      const res = await request(app).post("/materials").send({
        name: "Portland Cement",
        unit: "bags",
        stock: 500,
      });

      expect(res.status).toBe(201);
      expect(res.body.id).toBeDefined();
      expect(res.body.name).toBe("Portland Cement");
      expect(res.body.stock).toBe(500);
    });

    it("should create a material with zero stock when stock is not provided", async () => {
      const res = await request(app).post("/materials").send({
        name: "Portland Cement",
        unit: "bags",
      });

      expect(res.status).toBe(201);
      expect(res.body.stock).toBe(0);
    });

    it("should return 400 when name is missing", async () => {
      const res = await request(app).post("/materials").send({
        unit: "bags",
        stock: 500,
      });

      expect(res.status).toBe(400);
      expect(res.body.error).toBeDefined();
    });

    it("should return 400 when unit is missing", async () => {
      const res = await request(app).post("/materials").send({
        name: "Portland Cement",
        stock: 500,
      });

      expect(res.status).toBe(400);
      expect(res.body.error).toBeDefined();
    });
  });

  describe("GET /materials", () => {
    it("should return an empty array when no materials exist", async () => {
      const res = await request(app).get("/materials");

      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    it("should return all materials", async () => {
      await request(app)
        .post("/materials")
        .send({ name: "Cement", unit: "bags", stock: 100 });
      await request(app)
        .post("/materials")
        .send({ name: "Steel", unit: "tons", stock: 50 });

      const res = await request(app).get("/materials");

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
    });
  });

  describe("GET /materials/:id", () => {
    it("should return a material by id", async () => {
      const created = await request(app).post("/materials").send({
        name: "Portland Cement",
        unit: "bags",
        stock: 500,
      });

      const res = await request(app).get(`/materials/${created.body.id}`);

      expect(res.status).toBe(200);
      expect(res.body.id).toBe(created.body.id);
    });

    it("should return 404 for a non-existent material", async () => {
      const res = await request(app).get("/materials/non-existent-id");

      expect(res.status).toBe(404);
    });
  });

  describe("PUT /materials/:id", () => {
    it("should update a material", async () => {
      const created = await request(app).post("/materials").send({
        name: "Portland Cement",
        unit: "bags",
        stock: 500,
      });

      const res = await request(app)
        .put(`/materials/${created.body.id}`)
        .send({ stock: 750 });

      expect(res.status).toBe(200);
      expect(res.body.stock).toBe(750);
    });

    it("should return 404 for a non-existent material", async () => {
      const res = await request(app)
        .put("/materials/non-existent-id")
        .send({ stock: 750 });

      expect(res.status).toBe(404);
    });
  });

  describe("DELETE /materials/:id", () => {
    it("should delete a material", async () => {
      const created = await request(app).post("/materials").send({
        name: "Portland Cement",
        unit: "bags",
        stock: 500,
      });

      const res = await request(app).delete(`/materials/${created.body.id}`);
      expect(res.status).toBe(204);

      const check = await request(app).get(`/materials/${created.body.id}`);
      expect(check.status).toBe(404);
    });

    it("should return 404 for a non-existent material", async () => {
      const res = await request(app).delete("/materials/non-existent-id");
      expect(res.status).toBe(404);
    });
  });
});
