// Vercel serverless function — server only. Returns the current project
// data (merging in protected content) so the /admin panel can edit it.
// Requires ADMIN_PASSWORD to be set in Vercel's Environment Variables.

const REPO = "anthony-grant/argstudios";

async function ghGet(path) {
  const res = await fetch(
    `https://api.github.com/repos/${REPO}/contents/${path}?ref=main`,
    {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        "User-Agent": "argstudios-admin",
        Accept: "application/vnd.github+json",
      },
    }
  );
  if (!res.ok) {
    throw new Error(`GitHub GET ${path} failed: ${res.status}`);
  }
  const json = await res.json();
  const content = Buffer.from(json.content, "base64").toString("utf-8");
  return { content, sha: json.sha };
}

// data.ts and (the old-format) protected.js are both plain JS module bodies
// with no TypeScript-only syntax, so we can safely evaluate them directly
// to get real objects back instead of hand-rolling a parser.
function parseDataTs(text) {
  const body = text.replace(/export const/g, "const");
  const fn = new Function(`${body}\nreturn { projects, additionalImages };`);
  return fn();
}

function parseProtected(text) {
  const match = text.match(/const PROTECTED = (\{[\s\S]*?\n\});/);
  if (!match) throw new Error("Could not parse api/protected.js");
  const fn = new Function(`return ${match[1]};`);
  return fn();
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

  const { password } = req.body || {};
  if (password !== process.env.ADMIN_PASSWORD) {
    res.status(401).json({ error: "Incorrect password" });
    return;
  }

  try {
    const [dataFile, protectedFile] = await Promise.all([
      ghGet("src/app/data.ts"),
      ghGet("api/protected.js"),
    ]);
    const data = parseDataTs(dataFile.content);
    const protectedMap = parseProtected(protectedFile.content);

    const projects = data.projects
      .filter((p) => p.slug !== "additional-projects")
      .map((p) => {
        const contentSource = p.protected ? protectedMap[p.slug]?.content || {} : p;
        return {
          slug: p.slug,
          title: p.title || "",
          category: p.category || "",
          tags: p.tags || [],
          protected: Boolean(p.protected),
          hasPassword: Boolean(p.protected && protectedMap[p.slug]?.password),
          description: contentSource.description || "",
          role: contentSource.role || "",
          approach: contentSource.approach || "",
          outcome: contentSource.outcome || "",
          metric: contentSource.metric || null,
          img: contentSource.img || "",
          gallery: contentSource.gallery || [],
        };
      });

    res.status(200).json({ projects });
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to load project data" });
  }
}
