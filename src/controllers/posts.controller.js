import * as posts from "../services/posts.service.js";

function parseId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function handleError(res, error) {
  if (error?.code === "P2025") return res.status(404).json({ error: "Post not found" });
  console.error(error);
  return res.status(500).json({ error: "Internal server error" });
}

export async function create(req, res) {
  const { imageUrl, caption, location } = req.body ?? {};
  if (!imageUrl) return res.status(400).json({ error: "imageUrl is required" });
  try {
    const post = await posts.createPost({ imageUrl, ...(caption !== undefined ? { caption } : {}), ...(location !== undefined ? { location } : {}) });
    return res.status(201).json(post);
  } catch (error) {
    return handleError(res, error);
  }
}

export async function list(_req, res) {
  try {
    return res.status(200).json(await posts.listPosts());
  } catch (error) {
    return handleError(res, error);
  }
}

export async function getOne(req, res) {
  const id = parseId(req.params.id);
  if (id === null) return res.status(404).json({ error: "Post not found" });
  try {
    const post = await posts.getPostById(id);
    if (!post) return res.status(404).json({ error: "Post not found" });
    return res.status(200).json(post);
  } catch (error) {
    return handleError(res, error);
  }
}

export async function update(req, res) {
  const id = parseId(req.params.id);
  if (id === null) return res.status(404).json({ error: "Post not found" });
  const { caption, location } = req.body ?? {};
  const data = {};
  if (caption !== undefined) data.caption = caption;
  if (location !== undefined) data.location = location;
  try {
    return res.status(200).json(await posts.updatePost(id, data));
  } catch (error) {
    return handleError(res, error);
  }
}

export async function remove(req, res) {
  const id = parseId(req.params.id);
  if (id === null) return res.status(404).json({ error: "Post not found" });
  try {
    await posts.deletePost(id);
    return res.status(204).end();
  } catch (error) {
    return handleError(res, error);
  }
}
