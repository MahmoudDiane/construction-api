import { prisma } from "../../lib/prisma";
import { SheetStatus } from "@prisma/client";

export const getAll = async () => {
  return prisma.dailySheet.findMany({
    orderBy: { date: "desc" },
    include: {
      project: { select: { id: true, name: true } },
      workers: { include: { worker: true } },
      equipment: { include: { equipment: true } },
      materials: { include: { material: true } },
    },
  });
};

export const getById = async (id: string) => {
  return prisma.dailySheet.findUnique({
    where: { id },
    include: {
      project: { select: { id: true, name: true } },
      workers: { include: { worker: true } },
      equipment: { include: { equipment: true } },
      materials: { include: { material: true } },
    },
  });
};

export const create = async (data: {
  projectId: string;
  date: string;
  notes?: string;
}) => {
  const project = await prisma.project.findUnique({
    where: { id: data.projectId },
  });
  if (!project) throw new Error("PROJECT_NOT_FOUND");

  return prisma.dailySheet.create({
    data: {
      projectId: data.projectId,
      date: new Date(data.date),
      notes: data.notes,
    },
  });
};

export const addWorker = async (
  sheetId: string,
  workerId: string,
  hoursWorked: number,
) => {
  const sheet = await prisma.dailySheet.findUnique({ where: { id: sheetId } });
  if (!sheet) throw new Error("SHEET_NOT_FOUND");
  if (sheet.status !== SheetStatus.DRAFT) throw new Error("SHEET_NOT_EDITABLE");

  const worker = await prisma.worker.findUnique({ where: { id: workerId } });
  if (!worker) throw new Error("WORKER_NOT_FOUND");

  // Check double-booking
  const conflict = await prisma.workerAllocation.findFirst({
    where: {
      workerId,
      dailySheet: { date: sheet.date },
    },
  });
  if (conflict) throw new Error("WORKER_ALREADY_ALLOCATED");

  return prisma.workerAllocation.create({
    data: { dailySheetId: sheetId, workerId, hoursWorked },
  });
};

export const addEquipment = async (
  sheetId: string,
  equipmentId: string,
  hoursUsed: number,
) => {
  const sheet = await prisma.dailySheet.findUnique({ where: { id: sheetId } });
  if (!sheet) throw new Error("SHEET_NOT_FOUND");
  if (sheet.status !== SheetStatus.DRAFT) throw new Error("SHEET_NOT_EDITABLE");

  const equipment = await prisma.equipment.findUnique({
    where: { id: equipmentId },
  });
  if (!equipment) throw new Error("EQUIPMENT_NOT_FOUND");

  // Check double-booking
  const conflict = await prisma.equipmentAllocation.findFirst({
    where: {
      equipmentId,
      dailySheet: { date: sheet.date },
    },
  });
  if (conflict) throw new Error("EQUIPMENT_ALREADY_ALLOCATED");

  return prisma.equipmentAllocation.create({
    data: { dailySheetId: sheetId, equipmentId, hoursUsed },
  });
};

export const addMaterial = async (
  sheetId: string,
  materialId: string,
  quantity: number,
) => {
  const sheet = await prisma.dailySheet.findUnique({ where: { id: sheetId } });
  if (!sheet) throw new Error("SHEET_NOT_FOUND");
  if (sheet.status !== SheetStatus.DRAFT) throw new Error("SHEET_NOT_EDITABLE");

  const material = await prisma.material.findUnique({
    where: { id: materialId },
  });
  if (!material) throw new Error("MATERIAL_NOT_FOUND");

  if (material.stock < quantity) throw new Error("INSUFFICIENT_STOCK");

  return prisma.materialAllocation.create({
    data: { dailySheetId: sheetId, materialId, quantity },
  });
};

export const updateStatus = async (id: string, status: SheetStatus) => {
  const sheet = await prisma.dailySheet.findUnique({
    where: { id },
    include: { materials: true },
  });
  if (!sheet) throw new Error("SHEET_NOT_FOUND");

  if (sheet.status === SheetStatus.APPROVED)
    throw new Error("SHEET_ALREADY_APPROVED");
  if (status === SheetStatus.SUBMITTED && sheet.status !== SheetStatus.DRAFT) {
    throw new Error("SHEET_NOT_DRAFT");
  }
  if (
    status === SheetStatus.APPROVED &&
    sheet.status !== SheetStatus.SUBMITTED
  ) {
    throw new Error("SHEET_NOT_SUBMITTED");
  }

  // When approving, deduct stock for each material used
  if (status === SheetStatus.APPROVED) {
    await prisma.$transaction([
      ...sheet.materials.map((allocation) =>
        prisma.material.update({
          where: { id: allocation.materialId },
          data: { stock: { decrement: allocation.quantity } },
        }),
      ),
      prisma.dailySheet.update({
        where: { id },
        data: { status },
      }),
    ]);
    return prisma.dailySheet.findUnique({ where: { id } });
  }

  return prisma.dailySheet.update({
    where: { id },
    data: { status },
  });
};

export const remove = async (id: string) => {
  const sheet = await prisma.dailySheet.findUnique({ where: { id } });
  if (!sheet) throw new Error("SHEET_NOT_FOUND");
  if (sheet.status !== SheetStatus.DRAFT) throw new Error("SHEET_NOT_EDITABLE");

  return prisma.dailySheet.delete({ where: { id } });
};
