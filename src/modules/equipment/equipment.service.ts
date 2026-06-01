import { prisma } from "../../lib/prisma";

export const getAll = async () => {
  return prisma.equipment.findMany({
    orderBy: { createdAt: "desc" },
  });
};

export const getById = async (id: string) => {
  return prisma.equipment.findUnique({
    where: { id },
  });
};

export const create = async (data: {
  name: string;
  type: string;
  plate?: string;
}) => {
  return prisma.equipment.create({ data });
};

export const update = async (
  id: string,
  data: {
    name?: string;
    type?: string;
    plate?: string;
    active?: boolean;
  },
) => {
  return prisma.equipment.update({
    where: { id },
    data,
  });
};

export const remove = async (id: string) => {
  return prisma.equipment.delete({
    where: { id },
  });
};
