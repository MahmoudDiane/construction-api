import { Router } from "express";
import * as WorkerController from "./workers.controller";

const router = Router();

router.get("/", WorkerController.getAllWorkers);
router.get("/:id", WorkerController.getWorkerById);
router.post("/", WorkerController.createWorker);
router.put("/:id", WorkerController.updateWorker);
router.delete("/:id", WorkerController.deleteWorker);

export default router;
