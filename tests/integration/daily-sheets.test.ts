import request from "supertest";
import app from "../../src/app";
import { describe, it, expect, beforeEach } from "@jest/globals";

describe("Daily Sheets API", () => {
  let projectId: string;
  let workerId: string;
  let equipmentId: string;
  let materialId: string;

  beforeEach(async () => {
    const project = await request(app).post("/projects").send({
      name: "Test Project",
      location: "Lisboa",
      startDate: "2026-01-01",
    });
    projectId = project.body.id;

    const worker = await request(app).post("/workers").send({
      name: "João Silva",
      role: "Carpenter",
    });
    workerId = worker.body.id;

    const equipment = await request(app).post("/equipment").send({
      name: "Excavator",
      type: "Heavy Machinery",
    });
    equipmentId = equipment.body.id;

    const material = await request(app).post("/materials").send({
      name: "Portland Cement",
      unit: "bags",
      stock: 100,
    });
    materialId = material.body.id;
  });

  describe("POST /daily-sheets", () => {
    it("should create a daily sheet with valid data", async () => {
      const res = await request(app).post("/daily-sheets").send({
        projectId,
        date: "2026-06-01",
      });

      expect(res.status).toBe(201);
      expect(res.body.id).toBeDefined();
      expect(res.body.status).toBe("DRAFT");
      expect(res.body.projectId).toBe(projectId);
    });

    it("should return 400 when projectId is missing", async () => {
      const res = await request(app).post("/daily-sheets").send({
        date: "2026-06-01",
      });
      expect(res.status).toBe(400);
    });

    it("should return 400 when date is missing", async () => {
      const res = await request(app).post("/daily-sheets").send({ projectId });
      expect(res.status).toBe(400);
    });

    it("should return 404 for a non-existent project", async () => {
      const res = await request(app).post("/daily-sheets").send({
        projectId: "non-existent-id",
        date: "2026-06-01",
      });
      expect(res.status).toBe(404);
    });
  });

  describe("POST /daily-sheets/:id/workers", () => {
    it("should add a worker to a sheet", async () => {
      const sheet = await request(app).post("/daily-sheets").send({
        projectId,
        date: "2026-06-01",
      });

      const res = await request(app)
        .post(`/daily-sheets/${sheet.body.id}/workers`)
        .send({ workerId, hoursWorked: 8 });

      expect(res.status).toBe(201);
      expect(res.body.workerId).toBe(workerId);
      expect(res.body.hoursWorked).toBe(8);
    });

    it("should return 409 when worker is already allocated on the same date", async () => {
      const sheet1 = await request(app).post("/daily-sheets").send({
        projectId,
        date: "2026-06-01",
      });
      const sheet2 = await request(app).post("/daily-sheets").send({
        projectId,
        date: "2026-06-01",
      });

      await request(app)
        .post(`/daily-sheets/${sheet1.body.id}/workers`)
        .send({ workerId, hoursWorked: 8 });

      const res = await request(app)
        .post(`/daily-sheets/${sheet2.body.id}/workers`)
        .send({ workerId, hoursWorked: 4 });

      expect(res.status).toBe(409);
      expect(res.body.error).toBe("Worker is already allocated on this date");
    });

    it("should return 409 when trying to edit a submitted sheet", async () => {
      const sheet = await request(app).post("/daily-sheets").send({
        projectId,
        date: "2026-06-01",
      });

      await request(app)
        .patch(`/daily-sheets/${sheet.body.id}/status`)
        .send({ status: "SUBMITTED" });

      const res = await request(app)
        .post(`/daily-sheets/${sheet.body.id}/workers`)
        .send({ workerId, hoursWorked: 8 });

      expect(res.status).toBe(409);
      expect(res.body.error).toBe("Sheet can only be edited in DRAFT status");
    });
  });

  describe("POST /daily-sheets/:id/materials", () => {
    it("should add a material to a sheet", async () => {
      const sheet = await request(app).post("/daily-sheets").send({
        projectId,
        date: "2026-06-01",
      });

      const res = await request(app)
        .post(`/daily-sheets/${sheet.body.id}/materials`)
        .send({ materialId, quantity: 10 });

      expect(res.status).toBe(201);
      expect(res.body.quantity).toBe(10);
    });

    it("should return 409 when quantity exceeds stock", async () => {
      const sheet = await request(app).post("/daily-sheets").send({
        projectId,
        date: "2026-06-01",
      });

      const res = await request(app)
        .post(`/daily-sheets/${sheet.body.id}/materials`)
        .send({ materialId, quantity: 999 });

      expect(res.status).toBe(409);
      expect(res.body.error).toBe("Insufficient stock for this material");
    });
  });

  describe("PATCH /daily-sheets/:id/status", () => {
    it("should submit a draft sheet", async () => {
      const sheet = await request(app).post("/daily-sheets").send({
        projectId,
        date: "2026-06-01",
      });

      const res = await request(app)
        .patch(`/daily-sheets/${sheet.body.id}/status`)
        .send({ status: "SUBMITTED" });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe("SUBMITTED");
    });

    it("should approve a submitted sheet and deduct stock", async () => {
      const sheet = await request(app).post("/daily-sheets").send({
        projectId,
        date: "2026-06-01",
      });

      await request(app)
        .post(`/daily-sheets/${sheet.body.id}/materials`)
        .send({ materialId, quantity: 10 });

      await request(app)
        .patch(`/daily-sheets/${sheet.body.id}/status`)
        .send({ status: "SUBMITTED" });

      const res = await request(app)
        .patch(`/daily-sheets/${sheet.body.id}/status`)
        .send({ status: "APPROVED" });

      expect(res.status).toBe(200);

      const material = await request(app).get(`/materials/${materialId}`);
      expect(material.body.stock).toBe(90);
    });

    it("should return 409 when approving a draft sheet directly", async () => {
      const sheet = await request(app).post("/daily-sheets").send({
        projectId,
        date: "2026-06-01",
      });

      const res = await request(app)
        .patch(`/daily-sheets/${sheet.body.id}/status`)
        .send({ status: "APPROVED" });

      expect(res.status).toBe(409);
      expect(res.body.error).toBe("Sheet must be SUBMITTED before approving");
    });

    it("should return 409 when trying to edit an approved sheet", async () => {
      const sheet = await request(app).post("/daily-sheets").send({
        projectId,
        date: "2026-06-01",
      });

      await request(app)
        .patch(`/daily-sheets/${sheet.body.id}/status`)
        .send({ status: "SUBMITTED" });

      await request(app)
        .patch(`/daily-sheets/${sheet.body.id}/status`)
        .send({ status: "APPROVED" });

      const res = await request(app)
        .post(`/daily-sheets/${sheet.body.id}/workers`)
        .send({ workerId, hoursWorked: 8 });

      expect(res.status).toBe(409);
    });
  });
});
