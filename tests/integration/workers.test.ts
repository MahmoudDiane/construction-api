import request from "supertest";
import app from "../../src/app";

describe("Workers API", () => {
  describe("POST /workers", () => {
    it("should create a worker with valid data", async () => {
      const res = await request(app).post("/workers").send({
        name: "João Silva",
        role: "Carpenter",
        phone: "912345678",
      });

      expect(res.status).toBe(201);
      expect(res.body.id).toBeDefined();
      expect(res.body.name).toBe("João Silva");
      expect(res.body.role).toBe("Carpenter");
      expect(res.body.active).toBe(true);
    });

    it("should create a worker without optional phone", async () => {
      const res = await request(app).post("/workers").send({
        name: "João Silva",
        role: "Carpenter",
      });

      expect(res.status).toBe(201);
      expect(res.body.phone).toBeNull();
    });

    it("should return 400 when name is missing", async () => {
      const res = await request(app).post("/workers").send({
        role: "Carpenter",
      });

      expect(res.status).toBe(400);
      expect(res.body.error).toBeDefined();
    });

    it("should return 400 when role is missing", async () => {
      const res = await request(app).post("/workers").send({
        name: "João Silva",
      });

      expect(res.status).toBe(400);
      expect(res.body.error).toBeDefined();
    });
  });

  describe("GET /workers", () => {
    it("should return an empty array when no workers exist", async () => {
      const res = await request(app).get("/workers");

      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    it("should return all workers", async () => {
      await request(app)
        .post("/workers")
        .send({ name: "João Silva", role: "Carpenter" });
      await request(app)
        .post("/workers")
        .send({ name: "Maria Costa", role: "Engineer" });

      const res = await request(app).get("/workers");

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
    });
  });

  describe("GET /workers/:id", () => {
    it("should return a worker by id", async () => {
      const created = await request(app).post("/workers").send({
        name: "João Silva",
        role: "Carpenter",
      });

      const res = await request(app).get(`/workers/${created.body.id}`);

      expect(res.status).toBe(200);
      expect(res.body.id).toBe(created.body.id);
    });

    it("should return 404 for a non-existent worker", async () => {
      const res = await request(app).get("/workers/non-existent-id");

      expect(res.status).toBe(404);
    });
  });

  describe("PUT /workers/:id", () => {
    it("should update a worker", async () => {
      const created = await request(app).post("/workers").send({
        name: "João Silva",
        role: "Carpenter",
      });

      const res = await request(app)
        .put(`/workers/${created.body.id}`)
        .send({ active: false });

      expect(res.status).toBe(200);
      expect(res.body.active).toBe(false);
    });

    it("should return 404 for a non-existent worker", async () => {
      const res = await request(app)
        .put("/workers/non-existent-id")
        .send({ active: false });

      expect(res.status).toBe(404);
    });
  });

  describe("DELETE /workers/:id", () => {
    it("should delete a worker", async () => {
      const created = await request(app).post("/workers").send({
        name: "João Silva",
        role: "Carpenter",
      });

      const res = await request(app).delete(`/workers/${created.body.id}`);
      expect(res.status).toBe(204);

      const check = await request(app).get(`/workers/${created.body.id}`);
      expect(check.status).toBe(404);
    });

    it("should return 404 for a non-existent worker", async () => {
      const res = await request(app).delete("/workers/non-existent-id");
      expect(res.status).toBe(404);
    });
  });
});
