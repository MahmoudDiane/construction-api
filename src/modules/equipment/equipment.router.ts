import { Router } from "express";
import * as EquipmentController from "./equipment.controller";

const router = Router();

router.get("/", EquipmentController.getAllEquipment);
router.get("/:id", EquipmentController.getEquipmentById);
router.post("/", EquipmentController.createEquipment);
router.put("/:id", EquipmentController.updateEquipment);
router.delete("/:id", EquipmentController.deleteEquipment);

export default router;
