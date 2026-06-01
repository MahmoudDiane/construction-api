import { Request, Response } from "express";
import * as ProjectService from "./projects.service";

export const getAllProjects = async (req: Request, res: Response) => {
  try {
    const projects = await ProjectService.getAll();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch projects" });
  }
};

export const getProjectById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const project = await ProjectService.getById(id);
    if (!project) {
      res.status(404).json({ error: "Project not found" });
      return;
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch project" });
  }
};

export const createProject = async (req: Request, res: Response) => {
  try {
    const { name, location, startDate, endDate } = req.body;
    if (!name || !location || !startDate) {
      res
        .status(400)
        .json({ error: "name, location and startDate are required" });
      return;
    }
    const project = await ProjectService.create({
      name,
      location,
      startDate,
      endDate,
    });
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: "Failed to create project" });
  }
};

export const updateProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const project = await ProjectService.getById(id);
    if (!project) {
      res.status(404).json({ error: "Project not found" });
      return;
    }
    const updated = await ProjectService.update(id, req.body);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "Failed to update project" });
  }
};

export const deleteProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const project = await ProjectService.getById(id);
    if (!project) {
      res.status(404).json({ error: "Project not found" });
      return;
    }
    await ProjectService.remove(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete project" });
  }
};
