// Vercel serverless function — this file runs on the server only.
// It is never bundled into the client JavaScript, so the passwords and
// content below are not visible to site visitors until unlocked.
//
// To change a password without touching code: set an environment variable
// in Vercel (Project Settings -> Environment Variables) named e.g.
// META_PASSWORD, then redeploy so the function picks it up.
//
// To protect another project:
//   1. In src/app/data.ts, remove that project's `description`/`img` fields
//      and add `protected: true`.
//   2. Add an entry for it below, following the `meta` example.

const PROTECTED = {
  meta: {
    password: process.env.META_PASSWORD || "parrot",
    content: {
      description:
        "Product Design Lead across multiple surfaces — translating complex social infrastructure and platform features into clear, usable experiences at scale.",
      role: "",
      approach: "",
      outcome: "",
      metric: null, // e.g. { value: "3.2M", label: "monthly active users onboarded" }
      img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop&auto=format",
      gallery: [],
    },
  },
};

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
