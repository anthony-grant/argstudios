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
  const fn = new Function(`${body}\nreturn { projects, additionalImages, homeHero };`);
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
          video: contentSource.video || "",
          overlayColor: contentSource.overlayColor || "",
          overlayOpacity: typeof contentSource.overlayOpacity === "number" ? contentSource.overlayOpacity : 0,
          overlayBlendMode: contentSource.overlayBlendMode || "normal",
          backgroundColor: contentSource.backgroundColor || "",
          gallery: contentSource.gallery || [],
          galleryModal: Boolean(contentSource.galleryModal),
          // Back-compat: older content may still have a single `demo` object
          // instead of a `demos` array.
          demos: Array.isArray(contentSource.demos)
            ? contentSource.demos
            : contentSource.demo
            ? [contentSource.demo]
            : [],
        };
      });

    const pinned = data.projects.find((p) => p.slug === "additional-projects") || {};
    const additionalProjects = {
      title: pinned.title || "Additional Projects",
      category: pinned.category || "",
      description: pinned.description || "",
      img: pinned.img || "",
      video: pinned.video || "",
      overlayColor: pinned.overlayColor || "",
      overlayOpacity: typeof pinned.overlayOpacity === "number" ? pinned.overlayOpacity : 0,
      overlayBlendMode: pinned.overlayBlendMode || "normal",
      backgroundColor: pinned.backgroundColor || "",
      tags: pinned.tags || [],
    };
    const additionalImages = (data.additionalImages || []).map((img) => ({
      slug: img.slug || "",
      src: img.src || "",
      label: img.label || "",
      tags: img.tags || [],
      description: img.description || "",
      linkUrl: img.linkUrl || "",
      linkLabel: img.linkLabel || "",
      extraImages: Array.isArray(img.extraImages) ? img.extraImages : [],
    }));

    const homeHero = data.homeHero || {};
    const homeHeroOut = {
      introText: homeHero.introText || "",
      backgroundColor: homeHero.backgroundColor || "",
      navLinks: Array.isArray(homeHero.navLinks) ? homeHero.navLinks : [],
      profileImage: homeHero.profileImage || "",
      profileTooltip: homeHero.profileTooltip || "",
    };

    res.status(200).json({ projects, additionalProjects, additionalImages, homeHero: homeHeroOut });
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to load project data" });
  }
}
