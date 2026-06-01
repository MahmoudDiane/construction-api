import { Request, Response } from "express";
import * as WorkerService from "./workers.service";

export const getAllWorkers = async (req: Request, res: Response) => {
  try {
    const workers = await WorkerService.getAll();
    res.json(workers);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch workers" });
  }
};

export const getWorkerById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const worker = await WorkerService.getById(id);
    if (!worker) {
      res.status(404).json({ error: "Worker not found" });
      return;
    }
    res.json(worker);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch worker" });
  }
};

export const createWorker = async (req: Request, res: Response) => {
  try {
    const { name, role, phone } = req.body;
    if (!name || !role) {
      res.status(400).json({ error: "name and role are required" });
      return;
    }
    const worker = await WorkerService.create({ name, role, phone });
    res.status(201).json(worker);
  } catch (error) {
    res.status(500).json({ error: "Failed to create worker" });
  }
};

export const updateWorker = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const worker = await WorkerService.getById(id);
    if (!worker) {
      res.status(404).json({ error: "Worker not found" });
      return;
    }
    const updated = await WorkerService.update(id, req.body);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "Failed to update worker" });
  }
};

export const deleteWorker = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const worker = await WorkerService.getById(id);
    if (!worker) {
      res.status(404).json({ error: "Worker not found" });
      return;
    }
    await WorkerService.remove(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete worker" });
  }
};
