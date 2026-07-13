// Vercel serverless function — this file runs on the server only.
// It is never bundled into the client JavaScript, so the passwords and
// content below are not visible to site visitors until unlocked.
//
// Managed by the /admin panel — edit protected project content and
// passwords there instead of hand-editing this file.

const PROTECTED = {
  "meta": {
    "password": "parrot",
    "content": {
      "description": "Product Design Lead across multiple surfaces — translating complex social infrastructure and platform features into clear, usable experiences at scale.",
      "role": "",
      "approach": "",
      "outcome": "",
      "metric": null,
      "img": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop&auto=format",
      "gallery": [],
      "demo": null
    }
  },
  "branch": {
    "password": "parrot",
    "content": {
      "description": "Designed core lending and financial product flows for Branch's mobile-first platform serving emerging markets across Africa and India.",
      "role": "",
      "approach": "",
      "outcome": "",
      "metric": null,
      "img": "https://images.unsplash.com/photo-1607705703571-c5a8695f18f6?w=800&h=600&fit=crop&auto=format",
      "gallery": [],
      "demo": { "url": "/work/branch/credit-score", "label": "Try the interactive credit score animation" }
    }
  },
  "ujet": {
    "password": "parrot",
    "content": {
      "description": "Shaped the product design direction for UJET's cloud contact-center platform — agent tooling, customer-facing flows, and omnichannel interaction design.",
      "role": "",
      "approach": "",
      "outcome": "",
      "metric": null,
      "img": "https://images.unsplash.com/photo-1686061592689-312bbfb5c055?w=800&h=600&fit=crop&auto=format",
      "gallery": [],
      "demo": null
    }
  }
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
