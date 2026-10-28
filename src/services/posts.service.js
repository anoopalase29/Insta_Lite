import prisma from "../db.js";

export function createPost(data) {
  return prisma.post.create({ data });
}

export function listPosts() {
  return prisma.post.findMany();
}

export function getPostById(id) {
  return prisma.post.findUnique({ where: { id } });
}

export function updatePost(id, data) {
  return prisma.post.update({ where: { id }, data });
}

export function deletePost(id) {
  return prisma.post.delete({ where: { id } });
}
