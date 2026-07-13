// Vercel serverless function — server only. Regenerates src/app/data.ts and
// api/protected.js and commits them straight to the main branch of the
// GitHub repo, which triggers the existing Vercel auto-deploy.
//
// Requires two Vercel Environment Variables:
//   ADMIN_PASSWORD — the password to unlock /admin
//   GITHUB_TOKEN    — a GitHub personal access token with write access to
//                      the contents of this repo

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

async function ghPut(path, content, sha, message) {
  const res = await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      "User-Agent": "argstudios-admin",
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
      content: Buffer.from(content, "utf-8").toString("base64"),
      sha,
      branch: "main",
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub PUT ${path} failed: ${res.status} ${text}`);
  }
  return res.json();
}

function parseDataTs(text) {
  const body = text.replace(/export const/g, "const");
  const fn = new Function(`${body}\nreturn { projects, additionalImages, homeHero };`);
  return fn();
}

function slugify(label) {
  return (label || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "item";
}

function parseProtected(text) {
  const match = text.match(/const PROTECTED = (\{[\s\S]*?\n\});/);
  if (!match) throw new Error("Could not parse api/protected.js");
  const fn = new Function(`return ${match[1]};`);
  return fn();
}

function renderDataTs(projects, additionalImages, homeHero) {
  return `export const CORAL = "#FF5A5F";
export const DARK = "#0C0C0B";
export const CREAM = "#F6F2EC";

// This file is managed by the /admin panel. Manual edits here will be
// overwritten the next time someone saves from there.
export const projects = ${JSON.stringify(projects, null, 2)};

// Each image can carry any number of role/type tags (e.g. "Brand", "Illustration",
// "Art Direction", "Package Design"). Tags populate the filter toggles on the
// Additional Projects page automatically — a toggle only appears once at least
// one image uses that tag. To tag an image, just add strings to its \`tags\` array.
// When an image has a \`description\`, its label renders as a clickable button on
// the gallery and it gets its own page at /work/additional-projects/:slug.
export const additionalImages = ${JSON.stringify(additionalImages, null, 2)};

export const homeHero = ${JSON.stringify(homeHero, null, 2)};
`;
}

function renderProtectedJs(protectedMap) {
  return `// Vercel serverless function — this file runs on the server only.
// It is never bundled into the client JavaScript, so the passwords and
// content below are not visible to site visitors until unlocked.
//
// Managed by the /admin panel — edit protected project content and
// passwords there instead of hand-editing this file.

const PROTECTED = ${JSON.stringify(protectedMap, null, 2)};

export default function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { slug, password } = req.body || {};
  const entry = PROTECTED[slug];

  if (!entry) {
    res.status(404).json({ error: "Not found" });
    return;
  }

  if (password !== entry.password) {
    res.status(401).json({ error: "Incorrect password" });
    return;
  }

  res.status(200).json(entry.content);
}
`;
}

function cleanMetric(m) {
  if (!m || !m.value) return null;
  return { value: m.value, label: m.label || "" };
}

// Up to 3 demo link buttons per project.
function cleanDemos(list) {
  if (!Array.isArray(list)) return [];
  return list
    .filter((d) => d && d.url)
    .slice(0, 3)
    .map((d) => ({ url: d.url, label: d.label || "View" }));
}

function bgFields(p) {
  return {
    video: p.video || "",
    overlayColor: p.overlayColor || "",
    overlayOpacity: typeof p.overlayOpacity === "number" ? p.overlayOpacity : 0,
    overlayBlendMode: p.overlayBlendMode || "normal",
    backgroundColor: p.backgroundColor || "",
  };
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

  const { password, projects: incoming, additionalProjects, additionalImages, homeHero: incomingHomeHero } = req.body || {};
  if (password !== process.env.ADMIN_PASSWORD) {
    res.status(401).json({ error: "Incorrect password" });
    return;
  }
  if (!Array.isArray(incoming) || incoming.length === 0) {
    res.status(400).json({ error: "No projects provided" });
    return;
  }

  try {
    const [dataFile, protectedFile] = await Promise.all([
      ghGet("src/app/data.ts"),
      ghGet("api/protected.js"),
    ]);
    const oldData = parseDataTs(dataFile.content);
    const oldProtected = parseProtected(protectedFile.content);

    const oldPinned = oldData.projects.find((p) => p.slug === "additional-projects");
    const pinnedSource = additionalProjects || oldPinned || {};

    const seenSlugs = new Set();
    const newDataProjects = [];
    const newProtected = {};

    incoming.forEach((p, i) => {
      const slug = (p.slug || "").trim();
      if (!slug || slug === "additional-projects") {
        throw new Error(`Invalid project slug: "${slug}"`);
      }
      if (seenSlugs.has(slug)) {
        throw new Error(`Duplicate slug: "${slug}"`);
      }
      seenSlugs.add(slug);

      const index = String(i + 1).padStart(2, "0");
      const base = {
        index,
        slug,
        title: p.title || "",
        category: p.category || "",
        tags: Array.isArray(p.tags) ? p.tags : [],
      };

      // Defensive: if a request comes from a browser tab that still has an
      // older admin bundle loaded (e.g. mid-deploy), it won't know about
      // newer fields and will simply omit them from the payload. Falling
      // back to the previously saved value in that case — rather than
      // treating "field not sent" the same as "field cleared" — avoids
      // silently wiping content like demo links on an unrelated save.
      const oldContentForSlug = p.protected
        ? oldProtected[slug]?.content || {}
        : oldData.projects.find((op) => op.slug === slug) || {};
      const demosToUse = Array.isArray(p.demos) ? p.demos : oldContentForSlug.demos || [];

      if (p.protected) {
        const pw = p.newPassword || oldProtected[slug]?.password;
        if (!pw) {
          throw new Error(`"${p.title || slug}" is marked protected but has no password set`);
        }
        newProtected[slug] = {
          password: pw,
          content: {
            description: p.description || "",
            role: p.role || "",
            approach: p.approach || "",
            outcome: p.outcome || "",
            metric: cleanMetric(p.metric),
            img: p.img || "",
            ...bgFields(p),
            gallery: Array.isArray(p.gallery) ? p.gallery : [],
            galleryModal: Boolean(p.galleryModal),
            demos: cleanDemos(demosToUse),
          },
        };
        newDataProjects.push({ ...base, protected: true });
      } else {
        newDataProjects.push({
          ...base,
          description: p.description || "",
          role: p.role || "",
          approach: p.approach || "",
          outcome: p.outcome || "",
          metric: cleanMetric(p.metric),
          img: p.img || "",
          ...bgFields(p),
          gallery: Array.isArray(p.gallery) ? p.gallery : [],
          galleryModal: Boolean(p.galleryModal),
          demos: cleanDemos(demosToUse),
        });
      }
    });

    newDataProjects.push({
      index: String(incoming.length + 1).padStart(2, "0"),
      slug: "additional-projects",
      title: pinnedSource.title || "Additional Projects",
      category: pinnedSource.category || "",
      description: pinnedSource.description || "",
      img: pinnedSource.img || "",
      ...bgFields(pinnedSource),
      tags: Array.isArray(pinnedSource.tags) ? pinnedSource.tags : [],
    });

    const usedSlugs = new Set();
    const newAdditionalImages = Array.isArray(additionalImages)
      ? additionalImages
          .map((img) => {
            const src = (img.src || "").trim();
            const label = (img.label || "").trim();
            let slug = (img.slug || "").trim() || slugify(label);
            let candidate = slug;
            let n = 2;
            while (usedSlugs.has(candidate)) {
              candidate = `${slug}-${n++}`;
            }
            usedSlugs.add(candidate);
            return {
              slug: candidate,
              src,
              label,
              tags: Array.isArray(img.tags) ? img.tags : [],
              description: (img.description || "").trim(),
              linkUrl: (img.linkUrl || "").trim(),
              linkLabel: (img.linkLabel || "").trim(),
              extraImages: Array.isArray(img.extraImages)
                ? img.extraImages.map((u) => (u || "").trim()).filter(Boolean)
                : [],
            };
          })
          .filter((img) => img.src)
      : oldData.additionalImages || [];

    const oldHomeHero = oldData.homeHero || {};
    const newHomeHero = {
      introText: (incomingHomeHero?.introText ?? oldHomeHero.introText) || "",
      backgroundColor: (incomingHomeHero?.backgroundColor ?? oldHomeHero.backgroundColor) || "",
      navLinks: Array.isArray(incomingHomeHero?.navLinks) ? incomingHomeHero.navLinks : (oldHomeHero.navLinks || []),
      profileImage: (incomingHomeHero?.profileImage ?? oldHomeHero.profileImage) || "",
      profileTooltip: (incomingHomeHero?.profileTooltip ?? oldHomeHero.profileTooltip) || "",
    };

    const newDataTs = renderDataTs(newDataProjects, newAdditionalImages, newHomeHero);
    const newProtectedJs = renderProtectedJs(newProtected);

    await ghPut("src/app/data.ts", newDataTs, dataFile.sha, "Admin panel: update project data");
    await ghPut("api/protected.js", newProtectedJs, protectedFile.sha, "Admin panel: update protected content");

    res.status(200).json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message || "Save failed" });
  }
}
