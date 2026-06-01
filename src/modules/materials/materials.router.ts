import { Router } from "express";
import * as MaterialController from "./materials.controller";

const router = Router();

router.get("/", MaterialController.getAllMaterials);
router.get("/:id", MaterialController.getMaterialById);
router.post("/", MaterialController.createMaterial);
router.put("/:id", MaterialController.updateMaterial);
router.delete("/:id", MaterialController.deleteMaterial);

export default router;
