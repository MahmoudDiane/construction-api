import request from "supertest";
import app from "../../src/app";

describe("Projects API", () => {
  describe("POST /projects", () => {
    it("should create a project with valid data", async () => {
      const res = await request(app).post("/projects").send({
        name: "Torre Vasco da Gama",
        location: "Parque das Nações, Lisboa",
        startDate: "2026-01-15",
      });

      expect(res.status).toBe(201);
      expect(res.body.id).toBeDefined();
      expect(res.body.name).toBe("Torre Vasco da Gama");
      expect(res.body.status).toBe("ACTIVE");
      expect(res.body.endDate).toBeNull();
    });

    it("should return 400 when name is missing", async () => {
      const res = await request(app).post("/projects").send({
        location: "Parque das Nações, Lisboa",
        startDate: "2026-01-15",
      });

      expect(res.status).toBe(400);
      expect(res.body.error).toBeDefined();
    });

    it("should return 400 when location is missing", async () => {
      const res = await request(app).post("/projects").send({
        name: "Torre Vasco da Gama",
        startDate: "2026-01-15",
      });

      expect(res.status).toBe(400);
      expect(res.body.error).toBeDefined();
    });

    it("should return 400 when startDate is missing", async () => {
      const res = await request(app).post("/projects").send({
        name: "Torre Vasco da Gama",
        location: "Parque das Nações, Lisboa",
      });

      expect(res.status).toBe(400);
      expect(res.body.error).toBeDefined();
    });
  });

  describe("GET /projects", () => {
    it("should return an empty array when no projects exist", async () => {
      const res = await request(app).get("/projects");

      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    it("should return all projects", async () => {
      await request(app).post("/projects").send({
        name: "Project A",
        location: "Lisboa",
        startDate: "2026-01-01",
      });
      await request(app).post("/projects").send({
        name: "Project B",
        location: "Porto",
        startDate: "2026-02-01",
      });

      const res = await request(app).get("/projects");

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
    });
  });

  describe("GET /projects/:id", () => {
    it("should return a project by id", async () => {
      const created = await request(app).post("/projects").send({
        name: "Torre Vasco da Gama",
        location: "Parque das Nações, Lisboa",
        startDate: "2026-01-15",
      });

      const res = await request(app).get(`/projects/${created.body.id}`);

      expect(res.status).toBe(200);
      expect(res.body.id).toBe(created.body.id);
    });

    it("should return 404 for a non-existent project", async () => {
      const res = await request(app).get("/projects/non-existent-id");

      expect(res.status).toBe(404);
    });
  });

  describe("PUT /projects/:id", () => {
    it("should update a project", async () => {
      const created = await request(app).post("/projects").send({
        name: "Torre Vasco da Gama",
        location: "Parque das Nações, Lisboa",
        startDate: "2026-01-15",
      });

      const res = await request(app)
        .put(`/projects/${created.body.id}`)
        .send({ status: "ON_HOLD" });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe("ON_HOLD");
    });

    it("should return 404 for a non-existent project", async () => {
      const res = await request(app)
        .put("/projects/non-existent-id")
        .send({ status: "ON_HOLD" });

      expect(res.status).toBe(404);
    });
  });

  describe("DELETE /projects/:id", () => {
    it("should delete a project", async () => {
      const created = await request(app).post("/projects").send({
        name: "Torre Vasco da Gama",
        location: "Parque das Nações, Lisboa",
        startDate: "2026-01-15",
      });

      const res = await request(app).delete(`/projects/${created.body.id}`);
      expect(res.status).toBe(204);

      const check = await request(app).get(`/projects/${created.body.id}`);
      expect(check.status).toBe(404);
    });

    it("should return 404 for a non-existent project", async () => {
      const res = await request(app).delete("/projects/non-existent-id");
      expect(res.status).toBe(404);
    });
  });
});
