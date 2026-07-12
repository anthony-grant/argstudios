// Vercel serverless function — server only. Accepts an image (as a data
// URL) from the /admin panel and commits it straight into the repo under
// public/uploads/, so it becomes a normal static asset the next time
// Vercel rebuilds (same auto-deploy pipeline as everything else).
//
// Requires the same ADMIN_PASSWORD and GITHUB_TOKEN env vars as the other
// admin endpoints.

const REPO = "anthony-grant/argstudios";
const MAX_BYTES = 3.5 * 1024 * 1024; // stay under Vercel's ~4.5MB request body limit

const EXT_BY_MIME = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/svg+xml": "svg",
};

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60) || "image";
}

async function ghPutNew(path, base64Content, message) {
  const res = await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      "User-Agent": "argstudios-admin",
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message, content: base64Content, branch: "main" }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub PUT ${path} failed: ${res.status} ${text}`);
  }
  return res.json();
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }
  if (!process.env.ADMIN_PASSWORD) {
    res.status(500).json({ error: "Admin panel not configured (missing ADMIN_PASSWORD)" });
    return;
  }
  if (!process.env.GITHUB_TOKEN) {
    res.status(500).json({ error: "Admin panel not configured (missing GITHUB_TOKEN)" });
    return;
  }

  const { password, filename, dataUrl } = req.body || {};
  if (password !== process.env.ADMIN_PASSWORD) {
    res.status(401).json({ error: "Incorrect password" });
    return;
  }

  const match = typeof dataUrl === "string" && dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) {
    res.status(400).json({ error: "Invalid file data" });
    return;
  }
  const [, mime, base64] = match;
  const ext = EXT_BY_MIME[mime];
  if (!ext) {
    res.status(400).json({ error: `Unsupported image type: ${mime}` });
    return;
  }

  const byteLength = Math.ceil((base64.length * 3) / 4);
  if (byteLength > MAX_BYTES) {
    res.status(400).json({ error: "Image is too large — please use one under ~3.5MB" });
    return;
  }

  const safeName = `${slugify(filename || "image")}-${Date.now()}.${ext}`;
  const repoPath = `public/uploads/${safeName}`;

  try {
    await ghPutNew(repoPath, base64, `Admin panel: upload ${safeName}`);
    res.status(200).json({ url: `/uploads/${safeName}` });
  } catch (err) {
    res.status(500).json({ error: err.message || "Upload failed" });
  }
}
