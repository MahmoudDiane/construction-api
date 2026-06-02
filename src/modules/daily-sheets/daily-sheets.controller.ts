import { Request, Response } from "express";
import * as DailySheetService from "./daily-sheets.service";

export const getAllSheets = async (req: Request, res: Response) => {
  try {
    const sheets = await DailySheetService.getAll();
    res.json(sheets);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch daily sheets" });
  }
};

export const getSheetById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const sheet = await DailySheetService.getById(id);
    if (!sheet) {
      res.status(404).json({ error: "Daily sheet not found" });
      return;
    }
    res.json(sheet);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch daily sheet" });
  }
};

export const createSheet = async (req: Request, res: Response) => {
  try {
    const { projectId, date, notes } = req.body;
    if (!projectId || !date) {
      res.status(400).json({ error: "projectId and date are required" });
      return;
    }
    const sheet = await DailySheetService.create({ projectId, date, notes });
    res.status(201).json(sheet);
  } catch (error: any) {
    if (error.message === "PROJECT_NOT_FOUND") {
      res.status(404).json({ error: "Project not found" });
      return;
    }
    res.status(500).json({ error: "Failed to create daily sheet" });
  }
};

export const addWorkerToSheet = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const { workerId, hoursWorked } = req.body;
    if (!workerId || hoursWorked === undefined) {
      res.status(400).json({ error: "workerId and hoursWorked are required" });
      return;
    }
    const allocation = await DailySheetService.addWorker(
      id,
      workerId,
      hoursWorked,
    );
    res.status(201).json(allocation);
  } catch (error: any) {
    const errorMap: Record<string, [number, string]> = {
      SHEET_NOT_FOUND: [404, "Daily sheet not found"],
      SHEET_NOT_EDITABLE: [409, "Sheet can only be edited in DRAFT status"],
      WORKER_NOT_FOUND: [404, "Worker not found"],
      WORKER_ALREADY_ALLOCATED: [
        409,
        "Worker is already allocated on this date",
      ],
    };
    const [status, message] = errorMap[error.message] ?? [
      500,
      "Failed to add worker",
    ];
    res.status(status).json({ error: message });
  }
};

export const addEquipmentToSheet = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const { equipmentId, hoursUsed } = req.body;
    if (!equipmentId || hoursUsed === undefined) {
      res.status(400).json({ error: "equipmentId and hoursUsed are required" });
      return;
    }
    const allocation = await DailySheetService.addEquipment(
      id,
      equipmentId,
      hoursUsed,
    );
    res.status(201).json(allocation);
  } catch (error: any) {
    const errorMap: Record<string, [number, string]> = {
      SHEET_NOT_FOUND: [404, "Daily sheet not found"],
      SHEET_NOT_EDITABLE: [409, "Sheet can only be edited in DRAFT status"],
      EQUIPMENT_NOT_FOUND: [404, "Equipment not found"],
      EQUIPMENT_ALREADY_ALLOCATED: [
        409,
        "Equipment is already allocated on this date",
      ],
    };
    const [status, message] = errorMap[error.message] ?? [
      500,
      "Failed to add equipment",
    ];
    res.status(status).json({ error: message });
  }
};

export const addMaterialToSheet = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const { materialId, quantity } = req.body;
    if (!materialId || quantity === undefined) {
      res.status(400).json({ error: "materialId and quantity are required" });
      return;
    }
    const allocation = await DailySheetService.addMaterial(
      id,
      materialId,
      quantity,
    );
    res.status(201).json(allocation);
  } catch (error: any) {
    const errorMap: Record<string, [number, string]> = {
      SHEET_NOT_FOUND: [404, "Daily sheet not found"],
      SHEET_NOT_EDITABLE: [409, "Sheet can only be edited in DRAFT status"],
      MATERIAL_NOT_FOUND: [404, "Material not found"],
      INSUFFICIENT_STOCK: [409, "Insufficient stock for this material"],
    };
    const [status, message] = errorMap[error.message] ?? [
      500,
      "Failed to add material",
    ];
    res.status(status).json({ error: message });
  }
};

export const updateSheetStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const { status } = req.body;
    if (!status) {
      res.status(400).json({ error: "status is required" });
      return;
    }
    const sheet = await DailySheetService.updateStatus(id, status);
    res.json(sheet);
  } catch (error: any) {
    const errorMap: Record<string, [number, string]> = {
      SHEET_NOT_FOUND: [404, "Daily sheet not found"],
      SHEET_ALREADY_APPROVED: [409, "Sheet is already approved"],
      SHEET_NOT_DRAFT: [409, "Sheet must be in DRAFT to submit"],
      SHEET_NOT_SUBMITTED: [409, "Sheet must be SUBMITTED before approving"],
    };
    const [status, message] = errorMap[error.message] ?? [
      500,
      "Failed to update status",
    ];
    res.status(status).json({ error: message });
  }
};

export const deleteSheet = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    await DailySheetService.remove(id);
    res.status(204).send();
  } catch (error: any) {
    const errorMap: Record<string, [number, string]> = {
      SHEET_NOT_FOUND: [404, "Daily sheet not found"],
      SHEET_NOT_EDITABLE: [409, "Only DRAFT sheets can be deleted"],
    };
    const [status, message] = errorMap[error.message] ?? [
      500,
      "Failed to delete sheet",
    ];
    res.status(status).json({ error: message });
  }
};
