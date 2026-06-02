import request from "supertest";
import app from "../../src/app";

describe("Equipment API", () => {
  describe("POST /equipment", () => {
    it("should create equipment with valid data", async () => {
      const res = await request(app).post("/equipment").send({
        name: "Excavator CAT 320",
        type: "Heavy Machinery",
        plate: "AB-12-CD",
      });

      expect(res.status).toBe(201);
      expect(res.body.id).toBeDefined();
      expect(res.body.name).toBe("Excavator CAT 320");
      expect(res.body.active).toBe(true);
    });

    it("should create equipment without optional plate", async () => {
      const res = await request(app).post("/equipment").send({
        name: "Excavator CAT 320",
        type: "Heavy Machinery",
      });

      expect(res.status).toBe(201);
      expect(res.body.plate).toBeNull();
    });

    it("should return 400 when name is missing", async () => {
      const res = await request(app).post("/equipment").send({
        type: "Heavy Machinery",
      });

      expect(res.status).toBe(400);
      expect(res.body.error).toBeDefined();
    });

    it("should return 400 when type is missing", async () => {
      const res = await request(app).post("/equipment").send({
        name: "Excavator CAT 320",
      });

      expect(res.status).toBe(400);
      expect(res.body.error).toBeDefined();
    });
  });

  describe("GET /equipment", () => {
    it("should return an empty array when no equipment exists", async () => {
      const res = await request(app).get("/equipment");

      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    it("should return all equipment", async () => {
      await request(app)
        .post("/equipment")
        .send({ name: "Excavator", type: "Heavy Machinery" });
      await request(app)
        .post("/equipment")
        .send({ name: "Crane", type: "Lifting" });

      const res = await request(app).get("/equipment");

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
    });
  });

  describe("GET /equipment/:id", () => {
    it("should return equipment by id", async () => {
      const created = await request(app).post("/equipment").send({
        name: "Excavator CAT 320",
        type: "Heavy Machinery",
      });

      const res = await request(app).get(`/equipment/${created.body.id}`);

      expect(res.status).toBe(200);
      expect(res.body.id).toBe(created.body.id);
    });

    it("should return 404 for non-existent equipment", async () => {
      const res = await request(app).get("/equipment/non-existent-id");

      expect(res.status).toBe(404);
    });
  });

  describe("PUT /equipment/:id", () => {
    it("should update equipment", async () => {
      const created = await request(app).post("/equipment").send({
        name: "Excavator CAT 320",
        type: "Heavy Machinery",
      });

      const res = await request(app)
        .put(`/equipment/${created.body.id}`)
        .send({ active: false });

      expect(res.status).toBe(200);
      expect(res.body.active).toBe(false);
    });

    it("should return 404 for non-existent equipment", async () => {
      const res = await request(app)
        .put("/equipment/non-existent-id")
        .send({ active: false });

      expect(res.status).toBe(404);
    });
  });

  describe("DELETE /equipment/:id", () => {
    it("should delete equipment", async () => {
      const created = await request(app).post("/equipment").send({
        name: "Excavator CAT 320",
        type: "Heavy Machinery",
      });

      const res = await request(app).delete(`/equipment/${created.body.id}`);
      expect(res.status).toBe(204);

      const check = await request(app).get(`/equipment/${created.body.id}`);
      expect(check.status).toBe(404);
    });

    it("should return 404 for non-existent equipment", async () => {
      const res = await request(app).delete("/equipment/non-existent-id");
      expect(res.status).toBe(404);
    });
  });
});
