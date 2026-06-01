import { Request, Response } from "express";
import * as MaterialService from "./materials.service";

export const getAllMaterials = async (req: Request, res: Response) => {
  try {
    const materials = await MaterialService.getAll();
    res.json(materials);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch materials" });
  }
};

export const getMaterialById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const material = await MaterialService.getById(id);
    if (!material) {
      res.status(404).json({ error: "Material not found" });
      return;
    }
    res.json(material);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch material" });
  }
};

export const createMaterial = async (req: Request, res: Response) => {
  try {
    const { name, unit, stock } = req.body;
    if (!name || !unit) {
      res.status(400).json({ error: "name and unit are required" });
      return;
    }
    const material = await MaterialService.create({ name, unit, stock });
    res.status(201).json(material);
  } catch (error) {
    res.status(500).json({ error: "Failed to create material" });
  }
};

export const updateMaterial = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const material = await MaterialService.getById(id);
    if (!material) {
      res.status(404).json({ error: "Material not found" });
      return;
    }
    const updated = await MaterialService.update(id, req.body);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "Failed to update material" });
  }
};

export const deleteMaterial = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const material = await MaterialService.getById(id);
    if (!material) {
      res.status(404).json({ error: "Material not found" });
      return;
    }
    await MaterialService.remove(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete material" });
  }
};
