import { prisma } from "../../lib/prisma";

export const getAll = async () => {
  return prisma.material.findMany({
    orderBy: { createdAt: "desc" },
  });
};

export const getById = async (id: string) => {
  return prisma.material.findUnique({
    where: { id },
  });
};

export const create = async (data: {
  name: string;
  unit: string;
  stock?: number;
}) => {
  return prisma.material.create({ data });
};

export const update = async (
  id: string,
  data: {
    name?: string;
    unit?: string;
    stock?: number;
  },
) => {
  return prisma.material.update({
    where: { id },
    data,
  });
};

export const remove = async (id: string) => {
  return prisma.material.delete({
    where: { id },
  });
};
