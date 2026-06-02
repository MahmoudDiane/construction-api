import { Router } from "express";
import * as DailySheetController from "./daily-sheets.controller";

const router = Router();

router.get("/", DailySheetController.getAllSheets);
router.get("/:id", DailySheetController.getSheetById);
router.post("/", DailySheetController.createSheet);
router.post("/:id/workers", DailySheetController.addWorkerToSheet);
router.post("/:id/equipment", DailySheetController.addEquipmentToSheet);
router.post("/:id/materials", DailySheetController.addMaterialToSheet);
router.patch("/:id/status", DailySheetController.updateSheetStatus);
router.delete("/:id", DailySheetController.deleteSheet);

export default router;
