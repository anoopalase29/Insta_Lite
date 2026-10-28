import * as users from "../services/users.service.js";

function parseId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function handleError(res, error) {
  if (error?.code === "P2002") {
    return res.status(409).json({ error: "username or email already taken" });
  }
  if (error?.code === "P2025") {
    return res.status(404).json({ error: "User not found" });
  }
  console.error(error);
  return res.status(500).json({ error: "Internal server error" });
}

export async function create(req, res) {
  const { username, email, fullname, bio } = req.body ?? {};
  if (!username || !email || !fullname) {
    return res.status(400).json({ error: "username, email and fullname are required" });
  }

  try {
    const user = await users.createUser({ username, email, fullname, ...(bio !== undefined ? { bio } : {}) });
    return res.status(201).json(user);
  } catch (error) {
    return handleError(res, error);
  }
}

export async function list(_req, res) {
  try {
    return res.status(200).json(await users.listUsers());
  } catch (error) {
    return handleError(res, error);
  }
}

export async function getOne(req, res) {
  const id = parseId(req.params.id);
  if (id === null) return res.status(404).json({ error: "User not found" });
  try {
    const user = await users.getUserById(id);
    if (!user) return res.status(404).json({ error: "User not found" });
    return res.status(200).json(user);
  } catch (error) {
    return handleError(res, error);
  }
}

export async function update(req, res) {
  const id = parseId(req.params.id);
  if (id === null) return res.status(404).json({ error: "User not found" });
  const { fullname, bio, isPrivate } = req.body ?? {};
  const data = {};
  if (fullname !== undefined) data.fullname = fullname;
  if (bio !== undefined) data.bio = bio;
  if (isPrivate !== undefined) data.isPrivate = isPrivate;

  try {
    return res.status(200).json(await users.updateUser(id, data));
  } catch (error) {
    return handleError(res, error);
  }
}

export async function remove(req, res) {
  const id = parseId(req.params.id);
  if (id === null) return res.status(404).json({ error: "User not found" });
  try {
    await users.deleteUser(id);
    return res.status(204).end();
  } catch (error) {
    return handleError(res, error);
  }
}
