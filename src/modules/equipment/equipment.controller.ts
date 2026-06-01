import { Request, Response } from "express";
import * as EquipmentService from "./equipment.service";

export const getAllEquipment = async (req: Request, res: Response) => {
  try {
    const equipment = await EquipmentService.getAll();
    res.json(equipment);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch equipment" });
  }
};

export const getEquipmentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const equipment = await EquipmentService.getById(id);
    if (!equipment) {
      res.status(404).json({ error: "Equipment not found" });
      return;
    }
    res.json(equipment);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch equipment" });
  }
};

export const createEquipment = async (req: Request, res: Response) => {
  try {
    const { name, type, plate } = req.body;
    if (!name || !type) {
      res.status(400).json({ error: "name and type are required" });
      return;
    }
    const equipment = await EquipmentService.create({ name, type, plate });
    res.status(201).json(equipment);
  } catch (error) {
    res.status(500).json({ error: "Failed to create equipment" });
  }
};

export const updateEquipment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const equipment = await EquipmentService.getById(id);
    if (!equipment) {
      res.status(404).json({ error: "Equipment not found" });
      return;
    }
    const updated = await EquipmentService.update(id, req.body);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "Failed to update equipment" });
  }
};

export const deleteEquipment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const equipment = await EquipmentService.getById(id);
    if (!equipment) {
      res.status(404).json({ error: "Equipment not found" });
      return;
    }
    await EquipmentService.remove(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete equipment" });
  }
};
