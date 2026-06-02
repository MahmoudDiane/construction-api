import * as dotenv from "dotenv";
dotenv.config();

process.env.DATABASE_URL = process.env.TEST_DATABASE_URL!;

import { prisma } from "../src/lib/prisma";

beforeEach(async () => {
  await prisma.workerAllocation.deleteMany();
  await prisma.equipmentAllocation.deleteMany();
  await prisma.materialAllocation.deleteMany();
  await prisma.dailySheet.deleteMany();
  await prisma.worker.deleteMany();
  await prisma.equipment.deleteMany();
  await prisma.material.deleteMany();
  await prisma.project.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});
