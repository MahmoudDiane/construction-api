import "dotenv/config";
import express from "express";
import projectsRouter from "./modules/projects/projects.router";
import workersRouter from "./modules/workers/workers.router";
import equipmentRouter from "./modules/equipment/equipment.router";
import materialsRouter from "./modules/materials/materials.router";
import dailySheetsRouter from "./modules/daily-sheets/daily-sheets.router";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/projects", projectsRouter);
app.use("/workers", workersRouter);
app.use("/equipment", equipmentRouter);
app.use("/materials", materialsRouter);
app.use("/daily-sheets", dailySheetsRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
