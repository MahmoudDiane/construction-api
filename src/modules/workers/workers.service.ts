import { prisma } from "../../lib/prisma";

export const getAll = async () => {
  return prisma.worker.findMany({
    orderBy: { createdAt: "desc" },
  });
};

export const getById = async (id: string) => {
  return prisma.worker.findUnique({
    where: { id },
  });
};

export const create = async (data: {
  name: string;
  role: string;
  phone?: string;
}) => {
  return prisma.worker.create({ data });
};

export const update = async (
  id: string,
  data: {
    name?: string;
    role?: string;
    phone?: string;
    active?: boolean;
  },
) => {
  return prisma.worker.update({
    where: { id },
    data,
  });
};

export const remove = async (id: string) => {
  return prisma.worker.delete({
    where: { id },
  });
};
