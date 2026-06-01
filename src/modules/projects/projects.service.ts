import { prisma } from "../../lib/prisma";
import { ProjectStatus } from "@prisma/client";

export const getAll = async () => {
  return prisma.project.findMany({
    orderBy: { createdAt: "desc" },
  });
};

export const getById = async (id: string) => {
  return prisma.project.findUnique({
    where: { id },
  });
};

export const create = async (data: {
  name: string;
  location: string;
  startDate: string;
  endDate?: string;
}) => {
  return prisma.project.create({
    data: {
      name: data.name,
      location: data.location,
      startDate: new Date(data.startDate),
      endDate: data.endDate ? new Date(data.endDate) : undefined,
    },
  });
};

export const update = async (
  id: string,
  data: {
    name?: string;
    location?: string;
    status?: ProjectStatus;
    endDate?: string;
  },
) => {
  return prisma.project.update({
    where: { id },
    data: {
      ...data,
      endDate: data.endDate ? new Date(data.endDate) : undefined,
    },
  });
};

export const remove = async (id: string) => {
  return prisma.project.delete({
    where: { id },
  });
};
