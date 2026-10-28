import prisma from "../db.js";

export function createUser(data) {
  return prisma.user.create({ data });
}

export function listUsers() {
  return prisma.user.findMany();
}

export function getUserById(id) {
  return prisma.user.findUnique({ where: { id } });
}

export function updateUser(id, data) {
  return prisma.user.update({ where: { id }, data });
}

export function deleteUser(id) {
  return prisma.user.delete({ where: { id } });
}
